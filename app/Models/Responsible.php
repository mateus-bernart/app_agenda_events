<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Responsible extends Model
{
    protected $fillable = [
        'users_id',
        'phone',
        'email',
    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'responsible_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
