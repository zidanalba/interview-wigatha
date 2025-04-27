<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUuidKey
{
    /**
     * Boot the HasUuidKey trait for a model.
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            // Jika ID masih kosong, set ke UUID
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }
}
