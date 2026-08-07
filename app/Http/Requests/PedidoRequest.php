<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PedidoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Regras de validação.
     */
    public function rules(): array
    {
        return [

            'numero_pedido' => [
                'required',
                'string',
                'max:255',
            ],


            'data' => [
                'required',
                'date',
            ],


            'cliente' => [
                'required',
                'string',
                'max:255',
            ],


            'destino' => [
                'required',
                'string',
                'max:255',
            ],


            'produto_id' => [
                'required',
                'exists:produtos,id',
            ],


            'peso' => [
                'required',
                'numeric',
                'min:0',
            ],


            'tipo_frete' => [
                'required',
                'in:CIF,FOB',
            ],


            'vendedor' => [
                'required',
                'string',
                'max:255',
            ],


            'observacoes' => [
                'nullable',
                'string',
            ],

        ];
    }



    /**
     * Mensagens personalizadas.
     */
    public function messages(): array
    {
        return [

            'numero_pedido.required' => 'Informe o número do pedido.',


            'data.required' => 'Informe a data do pedido.',


            'cliente.required' => 'Informe o cliente.',


            'destino.required' => 'Informe o destino.',


            'produto_id.required' => 'Selecione o produto.',

            'produto_id.exists' => 'Produto inválido.',


            'peso.required' => 'Informe o peso.',

            'peso.numeric' => 'O peso deve ser um número.',


            'tipo_frete.required' => 'Selecione o tipo de frete.',

            'tipo_frete.in' => 'Frete inválido.',


            'vendedor.required' => 'Informe o vendedor.',

        ];
    }
}