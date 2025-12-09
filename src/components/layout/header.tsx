'use client'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "./language-provider";
import type { Language } from "@/lib/translations";

const pageTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/report-incident': 'Report an Incident',
    '/emergency': 'Emergency Guidance',
    '/legal-rights': 'Know Your Legal Rights',
    '/find-support': 'Find Support Resources',
    '/safe-locations': 'Find Safe Locations',
    '/community': 'Anonymous Community Board',
};

function LanguageSelector() {
    const { setLanguage } = useLanguage();

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Select Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('sw')}>Swahili</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('ki')}>Kikuyu</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function Header() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const title = pageTitles[pathname] ? t(pageTitles[pathname].toLowerCase().replace(/ /g, '_') as any) : 'SafeHaven';


    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                 <h1 className="text-lg font-semibold md:text-xl">{pathname === '/' ? t('dashboardTitle') : title}</h1>
            </div>
            <LanguageSelector />
        </header>
    );
}
