<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Traits\HasUuidKey;

class Permission extends SpatiePermission
{
    use HasUuidKey;

    protected $keyType = 'string';
    protected $primaryKey = 'id';
}
