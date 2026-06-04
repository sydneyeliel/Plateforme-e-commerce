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
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQIxrhaMteHNsUvET7473yNBy9i9cRC-EWTWVwLSSLV6of3Ap8733mE-ujh-9H_OxMsWoHFsDtMxIYefVh4dUSd9xZpLXwSTxkoTAo21LiTmUYJbTWQRPoH0i__FfgslsWROOAKqpVb7KSkvEQd69vUcqGgq0aXsWYWVLCVXHzXPYoEPte25y-0vgEdJHyXdjmbP0v4ktRTSl15c1ywzkQqlMWG2CNbHRuikewr3jBrJoCXIIAF2C16CAw33tKsZtEQHXmh7KXUo',
            ],
            [
                'name'        => 'Sonic Monolith',
                'price'       => 599.00,
                'stock'       => 8,
                'category_id' => 1,
                'description' => 'Ultra-high fidelity audio simulation model with customizable haptic response points.',
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDagwFUUr7T48zGZouTzQqYO_3ktr6qx0fmGH88s1UOAqAIlO4x0EO_wyw3Ll0Z_0H6kFSnNraXCMsLkejuf5aAllk0wpbEirzZVHNn2oUcw-1DBfjrCxoNefPlhyWsStmRjB3-Ra-dAwT5um1aRVEM3D0tbDuPSj69A-2ysdicHQwR8mImjxkNZNTt3o51UvKLRFaQKv4Ca0uiU2fWvfjzZuk2F4b08fbWxotnok4RYjET3Xs808ycOk-AQXU0E87gmu-IR1FvCdY',
            ],
            [
                'name'        => 'Aero Sprint V2',
                'price'       => 180.00,
                'stock'       => 25,
                'category_id' => 3,
                'description' => 'Fully rigged footwear asset optimized for avatar movement and real-time physics.',
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebbKPpzWTxgWm4yPhaQCOUKOT3M547gR2u0BlaxMhUGt9vxM9jPOcNUPZQaxJDfT9W_Jd_eyRC0CN8AGz6Z-EvrhFaqoWeLKn5beeorAJGWj3jPUG0X7Pyuc3PjpFbzIS5T7THFzzgGHaD4OuWsiebW7h0_tAFezeUqQojQaSRYtcuGG1RFMGwZw0FogRHs6fRo9yPpmZZIlsuagGNwQSKw1TOcRwKMFob3dmIJsQZGt8HqxhyGLmfAcCnHiNuyH9Gar-dbAeOfE',
            ],
            [
                'name'        => 'Lume Sculpture',
                'price'       => 320.00,
                'stock'       => 6,
                'category_id' => 2,
                'description' => 'Interactive lighting object with adjustable color temperature and intensity scripts.',
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI3xrao_zOnHCFXfra0lZeNC2jpcloIJ1WG8IJOfQhO0-gCrg0JEEsPtQ1QNxpNCsRBL-xaDR1cPgphPt5q7CAbNTcrlGzzO12RKSRvWoxm_wdaBHLzbmN010mOMp22UHNW9eYCG2dgF-psjRIiovjoEeMFzWrGef4-Q4marXlSCyYK1rvGn4z6L98rdDUKLDjostVZrqcR55JBO7fy2JcKgJQaZ-sbyQVAOquysH37RH23E6y6ZTZ3ch-jXBGTIJRAWB7N9G-pMs',
            ],
            [
                'name'        => 'Volt Runner X',
                'price'       => 210.00,
                'stock'       => 18,
                'category_id' => 3,
                'description' => 'High-performance digital textile asset featuring advanced PBR material layering.',
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxml4Qu1PMB_rcM5iHDDJ_nbvhfU87U5pc69L8pfKhrRrtGTnvzVJvMBKFKAHMk-yTMV66QJOlDQIdNnfx4jV9PG3CILY41PQp0vRxK5OsoO2RhwlBOvAX1huLtQ7EiwRCFZCFJAThoZx7OSKCoCotQuq5eIzF8F3zh3JacLYA4RFDG__C_xxHpeGGroX8Gw6nHWT8nBCmLlw2y3z0mGplW8b-79YBRDZAlYrXmAFL1VTtL1Ek7H_lBpXhGBRCmYJAWTiNjZcfSPk',
            ],
            [
                'name'        => 'Onyx Interface',
                'price'       => 1150.00,
                'stock'       => 4,
                'category_id' => 1,
                'description' => 'A complete workspace set for virtual environments with functional screen shaders.',
                'image'       => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASR9-QzpBp59YLegyot90Xwltf_ly3w0c2eqeSUsndnFk_wIQObbIr0AVO3VZrKRBkd0ScGBzmk6oYVGdv1zpBTbTvcbdAjhRMCmIabzrquCUz7KqpbDFUmFb2pSXL-p_Ehuf_aqq7UunD59mDqqdBX1B3UwGnzfymxNrtf6CIAxMilWi0IjKZYFQhA7ldHbrtllBaU62LAUrjlmDgpPJ6PmvvfoUu0Ew68PZc1WFaJdS90nQEcs90_MsuYuVmEMVGBEZH_MGk9a0',
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
