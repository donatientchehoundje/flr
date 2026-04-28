<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activity;
use App\Models\Service;

class ActivityController extends Controller
{
    public function store(Request $request, Service $service)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $service->activities()->create($validated);

        return redirect()->back()->with('message', 'Activité ajoutée.');
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return redirect()->back()->with('message', 'Activité supprimée.');
    }
}
