'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HeartHandshake,
    ShieldAlert,
    Gavel,
    LocateFixed,
    Users,
    LayoutDashboard,
    FileText,
    Globe,
    LogOut,
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useLanguage } from "./language-provider";
import type { Language } from "@/lib/translations";
import { useLoading } from './loading-provider';
import { ReactNode } from 'react';

const SafeHavenLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M12 2L2 7V13.5C2 17.64 6.27 21.61 12 23C17.73 21.61 22 17.64 22 13.5V7L12 2ZM12 4.15L19.95 8.24V13.5C19.95 16.5 16.53 19.33 12.01 20.82C7.49 19.33 4.05 16.5 4.05 13.5V8.24L12 4.15Z" fill="currentColor"/>
        <path d="M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
    </svg>
)

const navItems = [
    { href: '/', labelKey: 'dashboardTitle', icon: LayoutDashboard },
    { href: '/emergency', labelKey: 'feature_emergency', icon: ShieldAlert },
    { href: '/report-incident', labelKey: 'feature_report', icon: FileText },
    { href: '/find-support', labelKey: 'feature_support', icon: HeartHandshake },
    { href: '/safe-locations', labelKey: 'feature_locations', icon: LocateFixed },
    { href: '/legal-rights', labelKey: 'feature_rights', icon: Gavel },
    { href: '/community', labelKey: 'feature_community', icon: Users },
];

const LoadingLink = ({ href, children, className }: { href: string, children: ReactNode, className?: string }) => {
    const { setIsLoading } = useLoading();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href !== pathname) {
            setIsLoading(true);
        }
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
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

function QuickExitButton() {
    const handleExit = () => {
        window.location.replace('https://www.google.com');
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleExit}>
            <LogOut className="mr-2" />
            Quick Exit
        </Button>
    );
}


export function Header() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <LoadingLink href="/" className="flex items-center space-x-2">
                        <SafeHavenLogo />
                        <span className="inline-block font-bold">SafeHaven</span>
                    </LoadingLink>
                </div>

                <nav className="hidden md:flex gap-2">
                    {navItems.map((item) => (
                         <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <LoadingLink
                                    href={item.href}
                                >
                                    <Button variant={pathname === item.href ? "secondary" : "ghost"} size="icon">
                                        <item.icon className="h-5 w-5" />
                                        <span className="sr-only">{t(item.labelKey as any)}</span>
                                    </Button>
                                </LoadingLink>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t(item.labelKey as any)}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </nav>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <QuickExitButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
