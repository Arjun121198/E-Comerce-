const fs = require('fs');
const path = require('path');
const Category = require('../models/category');
const { uploadImage } = require('../utils/imageUpload'); 
const axios = require('axios');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class CategoryController {

    // Create category with image
    createCategory = async (req, res) => {
        try {
            if (!req.files || !req.files.image) {
                return errorResponse(res, 400, 'No image file uploaded');
            }

            const uploadFolder = path.join(__dirname, '../../uploads/categories');
            const imagePath = await uploadImage(req.files.image, uploadFolder);

            const category = await Category.create({
                name: req.body.name,
                image: imagePath, 
            });

            return successResponse(res, 201, 'Category created successfully', category);
        } catch (error) {
            return errorResponse(res, 500, 'Error creating category', error.message);
        }
    };

    // Get all categories
    getAllCategories = async (req, res) => {
        try {
            const categories = await Category.find();
            return successResponse(res, 200, 'Categories fetched successfully', categories);
        } catch (error) {
            return errorResponse(res, 500, 'Error fetching categories', error.message);
        }
    };

    // Update category
    updateCategory = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return errorResponse(res, 404, 'Category not found');
            }

            let imagePath = category.image; 

            if (req.files && req.files.image) {
                const uploadFolder = path.join(__dirname, '../../uploads/categories');
                imagePath = await uploadImage(req.files.image, uploadFolder);

                // Delete old image if it exists
                if (category.image) {
                    const oldImagePath = path.join(__dirname, '../../', category.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            category.name = req.body.name || category.name;
            category.image = imagePath;

            await category.save();

            return successResponse(res, 200, 'Category updated successfully', category);
        } catch (error) {
            return errorResponse(res, 500, 'Error updating category', error.message);
        }
    };

    // Delete category
    deleteCategory = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return errorResponse(res, 404, 'Category not found');
            }

            if (category.image) {
                const imagePath = path.join(__dirname, '../../', category.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await Category.findByIdAndDelete(categoryId);

            return successResponse(res, 200, 'Category deleted successfully');
        } catch (error) {
            return errorResponse(res, 500, 'Error deleting category', error.message);
        }
    };

    // Fetch Products from Third Party API
    fetchProduct = async (req, res) => {
        try {
            const apiUrl = 'https://fakestoreapi.com/products/';
            const response = await axios.get(apiUrl);

            return successResponse(res, 200, 'Data fetched successfully', response.data);
        } catch (error) {
            return errorResponse(res, 500, 'Error fetching data', error.message);
        }
    };
}

module.exports = new CategoryController();
