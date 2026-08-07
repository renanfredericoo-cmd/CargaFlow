import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';


export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {

    console.log("APP SIDEBAR HEADER RENDER");

    return (
        <header className="flex h-12 shrink-0 items-center border-b border-sidebar-border/50 px-4 md:hidden">

            <SidebarTrigger className="-ml-1" />

        </header>
    );
}