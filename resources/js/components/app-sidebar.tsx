import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, ClipboardList, Users } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
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
            title: 'Tarefas',
            href: '/tasks',
            icon: ClipboardList,
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




const footerNavItems: NavItem[] = [


    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },


    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },


];





export function AppSidebar() {


    const { auth } = usePage().props as any;


    const mainNavItems = getMainNavItems(auth.user.role);



    return (

        <Sidebar collapsible="icon" variant="inset">


            <SidebarHeader>


                <SidebarMenu>


                    <SidebarMenuItem>


                        <SidebarMenuButton size="lg" asChild>


                            <Link href={dashboard()} prefetch>


                                <AppLogo />


                            </Link>


                        </SidebarMenuButton>


                    </SidebarMenuItem>


                </SidebarMenu>


            </SidebarHeader>





            <SidebarContent>


                <NavMain items={mainNavItems} />


            </SidebarContent>





            <SidebarFooter>


                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />


                <NavUser />


            </SidebarFooter>



        </Sidebar>

    );

}