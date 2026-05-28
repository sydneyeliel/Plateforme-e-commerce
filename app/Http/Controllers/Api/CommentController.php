<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        $comments = $post->comments()
            ->whereNull('parent_id')
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, Post $post)
    {
        $data = $request->validate([
            'content'   => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $post->comments()->create([
            'user_id'   => $request->user()->id,
            'content'   => $data['content'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        $comment->load('user');
        return response()->json($comment, 201);
    }

    public function destroy(Request $request, Comment $comment)
    {
        abort_if($comment->user_id !== $request->user()->id && !$request->user()->isAdmin(), 403);
        $comment->delete();
        return response()->json(null, 204);
    }
}