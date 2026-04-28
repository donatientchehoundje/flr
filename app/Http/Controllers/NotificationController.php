<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->string('status')->value() ?: 'all';

        $query = AppNotification::query()->latest();
        if ($status === 'unread') {
            $query->where('is_read', false);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => $query->limit(200)->get(),
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function markAsRead(AppNotification $notification)
    {
        $notification->update(['is_read' => true]);

        return redirect()->back()->with('message', 'Notification marquée comme lue.');
    }

    public function markAllAsRead()
    {
        AppNotification::where('is_read', false)->update(['is_read' => true]);

        return redirect()->back()->with('message', 'Toutes les notifications ont été marquées comme lues.');
    }
}
