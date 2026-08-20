import { usePage } from '@inertiajs/react';

import {
    LayoutGrid,
    ClipboardList,
    Package,
    Users,
    Building2,
    BarChart3,
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
            title: 'Análise de Pedidos',
            href: '/analise-pedidos',
            icon: BarChart3,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Produtos e Clientes
    |--------------------------------------------------------------------------
    | Somente Admin e Pedidos possuem acesso.
    |--------------------------------------------------------------------------
    */

    if (role === 'admin' || role === 'pedidos') {
        items.push(
            {
                title: 'Produtos',
                href: '/produtos',
                icon: Package,
            },

            {
                title: 'Clientes',
                href: '/clientes',
                icon: Building2,
            },
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Usuários
    |--------------------------------------------------------------------------
    */

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
    variant="sidebar"
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