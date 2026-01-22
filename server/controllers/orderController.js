const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { items, discount, paymentMode } = req.body;

        // Server-side verification
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const dbItem = await MenuItem.findById(item._id);
            if (!dbItem || !dbItem.isAvailable) {
                return res.status(400).json({ message: `Item ${item.name} is not available` });
            }
            const itemTotal = dbItem.price * item.quantity;
            subtotal += itemTotal;
            verifiedItems.push({
                name: dbItem.name,
                price: dbItem.price,
                quantity: item.quantity,
                total: itemTotal
            });
        }

        const gstRate = 0.05; // Configurable 5%
        const gst = Math.round(subtotal * gstRate);
        const grandTotal = Math.round(subtotal + gst - (discount || 0));

        // Generate sequential bill number (simplified for now)
        const orderCount = await Order.countDocuments();
        const billNumber = `BILL-${String(orderCount + 1).padStart(5, '0')}`;

        const newOrder = new Order({
            billNumber,
            items: verifiedItems,
            subtotal,
            gst,
            discount,
            grandTotal,
            paymentMode
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
