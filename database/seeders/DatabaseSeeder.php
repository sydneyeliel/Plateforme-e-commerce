<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Utilisateurs ──────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@shop.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        $user1 = User::create([
            'name'     => 'Sydney Gnonlonfoun',
            'email'    => 'sydney@shop.com',
            'password' => Hash::make('password'),
            'role'     => 'client',
        ]);

        $user2 = User::create([
            'name'     => 'Marie Dupont',
            'email'    => 'marie@shop.com',
            'password' => Hash::make('password'),
            'role'     => 'client',
        ]);

        // ── Catégories ────────────────────────────────────────────
        $categories = [
            ['name' => 'Mobilier',      'description' => 'Chaises, tables, bureaux en 3D'],
            ['name' => 'Décoration',    'description' => 'Objets décoratifs imprimés en 3D'],
            ['name' => 'Électronique',  'description' => 'Accessoires tech modélisés en 3D'],
            ['name' => 'Luminaires',    'description' => 'Lampes et luminaires design'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // ── Produits ──────────────────────────────────────────────
        $products = [
            ['name' => 'Chaise ergonomique 3D',   'price' => 249.99, 'stock' => 15, 'category_id' => 1, 'description' => 'Chaise de bureau ergonomique modélisée en 3D, confort optimal.'],
            ['name' => 'Table basse hexagonale',   'price' => 189.00, 'stock' => 8,  'category_id' => 1, 'description' => 'Table basse au design hexagonal moderne.'],
            ['name' => 'Lampe géométrique',        'price' => 79.90,  'stock' => 25, 'category_id' => 4, 'description' => 'Lampe de bureau au design géométrique épuré.'],
            ['name' => 'Vase fractal',             'price' => 45.00,  'stock' => 30, 'category_id' => 2, 'description' => 'Vase aux formes fractales imprimé en PLA.'],
            ['name' => 'Support téléphone 3D',     'price' => 19.99,  'stock' => 50, 'category_id' => 3, 'description' => 'Support universel pour smartphone, réglable.'],
            ['name' => 'Étagère modulaire',        'price' => 129.00, 'stock' => 12, 'category_id' => 1, 'description' => 'Étagère en cubes modulaires empilables.'],
            ['name' => 'Boîte de rangement',       'price' => 29.90,  'stock' => 40, 'category_id' => 2, 'description' => 'Boîte de rangement imprimée en 3D avec couvercle clipsable.'],
            ['name' => 'Lustre sphérique',         'price' => 159.00, 'stock' => 6,  'category_id' => 4, 'description' => 'Lustre en sphères entrelacées, impression 3D.'],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['is_active' => true]));
        }

        // ── Publications réseau social ────────────────────────────
        $posts = [
            ['user_id' => $user1->id, 'content' => 'Venez découvrir notre nouvelle collection de meubles 3D ! Des designs uniques pour votre intérieur.'],
            ['user_id' => $user2->id, 'content' => 'Je viens de recevoir ma chaise ergonomique 3D, c\'est incroyable ! Qualité top.'],
            ['user_id' => $admin->id, 'content' => 'Nouveaux produits disponibles cette semaine : lampes géométriques et vases fractals !'],
            ['user_id' => $user1->id, 'content' => 'La modélisation 3D révolutionne le design d\'intérieur. Partagez vos créations !'],
        ];

        foreach ($posts as $p) {
            Post::create($p);
        }
    }
}