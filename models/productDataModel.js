const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    productType: {
        type: String,
        enum: ['print', 'promotional'] 
    },
    productImage: String
});

module.exports = mongoose.model('products', ProductSchema);