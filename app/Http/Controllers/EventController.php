<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return inertia('Event/Index')->with('events', $events);
    }

    public function create()
    {
        return inertia('Event/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
            'approver_comment' => 'nullable|string',
        ]);

        Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'location' => $validated['location'],
            'end_date' => $validated['end_date'],
            'approver_id' => auth()->id(),
            'approver_comment' => $validated['approver_comment'] ?? null,
            'user_id' => auth()->id(),
        ]);
        return Inertia::location(route('event.index'));
        // return redirect()->route('event.index')->with('message', 'Event created successfully.');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return Inertia::location(route('event.index'));
        // return redirect()->route('event.index')->with('message', 'Event deleted successfully.');
    }
}
