<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class ClienteRequest extends FormRequest
{


    public function authorize(): bool
    {
        return true;
    }





    public function rules(): array
    {
        return [


            'nome' => [

                'required',

                'string',

                'max:255',

            ],



            'cidade' => [

                'required',

                'string',

                'max:255',

            ],



            'estado' => [

                'required',

                'string',

                'max:2',

            ],



            'ativo' => [

                'boolean',

            ],


        ];
    }



}