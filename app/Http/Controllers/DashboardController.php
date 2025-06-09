<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return inertia('dashboard')->with([
            'events' => $events,
        ]);
    }
}
