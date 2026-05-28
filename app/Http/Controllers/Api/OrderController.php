<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        abort_if($order->user_id !== $request->user()->id && !$request->user()->isAdmin(), 403);
        $order->load('items.product');
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Panier vide'], 422);
        }

        $total = $cart->items->sum(fn($i) => $i->quantity * $i->product->price);

        $order = Order::create([
            'user_id' => $user->id,
            'total'   => $total,
            'status'  => 'pending',
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'unit_price' => $item->product->price,
            ]);
            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();

        $order->load('items.product');
        return response()->json($order, 201);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->update($data);
        return response()->json($order);
    }
}