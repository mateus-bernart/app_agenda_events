<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Responsible;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return inertia('Event/Index')->with('events', $events);
    }

    public function create(?string $date = null)
    {
        return inertia('Event/Create', [
            'initialDate' => $date,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'responsible_phone' => 'string|max:15|unique:responsibles,phone',
            'responsible_email' => 'email|max:255|unique:responsibles,email',
            'website_link' => 'nullable|url|max:255',
            'instagram_link' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $responsible = Responsible::create([
            'name' => $request->input('responsible_name'),
            'phone' => $validated['responsible_phone'] ?? null,
            'email' => $validated['responsible_email'] ?? null,
        ]);


        if (!$responsible->wasRecentlyCreated) {
            $responsible = Responsible::where('phone', $validated['responsible_phone'])
                ->orWhere('email', $validated['responsible_email'])
                ->first();
        }

        Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'location' => $validated['location'],
            'end_date' => $validated['end_date'],
            'user_id' => auth()->id(),
            'status' => 'pending',
            'responsible_id' => $responsible->id,
            'website_link' => $validated['website_link'],
            'instagram_link' => $validated['instagram_link'],
            'image' => $validated['image'] ? $request->file('image')->store('images', 'public') : null,
        ]);

        return Inertia::location(route('event.index'));
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return Inertia::location(route('event.index'));
    }
}
