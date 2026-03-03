const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Tour = require('../models/Tour');

// Create Review
router.post('/:tourId', async (req, res) => {
    const tourId = req.params.tourId;
    const newReview = new Review({ ...req.body, productId: tourId });

    try {
        const savedReview = await newReview.save();

        // Update the tour reviews array
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
});

// Get All Reviews for a Tour
router.get('/:tourId', async (req, res) => {
    const tourId = req.params.tourId;
    try {
        const reviews = await Review.find({ productId: tourId });
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
});

module.exports = router;
