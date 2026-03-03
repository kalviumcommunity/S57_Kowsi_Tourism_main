const mongoose = require('mongoose');
const config = require('./config/default.json');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
