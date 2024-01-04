const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true, 
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    offerPrice:{
        type:Number,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    flavour: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });



// Export the model
module.exports = mongoose.model('Product', productSchema);
