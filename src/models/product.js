const mongoose = require('mongoose');
const { OFFER_TYPES } = require('../utils/enums/offerType');

const productSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    offer_type: {
        type: Number,
        enum: [OFFER_TYPES.NO_OFFER, OFFER_TYPES.DISCOUNT, OFFER_TYPES.BUY_ONE_GET_ONE], 
        default: OFFER_TYPES.NO_OFFER
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);