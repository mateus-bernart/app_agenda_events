<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('schedule', [EventController::class, 'index'])->name('schedule.index');
    Route::get('schedule/create', [EventController::class, 'create'])->name('schedule.create');

    Route::post('schedule', [EventController::class, 'store'])->name('schedule.store');
    Route::delete('schedule/{event}', [EventController::class, 'destroy'])->name('schedule.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
