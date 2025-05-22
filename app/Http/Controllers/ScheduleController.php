<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return inertia('Schedule/Index')->with('events', $events);
    }

    public function create()
    {
        return inertia('Schedule/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('schedule.index')->with('message', 'Event created successfully.');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('schedule.index')->with('message', 'Event deleted successfully.');
    }
}
