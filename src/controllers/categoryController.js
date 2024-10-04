const fs = require('fs');
const path = require('path');
const Category = require('../models/category'); // Import Category model
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class CategoryController {

    // Create category with image
    createCategory = async (req, res) => {
        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'No image file uploaded' });
            }

            const imageFile = req.files.image;
            const uploadFolder = path.join(__dirname, '../../uploads/categories');

            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, { recursive: true });
            }

            const uniqueFileName = `${uuidv4()}_${imageFile.name}`;
            const imagePath = path.join(uploadFolder, uniqueFileName);

            imageFile.mv(imagePath, async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Image upload failed', error: err });
                }

                const category = await Category.create({
                    name: req.body.name,
                    image: `/uploads/categories/${uniqueFileName}`, 
                });

                return res.status(201).json({
                    message: 'Category created successfully',
                    category,
                });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating category', error : error.message  });
        }
    };

    // Get all categories
    getAllCategories = async (req, res) => {
        try {
            const categories = await Category.find();
            return res.status(200).json({
                message: 'Categories fetched successfully',
                categories,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching categories', error : error.message  });
        }
    };

    // Update category
    updateCategory = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            let imagePath = category.image; 

            if (req.files && req.files.image) {
                const imageFile = req.files.image;
                const uploadFolder = path.join(__dirname, '../../uploads/categories');

                if (!fs.existsSync(uploadFolder)) {
                    fs.mkdirSync(uploadFolder, { recursive: true });
                }

                const uniqueFileName = `${uuidv4()}_${imageFile.name}`;
                imagePath = path.join(uploadFolder, uniqueFileName);

                imageFile.mv(imagePath, async (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Image upload failed', error: err });
                    }

                    if (category.image) {
                        const oldImagePath = path.join(__dirname, '../../', category.image);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }
                });

                imagePath = `/uploads/categories/${uniqueFileName}`; 
            }

            category.name = req.body.name || category.name;
            category.image = imagePath;

            await category.save();

            return res.status(200).json({
                message: 'Category updated successfully',
                category,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating category', error : error.message  });
        }
    };

    // Delete category
    deleteCategory = async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            if (category.image) {
                const imagePath = path.join(__dirname, '../../', category.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await Category.findByIdAndDelete(categoryId);

            return res.status(200).json({
                message: 'Category deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting category', error : error.message });
        }
    };

    //Fetch Products from Third Party API
    fetchProduct = async (req, res) => {
        try {
            const apiUrl = 'https://fakestoreapi.com/products/';
            const response = await axios.get(apiUrl);

            return res.status(200).json({
                message: 'Data fetched successfully',
                data: response.data
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching data',
                error: error.message
            });
        }
    };
}

module.exports = new CategoryController();
