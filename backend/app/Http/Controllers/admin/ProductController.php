<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    // ✅ Return all products
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')
          ->with(['product_images','product_sizes'])
        ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    // ✅ Store a new product
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Store the product
        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();


         if(!empty($request->sizes)) {
             ProductSize::where('product_id',$product->id)->delete();
            foreach ($request->sizes as $sizeId) {
                $ProductSize = new ProductSize;
                $ProductSize->size_id = $sizeId;
                $ProductSize->product_id = $product->id;
                $ProductSize->save();
            }
        }

        // Save the product images
        if (!empty($request->gallery)) {
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                if ($tempImage) {
                    $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                    $imageName = $product->id . '-' . time() . '.' . $ext;

                    $manager = new ImageManager(new Driver());

                    // Large thumbnail
                    $img = $manager->read(public_path("uploads/temp/{$tempImage->name}"));
                    $img->scaleDown(1200);
                    $img->save(public_path("uploads/products/large/{$imageName}"));

                    // Small thumbnail
                    $img = $manager->read(public_path("uploads/temp/{$tempImage->name}"));
                    $img->coverDown(400, 460);
                    $img->save(public_path("uploads/products/small/{$imageName}"));


                    $productImage = new ProductImage();
                    $productImage->image = $imageName;
                    $productImage->product_id =  $product->id;
                    $productImage->save();

                    if ($key == 0) {
                        $product->image = $imageName;
                        $product->save();
                    }
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been created successfully'
        ], 200);
    }

    // ✅ Show a product
    public function show($id)
    {
        $product = Product::with(['product_images','product_sizes'])
                  ->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }

        $productSizes = $product->product_sizes()->pluck('size_id');

        return response()->json([
            'status' => 200,
            'data' => $product,
            'productSizes' => $productSizes
        ], 200);
    }

    // ✅ Update product
    public function update($id, Request $request)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku,' . $id,
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand_;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        if(!empty($request->sizes)) {
            ProductSize::where('product_id',$product->id)->delete();

            foreach ($request->sizes as $sizeId) {
                $ProductSize = new ProductSize;
                $ProductSize->size_id = $sizeId;
                $ProductSize->product_id = $product->id;
                $ProductSize->save();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been updated successfully'
        ], 200);
    }

    // ✅ Delete a product
    public function destroy($id)
    {
        $product = Product::with('product_images')->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }
        $product->delete();

        if ($product->product_images) {
            foreach($product->product_images as $productImage){
                File::delete(public_path('uploads/products/large/'.$productImage->image));
                File::delete(public_path('uploads/products/small/'.$productImage->image));
            }

        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been deleted successfully'
        ], 200);
    }

   public function saveProductImage(Request $request)
{
    // Validate the request
    $validator = Validator::make($request->all(), [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ], 400);
    }

    $image = $request->file('image');
    $imageName = $request->product_id . '-' . time() . '.' . $image->getClientOriginalExtension();

    // ✅ Resize and save using Intervention before move
    $manager = new ImageManager(Driver::class);

    // Large thumbnail
    $img = $manager->read($image->getPathname());
    $img->scaleDown(1200);
    $img->save(public_path('uploads/products/large/' . $imageName));

    // Small thumbnail
    $img = $manager->read($image->getPathname());
    $img->coverDown(400, 460);
    $img->save(public_path('uploads/products/small/' . $imageName));

    // ✅ Optionally store original (not required for thumbnails)
    $image->move(public_path('uploads/temp'), $imageName);

    // Save record
    $productImage = new ProductImage();
    $productImage->image = $imageName;
    $productImage->product_id = $request->product_id;
    $productImage->save();

    return response()->json([
        'status' => 200,
        'message' => 'Image has been uploaded successfully',
        'data' => [
            'id' => $productImage->id,
            'image_url' => asset('uploads/products/small/' . $imageName)
        ]
    ], 200);
}

public function updateDefaultImage(Request $request) {

    $product = Product::find($request->product_id);
    $product->image = $request->image;
    $product->save();

     return response()->json([
        'status' => 200,
        'message' => 'Product default image change successfully'
    ], 200);

}

public function deleteProductImage ($id) {
    $productImage = ProductImage::find ($id);
    if ($productImage == null) {
        return response()->json([
            'status' => 404,
            'message' => 'Image not found'
        ],404);

    }

    File::delete(public_path('uploads/products/large/'.$productImage->image));
    File::delete(public_path('uploads/products/small/'.$productImage->image));


    $productImage->delete();
     
    return response()->json([
        'status' => 200,
        'message' => 'Product image deleted successfully'
    ],200);

}

}
