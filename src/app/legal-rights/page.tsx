
'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gavel, Bookmark } from "lucide-react";

const legalInfo = [
  {
    question: "What is a restraining order (or protective order)?",
    answer: "A restraining order or protective order is a court order that helps protect someone from harassment or abuse. It can order the abusive person to stay away from you, your home, your work, and your family members. Violating this order is a criminal offense."
  },
  {
    question: "How do I report an incident to the police?",
    answer: "You can report an incident by calling 911 in an emergency or your local police department's non-emergency line. You can file a report at a police station. It's helpful to provide as much detail as you can remember. You have the right to have a support person with you."
  },
  {
    question: "What evidence is useful in a legal case?",
    answer: "Evidence can include photos of injuries, threatening emails or text messages, videos, torn clothing, and medical records. A journal documenting incidents with dates, times, and details can also be powerful. Keep evidence in a safe place."
  },
  {
    question: "Do I have to testify in court?",
    answer: "If criminal charges are filed, you may be called as a witness. This can be a difficult process, but there are victim advocates and support services available to help you through it. You have rights as a victim and witness, including the right to be treated with dignity and respect."
  },
  {
    question: "Can I get legal help for free?",
    answer: "Yes, there are many legal aid organizations that provide free legal services to survivors of domestic violence. They can help with restraining orders, divorce, custody, and other legal matters. Our 'Find Support' tool can help you find legal aid in your area."
  }
];

export default function LegalRightsPage() {
    const { toast } = useToast();

    const handleSaveInfo = (info: {question: string, answer: string}) => {
        // This is a placeholder for the actual save functionality
        toast({
            title: "Feature Coming Soon!",
            description: "You will soon be able to save resources to your dashboard.",
        });
        console.log("Saving info:", info.question);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/20 p-4 rounded-lg">
                            <Gavel className="size-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Know Your Rights</CardTitle>
                            <CardDescription>Information to help you navigate the legal system.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {legalInfo.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left hover:no-underline group">
                                    <div className="flex justify-between items-center w-full pr-2">
                                        <span>{item.question}</span>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent accordion from toggling
                                                handleSaveInfo(item);
                                            }}
                                        >
                                            <Bookmark className="size-4" />
                                        </Button>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground prose">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
