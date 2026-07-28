import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    function filterReports() {

        router.get('/reports', {
            start_date: startDate,
            end_date: endDate,
        });

    }


    return (
        <>
            <Head title="Relatórios" />

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    📊 Relatórios
                </h1>

                {startDate && endDate && (

    <p className="mt-4 text-sm text-gray-500">
        Período analisado:

        <strong className="ml-2">
            {startDate} até {endDate}
        </strong>

    </p>

)}

                <div className="mt-6 flex flex-wrap gap-4 items-end">

    <div>
        <label className="block text-sm text-gray-500">
            Data inicial
        </label>

        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border p-2"
        />
    </div>


    <div>
        <label className="block text-sm text-gray-500">
            Data final
        </label>

        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border p-2"
        />
    </div>


<button
    onClick={filterReports}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white"
>
    🔍 Filtrar
</button>


<button
    onClick={() => {
        setStartDate('');
        setEndDate('');

        router.get('/reports');
    }}
    className="rounded-lg border px-5 py-2"
>
    🧹 Limpar
</button>

<button
    onClick={() => {
        window.open(
            `/reports/pdf?start_date=${startDate}&end_date=${endDate}`,
            '_blank'
        );
    }}
    className="rounded-lg bg-green-600 px-5 py-2 text-white"
>
    📄 Gerar PDF
</button>


</div>


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