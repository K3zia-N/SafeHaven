
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, ShieldAlert, Gavel, Users, FileText, LocateFixed, MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useState, useEffect, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay"
import { useLoading } from '@/components/layout/loading-provider';


const features = [
  {
    title: 'Report an Incident',
    description: 'Safely and anonymously document an incident. Your voice matters.',
    href: '/report-incident',
    icon: FileText,
    cta: 'Start Report',
  },
  {
    title: 'Emergency Guidance',
    description: 'Immediate steps to take and emergency contacts for critical situations.',
    href: '/emergency',
    icon: ShieldAlert,
    cta: 'Get Help Now',
  },
  {
    title: 'Find Support',
    description: 'Connect with local shelters, counseling, and support groups.',
    href: '/find-support',
    icon: HeartHandshake,
    cta: 'Find Resources',
  },
  {
    title: 'Know Your Rights',
    description: 'Learn about your legal rights and the procedures for justice.',
    href: '/legal-rights',
    icon: Gavel,
    cta: 'Learn More',
  },
  {
    title: 'Safe Locations',
    description: 'Find nearby police stations, hospitals, and other safe places.',
    href: '/safe-locations',
    icon: LocateFixed,
    cta: 'Find Locations',
  },
   {
    title: 'Community Board',
    description: 'Share and connect with others in a safe, anonymous space.',
    href: '/community',
    icon: Users,
    cta: 'Visit Board',
  },
];

const didYouKnowFacts = [
    "In Kenya, 45% of women and girls aged 15-49 have experienced physical violence since age 15.",
    "The 2022 Kenya Demographic and Health Survey indicates that 1 in 5 young women have experienced sexual violence.",
    "Many GBV cases in Kenya go unreported due to stigma, fear of retaliation, or lack of faith in the justice system. Anonymous reporting can help change this.",
    "Economic abuse, where a partner controls finances to limit independence, is a significant and often hidden form of GBV."
];

const heroImage = PlaceHolderImages.find(img => img.id === "hero-1");

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const { setIsLoading } = useLoading();

  const handleLinkClick = (href: string) => {
    if (href !== window.location.pathname) {
      setIsLoading(true);
    }
  };


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in-50">
      <section className="relative w-full h-80 rounded-xl overflow-hidden bg-primary/20">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">You are not alone.</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground/90">
            SafeHaven is a secure and anonymous platform providing support, resources, and a voice for survivors of gender-based violence.
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-accent/20 p-3 rounded-lg">
                        <feature.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={feature.href} onClick={() => handleLinkClick(feature.href)}>
                    {feature.cta} <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center w-full">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl"
        >
          <CarouselContent>
            {didYouKnowFacts.map((fact, index) => (
              <CarouselItem key={index}>
                <Card className="bg-accent/30 border-accent h-full">
                    <CardHeader>
                        <CardTitle>Did You Know?</CardTitle>
                        <CardDescription>Insights on GBV cases in Kenya.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic">"{fact}"</p>
                    </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}
