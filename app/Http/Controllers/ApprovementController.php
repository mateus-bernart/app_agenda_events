<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovementController extends Controller
{
    public function index()
    {
        $events = Event::where('status', '!=', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('Approvement/Index', [
            'events' => $events,
        ]);
    }

    public function approval(Request $request, Event $event)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,pending,rejected',
            'approver_comment' => 'nullable|string|max:255',
        ]);

        $event->update([
            'status' => $validated['status'],
            'approver_comment' => $validated['approver_comment'],
            'approver_id' => auth()->id(),
        ]);

        return Inertia::location(route('approvements.index'));
        // return redirect()->route('approvements.index')->with('message', 'Event status updated successfully.');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return Inertia::location(route('approvements.index'));
        // return redirect()->route('approvements.index')->with('message', 'Event deleted successfully.');
    }
}
