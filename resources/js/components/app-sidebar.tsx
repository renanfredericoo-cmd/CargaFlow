import { usePage } from '@inertiajs/react';

import {
    LayoutGrid,
    ClipboardList,
    Package,
    Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';



function getMainNavItems(role: string): NavItem[] {

    const items: NavItem[] = [

        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },

        {
            title: 'Pedidos',
            href: '/pedidos',
            icon: ClipboardList,
        },

        {
            title: 'Produtos',
            href: '/produtos',
            icon: Package,
        },

    ];


    if (role === 'admin') {

        items.push({

            title: 'Usuários',
            href: '/users',
            icon: Users,

        });

    }


    return items;
}



export function AppSidebar() {

    const { auth } = usePage().props as any;

    const mainNavItems = getMainNavItems(auth.user.role);


    return (

        <Sidebar
            collapsible="offcanvas"
            variant="inset"
        >

            <SidebarHeader>
            </SidebarHeader>


            <SidebarContent>

                <NavMain items={mainNavItems} />

            </SidebarContent>


            <SidebarFooter>

                <NavUser />

            </SidebarFooter>


        </Sidebar>

    );
}