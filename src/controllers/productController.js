const Product = require('../models/product');
const path = require('path');
const { uploadImage } = require('../utils/imageUpload');
const OfferType = require('../utils/enums/offerType'); // Import OfferType class
const { successResponse, errorResponse } = require('../utils/responseHelper'); // Import the helper functions

class ProductController {
    // Create a new product
    createProduct = async (req, res) => {
        // try {
            const { category_id, name, description, offer_type, price } = req.body;
            const { image } = req.files || {};
            // Validate required fields
            if (!category_id || !name || !description || !price || !image) {
                return errorResponse(res, 400, 'Missing required fields. Category, name, description, price, and image are required.');
            }

            // Validate offer type
            const offerTypeInt = parseInt(offer_type, 10); // Convert to integer
            if (!Object.values(OfferType.OFFER_TYPES).includes(offerTypeInt)) {
                return errorResponse(res, 400, `Invalid offer type. Allowed values are: ${Object.values(OfferType.OFFER_TYPES).join(', ')}`);
            }

            // Upload the image
            const uploadFolder = path.join(__dirname, '../../uploads/products');
            const imagePath = await uploadImage(image, uploadFolder);

            // Create the product instance
            const newProduct = new Product({ category_id, name, image: imagePath, description, offer_type, price });

            // Save the product
            const savedProduct = await newProduct.save();

            return successResponse(res, 201, 'Product created successfully', savedProduct);
        // } catch (error) {
        //     return errorResponse(res, 500, 'Failed to create product', error.message);
        // }
    };

    getAllProducts = async (req, res) => {
        try {
            const products = await Product.find().populate('category_id', 'name').lean();

            if (!products || products.length === 0) {
                return errorResponse(res, 404, 'No products found');
            }

            // Rename `category_id` to `category_detail` in each product
            const formattedProducts = products.map(({ category_id, ...product }) => ({
                ...product,
                offer_type: OfferType.castOfferType(product.offer_type),
                category_detail: category_id, // Rename category_id to category_detail
            }));

            return successResponse(res, 200, 'Products fetched successfully', formattedProducts);
        } catch (error) {
            return errorResponse(res, 500, 'Failed to fetch products', error.message);
        }
    };
}

module.exports = new ProductController();
