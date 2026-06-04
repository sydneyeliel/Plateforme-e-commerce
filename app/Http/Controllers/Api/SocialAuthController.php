<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
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
            return redirect('/login?auth_error=1');
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
            $updateData['password'] = bcrypt(Str::random(32));
            $user = User::create($updateData);
        } else {
            $user->update($updateData);
        }

        $token = $user->createToken('api')->plainTextToken;

        // Code à usage unique stocké en cache (2 min) — le token ne passe jamais dans l'URL
        $code   = Str::random(40);
        $secure = app()->environment('production');

        Cache::put("oauth:{$code}", $token, now()->addMinutes(2));

        return redirect('/')->withCookie(
            cookie('oauth_exchange', $code, 2, '/', null, $secure, true, true, 'Lax')
        );
    }
}
