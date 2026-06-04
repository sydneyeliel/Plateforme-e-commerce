<?php

use App\Http\Controllers\Api\SocialAuthController;
use Illuminate\Support\Facades\Route;

// ── OAuth Social ──────────────────────────────────────────────
Route::get('/auth/{provider}/redirect',  [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback',  [SocialAuthController::class, 'callback']);

// Toutes les autres routes gérées par React Router
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '(?!auth).*');