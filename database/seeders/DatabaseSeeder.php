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

        // ── Catégories (matching la maquette) ─────────────────────
        $categories = [
            ['name' => 'Tech',   'description' => 'Gadgets, audio et interfaces numériques'],
            ['name' => 'Living', 'description' => 'Objets de décoration et luminaires'],
            ['name' => 'Wear',   'description' => 'Chaussures, lunettes et accessoires portables'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // ── Produits (matching la maquette) ───────────────────────
        // category_id : 1=Tech  2=Living  3=Wear
        $products = [
            [
                'name'        => 'Kinetik Chrono',
                'price'       => 249.00,
                'stock'       => 12,
                'category_id' => 1,
                'description' => 'A precision-engineered 3D timepiece featuring procedural textures and dynamic lighting maps.',
                'image'       => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
            ],
            [
                'name'        => 'Sonic Monolith',
                'price'       => 599.00,
                'stock'       => 8,
                'category_id' => 1,
                'description' => 'Ultra-high fidelity audio simulation model with customizable haptic response points.',
                'image'       => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
            ],
            [
                'name'        => 'Aero Sprint V2',
                'price'       => 180.00,
                'stock'       => 25,
                'category_id' => 3,
                'description' => 'Fully rigged footwear asset optimized for avatar movement and real-time physics.',
                'image'       => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80',
            ],
            [
                'name'        => 'Lume Sculpture',
                'price'       => 320.00,
                'stock'       => 6,
                'category_id' => 2,
                'description' => 'Interactive lighting object with adjustable color temperature and intensity scripts.',
                'image'       => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80',
            ],
            [
                'name'        => 'Volt Runner X',
                'price'       => 210.00,
                'stock'       => 18,
                'category_id' => 3,
                'description' => 'High-performance digital textile asset featuring advanced PBR material layering.',
                'image'       => 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop&q=80',
            ],
            [
                'name'        => 'Onyx Interface',
                'price'       => 1150.00,
                'stock'       => 4,
                'category_id' => 1,
                'description' => 'A complete workspace set for virtual environments with functional screen shaders.',
                'image'       => 'https://images.unsplash.com/photo-1593640408182-31c228b42e7d?w=600&h=600&fit=crop&q=80',
            ],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['is_active' => true]));
        }

        // ── Publications réseau social ────────────────────────────
        $posts = [
            ['user_id' => $user1->id, 'content' => 'Just finished the final render for the "Glitch" series. Experimenting with iridescent refractive shaders and heavy tactile displacement. What do you think of the texture?'],
            ['user_id' => $user2->id, 'content' => 'The Obsidian Lounge is now open for virtual tours in the Showroom. Proud to have collaborated with the Aetheria team on this lighting setup.'],
            ['user_id' => $admin->id, 'content' => 'New drops this week: Kinetik Chrono and Sonic Monolith are now live. View them in 3D before you buy!'],
            ['user_id' => $user1->id, 'content' => 'The Aero Sprint V2 is everything I hoped for. The rig is clean, physics are buttery smooth.'],
            ['user_id' => $user2->id, 'content' => 'Working on a new lighting pack for interior spaces. The volumetric fog effects are insane — sneak peek coming this weekend.'],
            ['user_id' => $user1->id, 'content' => 'Hot take: procedural textures are going to replace hand-painted assets within 5 years. The level of detail you get from a good noise function is unreal.'],
            ['user_id' => $admin->id, 'content' => 'Showroom update: you can now spin any object 360° directly in your browser. No VR headset needed. Try it on the Lume Sculpture.'],
            ['user_id' => $user2->id, 'content' => 'Finally cracked subsurface scattering on the new organic material kit. The skin shader alone took 3 days — worth every hour.'],
            ['user_id' => $user1->id, 'content' => 'Reminder that the Onyx Interface is limited to 4 units. Once they\'re gone, they\'re gone. Grabbed mine yesterday.'],
            ['user_id' => $admin->id, 'content' => 'Community milestone: 500 objects sold on Aetheria. Thank you all — bigger drops are coming next month.'],
        ];

        foreach ($posts as $p) {
            Post::create($p);
        }
    }
}
