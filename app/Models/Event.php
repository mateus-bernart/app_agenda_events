<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'user_id',
        'status',
        'responsible_id',
        'website_link',
        'instagram_link',
        'image',
    ];

    public function responsible()
    {
        return $this->belongsTo(Responsible::class, 'responsible_id');
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class);
    }
}
