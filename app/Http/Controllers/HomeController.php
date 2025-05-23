<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $events = Event::all();
        return inertia('welcome', [
            'events' => $events,
            'user' => $user
        ]);
    }
}
