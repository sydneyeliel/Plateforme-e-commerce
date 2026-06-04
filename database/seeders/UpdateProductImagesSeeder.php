<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class UpdateProductImagesSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            'Kinetik Chrono'  => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
            'Sonic Monolith'  => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
            'Aero Sprint V2'  => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80',
            'Lume Sculpture'  => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80',
            'Volt Runner X'   => 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop&q=80',
            'Onyx Interface'  => 'https://images.unsplash.com/photo-1593640408182-31c228b42e7d?w=600&h=600&fit=crop&q=80',
        ];

        foreach ($images as $name => $url) {
            Product::where('name', $name)->update(['image' => $url]);
        }
    }
}
