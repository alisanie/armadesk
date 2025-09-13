<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandelDeactiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (auth()->check() && auth()->user()->status == 'deactivated') {
            auth()->logout();
            //return home page with session user is not active
            return redirect()->route('login')->withErrors([
                __('Your account has been deactivated. Please contact your administrator.'),
            ]);
        }
        return $next($request);
    }
}
