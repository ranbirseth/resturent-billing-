const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    billNumber: { type: String, required: true, unique: true },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            total: { type: Number, required: true },
        }
    ],
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
