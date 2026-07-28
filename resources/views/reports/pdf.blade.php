<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">

    <title>Relatório TaskFlow</title>

    <style>

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        h1 {
            text-align: center;
            margin-bottom: 5px;
        }

        h2 {
            margin-top: 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th {
            background: #eeeeee;
        }

        th, td {
            border: 1px solid #cccccc;
            padding: 8px;
            text-align: left;
        }


    </style>

</head>

<body>


<h1>
    TaskFlow
</h1>


<h2>
    Relatório de Atividades
</h2>

@if($period['start'] && $period['end'])

<p>
    <strong>Período analisado:</strong>

    {{ \Carbon\Carbon::parse($period['start'])->format('d/m/Y') }}

    até

    {{ \Carbon\Carbon::parse($period['end'])->format('d/m/Y') }}
</p>

@endif

<h3>
    Resumo
</h3>


<table>

    <tr>
        <th>
            Total
        </th>

        <td>
            {{ $summary['total'] }}
        </td>
    </tr>


    <tr>
        <th>
            Pendentes
        </th>

        <td>
            {{ $summary['pending'] }}
        </td>
    </tr>


    <tr>
        <th>
            Em andamento
        </th>

        <td>
            {{ $summary['progress'] }}
        </td>
    </tr>


    <tr>

    <th>
        Concluídas
    </th>

    <td>
        {{ $summary['completed'] }}
    </td>

</tr>


<tr>

    <th>
        Atrasadas
    </th>

    <td>
        {{ $summary['overdue'] }}
    </td>

</tr>

</table>



<h3>
    Tarefas
</h3>


<table>

    <thead>

        <tr>

            <th>
                Tarefa
            </th>

            <th>
                Responsável
            </th>

            <th>
                Status
            </th>

            <th>
                Prazo
            </th>

        </tr>

    </thead>


    <tbody>


    @foreach($tasks as $task)

        <tr>

            <td>
                {{ $task->title }}
            </td>


            <td>
                {{ $task->user->name ?? 'Sem responsável' }}
            </td>


<td>

    @if($task->status === 'pendente')

    Pendente

@elseif($task->status === 'andamento')

    Em andamento

@elseif($task->status === 'concluida')

    Concluída

@else

    {{ $task->status }}

@endif

</td>


           <td>
    {{ \Carbon\Carbon::parse($task->due_date)->format('d/m/Y') }}
</td>


        </tr>


    @endforeach


    </tbody>


</table>


</body>
</html>