'use client'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const pageTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/report-incident': 'Report an Incident',
    '/emergency': 'Emergency Guidance',
    '/legal-rights': 'Know Your Legal Rights',
    '/find-support': 'Find Support Resources',
    '/safe-locations': 'Find Safe Locations',
    '/community': 'Anonymous Community Board',
};


export function Header() {
    const pathname = usePathname();
    const title = pageTitles[pathname] ?? 'SafeHaven';

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
        </header>
    );
}
