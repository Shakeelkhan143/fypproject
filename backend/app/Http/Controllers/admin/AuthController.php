<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Mail;
use Str;

class AuthController extends Controller
{
    public function authenticate(Request $request) {
        
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if($validator->fails()) {

            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);

        }

        if(Auth ::attempt(['email' => $request->email,'password' => $request->password])) {
                $user = User::find(Auth::user()->id);

                if ($user->role == 'admin') {

                    $token = $user->createToken('token')->plainTextToken;

                     return response()->json([
                'status' => 200,
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name                   
              ],200);

                } else {
                     return response()->json([
                'status' => 401,
                'message' => 'You are not authorized to access admin panel.'
                     ],401);
                }
        }
        else{
            return response()->json([
                'status' => 401,
                'message' => 'Either email/password is incorrect.'
            ],401);
        }
    }
     public function sendResetLinkEmail(Request $request)
    {
        
        // Get the user
        $user = User::where('email', $request->email)->first();

        if(!$user){
             return response()->json(['status' => 'error', 'message' => 'User not found, please enter a valid email.']);
        }
        // Generate token
        $token = Str::random(64);

        // Store token in password_resets table
        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );

        // Generate reset link
        $resetLink = env('FRONTEND_URL').'/password/reset?token='.$token.'&email=' . urlencode($user->email);

        // Send email manually
        Mail::html("
    <html>
    <head>
        <style>
            .container {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                background-color: #f7f7f7;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            .btn {
                display: inline-block;
                padding: 12px 20px;
                margin-top: 20px;
                color: #fff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Hello {$user->name},</h2>
            <p>You recently requested to reset your password. Click the button below to proceed:</p>

            <a href='{$resetLink}' class='btn'>Reset Password</a>

            <p>If you didn’t request a password reset, you can safely ignore this email.</p>

            <div class='footer'>
                <p>— Online Dresses Mqrt</p>
            </div>
        </div>
    </body>
    </html>
", function ($message) use ($user) {
    $message->to($user->email);
    $message->subject('Reset Your Password');
});


        return response()->json(['status'=>'success', 'message' => 'Reset link sent to your email.']);
    }

     public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|confirmed|min:6',
        ]);

        $passwordReset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$passwordReset || Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Invalid or expired token.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete reset record
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
}
