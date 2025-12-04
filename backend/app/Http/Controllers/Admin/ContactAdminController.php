<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactAdminController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Contact::latest()->paginate(20),
        ]);
    }

    public function show(Contact $contact)
    {
        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa liên hệ.'
        ]);
    }
}
