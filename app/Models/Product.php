<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'description', 'price',
        'stock', 'image', 'model_3d_path', 'is_active',
    ];

    protected $casts = [
        'price'     => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function averageRating(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function isInStock(): bool
    {
        return $this->stock > 0;
    }
}
