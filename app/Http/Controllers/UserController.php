<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return inertia('User/Index', [
            'users' => User::all(),
        ]);
    }

    public function updateUserType(Request $request, $user)
    {
        // Logic to update user information
        $validatedData = $request->validate([
            'user_type' => 'required|in:admin,user,guest',
        ]);

        // Assuming User model is used
        $user = \App\Models\User::findOrFail($user);
        $user->update($validatedData);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
}
