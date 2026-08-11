export interface Pedido {

    id: number;

    codigo: string;

    numero_pedido: string;

    data: string;

    data_entrega?: string;

    cliente_id?: number | string;

    cliente:
        | string
        | {
            id: number;
            nome: string;
        };

    destino: string;

    produto_id: number;

    produto?: {
        id: number;
        descricao: string;
    };

    peso: number;

    tipo_frete: 'CIF' | 'FOB';

    vendedor: string;

    observacoes?: string;

    status:
        | 'Pedido'
        | 'Agendado'
        | 'Em Carregamento'
        | 'Faturado'
        | 'Cancelado';

    transportadora?: string;

    motorista?: string;

    placa?: string;

    data_agendamento?: string;

    hora_agendamento?: string;

    data_carregamento?: string;

    hora_carregamento?: string;

    inicio_carregamento_at?: string;

    fim_carregamento_at?: string;

    numero_nfe?: string;

    hora_faturamento?: string;

    atraso_carregamento?: number | null;

    proxima_acao: string;

    created_at: string;

    updated_at: string;
}