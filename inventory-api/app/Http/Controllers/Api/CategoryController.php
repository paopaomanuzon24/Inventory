<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('parent')
            ->withCount('products')
            ->orderBy('name')
            ->get();
        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return new CategoryResource($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->loadCount('products')->load('parent', 'children');
        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
     public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return new CategoryResource($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {


        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with existing products.'
            ], 422);
        }
        //update
        Product::onlyTrashed()->whereNotNull("category_id")->update(["category_id" => null]);

        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }

    public function tree() {
        // Parent categories with their children nested — used by dropdowns
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }
}
