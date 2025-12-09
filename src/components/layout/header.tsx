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

const LoadingLink = ({ href, children, className, variant, size = 'default' }: { href: string, children: ReactNode, className?: string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null, size?: "default" | "sm" | "lg" | "icon" | null }) => {
    const { setIsLoading } = useLoading();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href !== pathname) {
            setIsLoading(true);
        }
    };

    return (
        <Button asChild variant={variant} size={size} className={className}>
            <Link href={href} onClick={handleClick}>
                {children}
            </Link>
        </Button>
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
            <LogOut className="mr-2 h-4 w-4" />
            Quick Exit
        </Button>
    );
}


export function Header() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container grid h-16 grid-cols-3 items-center">
                <div className="flex items-center justify-start">
                    <Link href="/" className="flex items-center space-x-2">
                        <SafeHavenLogo />
                        <span className="inline-block font-bold">SafeHaven</span>
                    </Link>
                </div>

                <nav className="hidden md:flex justify-center gap-2">
                    {navItems.map((item) => (
                         <LoadingLink
                            key={item.href}
                            href={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            size="sm"
                            className="group transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:ml-2">
                                {t(item.labelKey as any)}
                            </span>
                        </LoadingLink>
                    ))}
                </nav>

                <div className="flex items-center justify-end space-x-2">
                    <LanguageSelector />
                    <QuickExitButton />
                </div>
            </div>
        </header>
    );
}
