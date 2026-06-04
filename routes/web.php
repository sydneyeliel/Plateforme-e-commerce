<?php

use App\Http\Controllers\Api\SocialAuthController;
use Illuminate\Support\Facades\Route;

// ── OAuth Social ──────────────────────────────────────────────
Route::get('/auth/{provider}/redirect',  [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback',  [SocialAuthController::class, 'callback']);

// Échange sécurisé : lit le token OAuth depuis la session flash et le retourne une seule fois
Route::get('/auth/token', function () {
    return response()->json(['token' => session()->pull('oauth_token')]);
});

// Toutes les autres routes gérées par React Router
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '(?!auth).*');