
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
import { useLanguage } from '@/components/layout/language-provider';


const features = [
  {
    titleKey: 'feature_report',
    descriptionKey: 'feature_report_desc',
    href: '/report-incident',
    icon: FileText,
    ctaKey: 'feature_report_cta',
  },
  {
    titleKey: 'feature_emergency',
    descriptionKey: 'feature_emergency_desc',
    href: '/emergency',
    icon: ShieldAlert,
    ctaKey: 'feature_emergency_cta',
  },
  {
    titleKey: 'feature_support',
    descriptionKey: 'feature_support_desc',
    href: '/find-support',
    icon: HeartHandshake,
    ctaKey: 'feature_support_cta',
  },
  {
    titleKey: 'feature_rights',
    descriptionKey: 'feature_rights_desc',
    href: '/legal-rights',
    icon: Gavel,
    ctaKey: 'feature_rights_cta',
  },
  {
    titleKey: 'feature_locations',
    descriptionKey: 'feature_locations_desc',
    href: '/safe-locations',
    icon: LocateFixed,
    ctaKey: 'feature_locations_cta',
  },
   {
    titleKey: 'feature_community',
    descriptionKey: 'feature_community_desc',
    href: '/community',
    icon: Users,
    ctaKey: 'feature_community_cta',
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
  const { t } = useLanguage();

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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('heroTitle')}</h1>
          <p className="mt-2 max-w-2xl text-lg text-primary-foreground/90">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.titleKey} className="flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-accent/20 p-3 rounded-lg">
                        <feature.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle>{t(feature.titleKey as any)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{t(feature.descriptionKey as any)}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={feature.href} onClick={() => handleLinkClick(feature.href)}>
                    {t(feature.ctaKey as any)} <ArrowRight className="ml-2 size-4" />
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
                        <CardTitle>{t('didYouKnow')}</CardTitle>
                        <CardDescription>{t('didYouKnowSubtitle')}</CardDescription>
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
