const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const menuItems = [
    { name: 'Butter Chicken', price: 350, category: 'Main Course' },
    { name: 'Paneer Tikka', price: 280, category: 'Starters' },
    { name: 'Dal Makhani', price: 220, category: 'Main Course' },
    { name: 'Naan', price: 40, category: 'Bread' },
    { name: 'Jeera Rice', price: 150, category: 'Rice' },
    { name: 'Cold Drink', price: 45, category: 'Beverages' },
    { name: 'Gulab Jamun', price: 80, category: 'Dessert' },
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secondwife_billing';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding');
        await MenuItem.deleteMany({});
        await MenuItem.insertMany(menuItems);
        console.log('Menu items seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
