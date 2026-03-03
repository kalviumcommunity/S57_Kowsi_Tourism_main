const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        await newUser.save();
        res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const { password: pw, ...rest } = user._doc;
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }).status(200).json({ token, data: { ...rest }, role: user.role, success: true, message: 'Successfully logged in' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
});

module.exports = router;
