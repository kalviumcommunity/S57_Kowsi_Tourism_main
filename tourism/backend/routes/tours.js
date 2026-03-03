const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// Create new tour
router.post('/', async (req, res) => {
    const newTour = new Tour(req.body);
    try {
        const savedTour = await newTour.save();
        res.status(200).json({ success: true, message: 'Successfully created', data: savedTour });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
});

// Get all tours
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find({});
        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
});

// Get tour by search
router.get("/search/getTourBySearch", async (req, res) => {
    const city = new RegExp(req.query.city, "i");
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        const tours = await Tour.find({
            city,
            distance: { $gte: distance },
            maxGroupSize: { $gte: maxGroupSize },
        });

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "not found",
        });
    }
});

// Get featured tour
router.get("/search/getFeaturedTours", async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).limit(8);

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "not found",
        });
    }
});

// Get tour counts
router.get("/search/getTourCount", async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount();

        res.status(200).json({ success: true, data: tourCount });
    } catch (err) {
        res.status(500).json({ success: false, message: "failed to fetch" });
    }
});

module.exports = router;
