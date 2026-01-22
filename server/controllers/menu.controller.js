const MenuItem = require('../models/MenuItem');

// Get all menu items (filterable by category, excludes deleted)
exports.getMenuItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isDeleted: false };
        if (category) {
            query.category = category;
        }
        const items = await MenuItem.find(query);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
    try {
        const { name, price, category, isAvailable } = req.body;
        const newItem = new MenuItem({
            name,
            price,
            category,
            isAvailable: isAvailable ?? true
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { name, price, category, isAvailable } = req.body;
        const item = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { name, price, category, isAvailable },
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Toggle availability of a menu item
exports.toggleMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.isAvailable = !item.isAvailable;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft delete a menu item
exports.softDeleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully (soft delete)' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
