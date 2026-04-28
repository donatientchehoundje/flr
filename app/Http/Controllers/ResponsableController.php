<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Responsable;
use App\Models\Service;
use Inertia\Inertia;

class ResponsableController extends Controller
{
    public function index()
    {
        return Inertia::render('Responsables/Index', [
            'responsables' => Responsable::with('services')->latest()->get(),
            'services' => Service::all(),
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:services,id',
            'user_id' => 'nullable|exists:users,id',
            'nom' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
        ]);

        $serviceIds = $validated['service_ids'];
        unset($validated['service_ids']);

        $responsable = Responsable::create($validated);
        $responsable->services()->sync($serviceIds);

        return redirect()->back()->with('message', 'Responsable ajouté.');
    }

    public function update(Request $request, Responsable $responsable)
    {
        $validated = $request->validate([
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:services,id',
            'user_id' => 'nullable|exists:users,id',
            'nom' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email',
        ]);

        $serviceIds = $validated['service_ids'];
        unset($validated['service_ids']);

        $responsable->update($validated);
        $responsable->services()->sync($serviceIds);

        return redirect()->back()->with('message', 'Responsable mis à jour.');
    }

    public function destroy(Responsable $responsable)
    {
        $responsable->delete();
        return redirect()->back()->with('message', 'Responsable supprimé.');
    }
}
