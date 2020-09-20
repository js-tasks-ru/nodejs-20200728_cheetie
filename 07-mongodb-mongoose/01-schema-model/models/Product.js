const mongoose = require('mongoose');
const connection = require('../libs/connection');

const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: ObjectId,
        required: true
    },
    images: [String]
});

module.exports = connection.model('Product', productSchema);
