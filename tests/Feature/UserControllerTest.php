<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);
beforeEach(function () {
    \Pest\Laravel\actingAs(\App\Models\User::factory()->create());
});

test('User route exists', function () {
   $response = $this->get(route('dashboard.user.index'));
   $response->assertStatus(200);
});
