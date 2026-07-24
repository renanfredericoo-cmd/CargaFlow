<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {


            $table->text('completion_note')
                ->nullable()
                ->after('status');


            $table->timestamp('completed_at')
                ->nullable()
                ->after('completion_note');


            $table->foreignId('completed_by')
                ->nullable()
                ->after('completed_at')
                ->constrained('users')
                ->nullOnDelete();


        });
    }



    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {


            $table->dropForeign(['completed_by']);


            $table->dropColumn([
                'completion_note',
                'completed_at',
                'completed_by',
            ]);


        });
    }
};