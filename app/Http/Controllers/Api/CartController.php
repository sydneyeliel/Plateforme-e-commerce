<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function index(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load('items.product');
        $cart->total = $cart->items->sum(fn($i) => $i->quantity * $i->product->price);
        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);
        if ($product->stock < $data['quantity']) {
            return response()->json(['message' => 'Stock insuffisant'], 422);
        }

        $cart = $this->getOrCreateCart($request);
        $item = $cart->items()->where('product_id', $data['product_id'])->first();

        if ($item) {
            $item->increment('quantity', $data['quantity']);
        } else {
            $cart->items()->create($data);
        }

        $cart->load('items.product');
        return response()->json($cart, 201);
    }

    public function updateItem(Request $request, CartItem $item)
    {
        $this->authorizeItem($request, $item);

        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        $item->update($data);

        return response()->json($item->load('product'));
    }

    public function removeItem(Request $request, CartItem $item)
    {
        $this->authorizeItem($request, $item);
        $item->delete();
        return response()->json(null, 204);
    }

    public function clear(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();
        return response()->json(['message' => 'Panier vidé']);
    }

    private function authorizeItem(Request $request, CartItem $item): void
    {
        $cart = $this->getOrCreateCart($request);
        abort_if($item->cart_id !== $cart->id, 403);
    }
}