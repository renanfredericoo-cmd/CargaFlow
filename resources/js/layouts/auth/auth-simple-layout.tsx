import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {

    return (

        <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-4 md:gap-6 md:p-10">


            <div className="w-full max-w-sm">


                <div className="flex flex-col gap-6 md:gap-8">



                    <div className="flex flex-col items-center gap-3 md:gap-4">


                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >


                            <div className="mb-2 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl">

                                <AppLogoIcon className="size-12 md:size-16 fill-current text-[var(--foreground)] dark:text-white" />

                            </div>


                            <span className="sr-only">
                                {title}
                            </span>


                        </Link>




                        <div className="space-y-2 text-center">


                            <h1 className="text-lg font-medium md:text-xl">
                                {title}
                            </h1>



                            <p className="text-center text-xs text-muted-foreground md:text-sm">
                                {description}
                            </p>



                        </div>



                    </div>



                    {children}



                </div>



            </div>



        </div>

    );

}