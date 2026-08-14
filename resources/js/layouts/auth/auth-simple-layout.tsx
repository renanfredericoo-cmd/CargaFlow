import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4 md:p-10">

            <div className="w-full max-w-sm">

                <div className="flex flex-col gap-6 md:gap-8">

                    {/* Logo e identidade */}
                    <div className="flex flex-col items-center">

                        <Link
                            href={home()}
                            className="flex items-center justify-center"
                        >
                            <img
                                src="/images/cargaflow-login-header.png"
                                alt="CargaFlow"
                                className="w-full max-w-[280px] object-contain"
                            />
                        </Link>

                    </div>

                    {/* Formulário */}
                    {children}

                </div>

            </div>

        </div>
    );
}