import { Head } from '@inertiajs/react';

interface Props {
    reports: {
        total: number;
        pending: number;
        progress: number;
        completed: number;
        overdue: number;
    };
}

export default function Reports({ reports }: Props) {

    return (
        <>
            <Head title="Relatórios" />

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    📊 Relatórios
                </h1>


                <div className="mt-8 grid gap-4 md:grid-cols-5">


                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">

                        <h2 className="text-gray-500">
                            📋 Total
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {reports.total}
                        </p>

                    </div>



                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">

                        <h2 className="text-gray-500">
                            ⏳ Pendentes
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {reports.pending}
                        </p>

                    </div>



                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">

                        <h2 className="text-gray-500">
                            🚀 Em andamento
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {reports.progress}
                        </p>

                    </div>



                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">

                        <h2 className="text-gray-500">
                            ✅ Concluídas
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {reports.completed}
                        </p>

                    </div>



                    <div className="rounded-xl border bg-white p-6 dark:bg-neutral-900">

                        <h2 className="text-gray-500">
                            🚨 Atrasadas
                        </h2>

                        <p className="mt-2 text-3xl font-bold">
                            {reports.overdue}
                        </p>

                    </div>


                </div>

            </div>
        </>
    );
}