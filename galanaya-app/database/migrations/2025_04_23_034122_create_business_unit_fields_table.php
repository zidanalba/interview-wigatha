<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_unit_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('business_unit_id');
            $table->uuid('business_field_id');
            $table->timestamps();

            $table->foreign('business_unit_id')->references('id')->on('business_units')->onDelete('cascade');
            $table->foreign('business_field_id')->references('id')->on('business_fields')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_unit_fields');
    }
};
