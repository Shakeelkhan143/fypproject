<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File; // ✅ Added for folder check

class TempImageController extends Controller
{
    //This method will store the temparary image
    public function store(Request $request){

        //Validate the request 
        $validator = Validator::make($request->all(),[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif'
        ]);

        if ($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        //Store the image
        $tempImage = new TempImage();
        $tempImage->name = 'Dummy';
        $tempImage->save();

        $image = $request->file('image');
        $imageName = time().'.'.$image->extension();
        $image->move(public_path('uploads/temp'), $imageName);

        $tempImage->name = $imageName;
        $tempImage->save();

        // ✅ Ensure thumbnail folder exists
        $thumbPath = public_path('uploads/temp/thumb');
        if (!File::exists($thumbPath)) {
            File::makeDirectory($thumbPath, 0755, true);
        }

        // Create thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/temp/' . $imageName));
        $img->coverDown(400, 450);
        $img->save(public_path('uploads/temp/thumb/' . $imageName));

        return response()->json([
            'status' => 200,
            'message' => 'Image has been uploaded successfully',
            'data' =>  $tempImage
        ],200);
    }
}
