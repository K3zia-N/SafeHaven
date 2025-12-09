'use client';

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
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/emergency', label: 'Emergency Guide', icon: ShieldAlert },
];

const toolsItems = [
    { href: '/report-incident', label: 'Report Incident', icon: FileText },
    { href: '/find-support', label: 'Find Support', icon: HeartHandshake },
    { href: '/safe-locations', label: 'Safe Locations', icon: LocateFixed },
]

const resourcesItems = [
    { href: '/legal-rights', label: 'Legal Rights', icon: Gavel },
    { href: '/community', label: 'Community Board', icon: Users },
]

const SafeHavenLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
        <path d="M12 2L2 7V13.5C2 17.64 6.27 21.61 12 23C17.73 21.61 22 17.64 22 13.5V7L12 2ZM12 4.15L19.95 8.24V13.5C19.95 16.5 16.53 19.33 12.01 20.82C7.49 19.33 4.05 16.5 4.05 13.5V8.24L12 4.15Z" fill="currentColor"/>
        <path d="M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
    </svg>
)

export function AppSidebar() {
  const pathname = usePathname();

  const renderMenuItems = (items: typeof menuItems) => items.map((item) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild
        isActive={pathname === item.href}
        className="w-full"
        tooltip={{ children: item.label }}
      >
        <Link href={item.href}>
          <item.icon className="size-5" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
        <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary p-2 rounded-lg flex-shrink-0">
                <SafeHavenLogo />
            </div>
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">SafeHaven</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {renderMenuItems(menuItems)}
          <Separator className="my-2" />
          {renderMenuItems(toolsItems)}
          <Separator className="my-2" />
          {renderMenuItems(resourcesItems)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground p-4 text-center">
          You are not alone.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
