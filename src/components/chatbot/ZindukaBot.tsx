'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquareHeart, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { chatWithZinduka } from '@/ai/flows/zinduka-bot';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export function ZindukaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithZinduka({ message: input });
      const botMessage: Message = { sender: 'bot', text: response.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'bot', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
      console.error("ZindukaBot error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([{ sender: 'bot', text: 'Hello! I am ZindukaBot. "Zinduka" means "Rise Up". I\'m here to offer a listening ear and help you find your way around the app. How are you feeling today?' }]);
            setIsLoading(false);
        }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleChat} size="lg" className="rounded-full shadow-lg">
          {isOpen ? <X /> : <MessageSquareHeart />}
          <span className="sr-only">{isOpen ? 'Close Chat' : 'Open Chat'}</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in fade-in-50 slide-in-from-bottom-5">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary"/>
                ZindukaBot
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={toggleChat}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-3", msg.sender === 'user' ? 'justify-end' : '')}>
                                {msg.sender === 'bot' && <div className="p-2 bg-primary/20 rounded-full"><Bot className="size-5 text-primary" /></div>}
                                <p className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    {msg.text}
                                </p>
                                {msg.sender === 'user' && <div className="p-2 bg-muted rounded-full"><User className="size-5" /></div>}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/20 rounded-full"><Bot className="size-5 text-primary" /></div>
                                <p className="bg-muted rounded-lg px-3 py-2">
                                    <Loader2 className="size-5 animate-spin"/>
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
