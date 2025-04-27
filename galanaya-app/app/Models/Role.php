<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;
use Illuminate\Support\Str;
use App\Traits\HasUuidKey;

class Role extends SpatieRole
{
    use HasUuidKey;

    protected $keyType = 'string';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'guard_name'
    ];
}
