<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function follow(Request $request, User $user)
    {
        $me = $request->user();

        if ($me->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous suivre vous-même'], 422);
        }

        Follow::firstOrCreate([
            'follower_id'  => $me->id,
            'following_id' => $user->id,
        ]);

        return response()->json(['following' => true]);
    }

    public function unfollow(Request $request, User $user)
    {
        Follow::where('follower_id', $request->user()->id)
            ->where('following_id', $user->id)
            ->delete();

        return response()->json(['following' => false]);
    }

    public function followers(User $user)
    {
        $followers = $user->followers()->paginate(20);
        return response()->json($followers);
    }

    public function following(User $user)
    {
        $following = $user->following()->paginate(20);
        return response()->json($following);
    }
}