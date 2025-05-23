<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return inertia('welcome', [
            'events' => $events,
        ]);
    }
}
