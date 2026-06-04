<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:20,1');

// Échange du code OAuth httpOnly contre le vrai token (usage unique, 2 min)
Route::post('/auth/exchange', function (Request $request) {
    $code = $request->cookie('oauth_exchange');

    if (!$code || strlen($code) !== 40) {
        return response()->json(['token' => null]);
    }

    $token = Cache::pull("oauth:{$code}");

    $response = response()->json(['token' => $token]);

    if ($token) {
        $response->withCookie(cookie()->forget('oauth_exchange'));
    }

    return $response;
})->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // ── Panier ────────────────────────────────────────────────────────────────
    Route::get('/cart',             [CartController::class, 'index']);
    Route::post('/cart/items',      [CartController::class, 'addItem']);
    Route::put('/cart/items/{item}',   [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
    Route::delete('/cart',          [CartController::class, 'clear']);

    // ── Commandes ─────────────────────────────────────────────────────────────
    Route::get('/orders',          [OrderController::class, 'index']);
    Route::get('/orders/{order}',  [OrderController::class, 'show']);
    Route::post('/orders',         [OrderController::class, 'store']);

    // ── Publications ──────────────────────────────────────────────────────────
    Route::post('/posts',                    [PostController::class, 'store']);
    Route::put('/posts/{post}',              [PostController::class, 'update']);
    Route::delete('/posts/{post}',           [PostController::class, 'destroy']);
    Route::post('/posts/{post}/like',        [PostController::class, 'toggleLike']);
    Route::post('/posts/{post}/comments',    [CommentController::class, 'store']);
    Route::delete('/comments/{comment}',     [CommentController::class, 'destroy']);

    // ── Suivis ────────────────────────────────────────────────────────────────
    Route::post('/users/{user}/follow',      [FollowController::class, 'follow']);
    Route::delete('/users/{user}/follow',    [FollowController::class, 'unfollow']);

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::middleware('can:admin')->group(function () {
        Route::post('/products',          [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::post('/categories',             [CategoryController::class, 'store']);
        Route::put('/categories/{category}',   [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });
});

// ── Publique ──────────────────────────────────────────────────────────────────
Route::get('/products',            [ProductController::class, 'index']);
Route::get('/products/{product}',  [ProductController::class, 'show']);
Route::get('/categories',          [CategoryController::class, 'index']);
Route::get('/posts',               [PostController::class, 'index']);
Route::get('/posts/{post}',        [PostController::class, 'show']);
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::get('/users/{user}/followers', [FollowController::class, 'followers']);
Route::get('/users/{user}/following', [FollowController::class, 'following']);