<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect(string $provider)
    {
        abort_unless(in_array($provider, ['github', 'google']), 404);
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        abort_unless(in_array($provider, ['github', 'google']), 404);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception) {
            return redirect('/?auth_error=true');
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        $updateData = [
            'name'   => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
            'avatar' => $socialUser->getAvatar(),
        ];

        if ($provider === 'google') {
            $updateData['google_id'] = $socialUser->getId();
        }

        if (!$user) {
            $updateData['email']    = $socialUser->getEmail();
            $updateData['password'] = bcrypt(Str::random(24));
            $user = User::create($updateData);
        } else {
            $user->update($updateData);
        }

        $token = $user->createToken('api')->plainTextToken;
        session()->flash('oauth_token', $token);

        return redirect('/');
    }
}
