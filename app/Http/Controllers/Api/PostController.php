<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()?->id;

        $posts = Post::with(['user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(15);

        if ($userId) {
            $posts->getCollection()->transform(function ($post) use ($userId) {
                $post->liked_by_me = $post->likes()->where('user_id', $userId)->exists();
                return $post;
            });
        }

        return response()->json($posts);
    }

    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        $post->loadCount(['likes', 'comments']);
        return response()->json($post);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
            'image'   => 'nullable|image|mimes:jpeg,png,webp,gif|max:5120',
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path     = $request->file('image')->store('posts', 'public');
            $imageUrl = asset('storage/' . $path);
        }

        $post = $request->user()->posts()->create([
            'content' => $request->input('content'),
            'image'   => $imageUrl,
        ]);

        $post->load('user');
        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        abort_if($post->user_id !== $request->user()->id, 403);

        $data = $request->validate(['content' => 'required|string|max:2000']);
        $post->update($data);
        return response()->json($post);
    }

    public function destroy(Request $request, Post $post)
    {
        abort_if($post->user_id !== $request->user()->id && !$request->user()->isAdmin(), 403);
        $post->delete();
        return response()->json(null, 204);
    }

    public function toggleLike(Request $request, Post $post)
    {
        $user = $request->user();

        if ($post->isLikedBy($user)) {
            $post->likes()->where('user_id', $user->id)->delete();
            $liked = false;
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $liked = true;
        }

        return response()->json(['liked' => $liked, 'likes_count' => $post->likes()->count()]);
    }
}