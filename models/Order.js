const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    state: {
        type: String,
        default: 'Pending'
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Order', OrdersSchema);