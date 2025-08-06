<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\OrderController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\front\ProductController as FrontProductController;

// Public Routes
Route::post('/admin/login', [AuthController::class, 'authenticate']);
Route::post('/account/forget-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/account/reset-password', [AuthController::class, 'resetPassword']);
Route::get('get-latest-products', [FrontProductController::class, 'latestProducts']);
Route::get('get-featured-products', [FrontProductController::class, 'featuredProducts']);
Route::get('get-categories', [FrontProductController::class, 'getCategories']);
Route::get('get-brands', [FrontProductController::class, 'getBrands']);
Route::get('get-products', [FrontProductController::class, 'getProducts']);
Route::get('get-product/{id}', [FrontProductController::class, 'getProduct']);
Route::post('register', [AccountController::class, 'register']);
Route::post('login', [AccountController::class, 'authenticate']);

Route::group(['middleware' => ['auth:sanctum','checkUserRole']],function(){
   Route::post('save-order', [OrderController::class, 'saveOrder']);
   Route::get('get-order-details/{id}', [AccountController::class, 'getOrderDetails']);
});

// Protected Routes (require authentication)
Route::group(['middleware' => ['auth:sanctum','checkAdminRole']],function() {
    
    // Category Routes
    Route::resource('categories', CategoryController::class);

    // Brand Routes
    Route::resource('brands', BrandController::class);

    // Size Routes (only index is exposed)
    Route::get('sizes', [SizeController::class, 'index']);

    // Product Routes
    Route::resource('products', ProductController::class);

    // Temp Image Upload (for gallery, thumbnails, etc.)
    Route::post('temp-images', [TempImageController::class, 'store']);

    // save product image 
    Route::post('save-product-image', [ProductController::class, 'saveProductImage']);
    Route::get('change-product-default-image', [ProductController::class, 'updateDefaultImage']);
    Route::delete('delete-product-image/{id}', [ProductController::class, 'deleteProductImage']);

    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/${id}', [AdminOrderController::class, 'detail']);






    
});




