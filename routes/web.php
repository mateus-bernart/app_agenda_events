<?php

use App\Http\Controllers\AgendaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('agenda', [AgendaController::class, 'index'])->name('agenda.index');
    Route::get('agenda/create', [AgendaController::class, 'create'])->name('agenda.create');
    Route::post('agenda', [AgendaController::class, 'store'])->name('agenda.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
