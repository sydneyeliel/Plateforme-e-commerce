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

        $user = User::updateOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name'      => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                'password'  => bcrypt(Str::random(24)),
                'avatar'    => $socialUser->getAvatar(),
                'google_id' => $provider === 'google' ? $socialUser->getId() : null,
            ]
        );

        $token = $user->createToken('api')->plainTextToken;

        return redirect('/?token=' . $token);
    }
}
