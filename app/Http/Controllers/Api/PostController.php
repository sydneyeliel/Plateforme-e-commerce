<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(15);

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
        $data = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $post = $request->user()->posts()->create($data);
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