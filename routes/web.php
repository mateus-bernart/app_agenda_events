<?php

use App\Http\Controllers\ApprovementController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('event', [EventController::class, 'index'])->name('event.index');
    Route::get('event/create', [EventController::class, 'create'])->name('event.create');

    Route::post('event', [EventController::class, 'store'])->name('event.store');
    Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');
    Route::put('event/{event}/approval', [ApprovementController::class, 'approval'])->name('approvements.approval');

    Route::get('approvement', [ApprovementController::class, 'index'])->name('approvements.index');
    Route::delete('approvement/{event}', [ApprovementController::class, 'destroy'])->name('approvements.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
