<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Size;

class ProductSize extends Model
{
    protected $fillable = ['product_id', 'size_id', 'quantity'];

    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }
}
