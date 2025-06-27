const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { generateShortCode, getCurrentTimestamp } = require('../utils/urlUtils');

const dbPath = path.join(__dirname, '../data/store.json');

// Helper to read and write JSON
const readData = () => JSON.parse(fs.readFileSync(dbPath));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// POST /shorturls
router.post('/shorturls', (req, res) => {
    const { url, validity, shortcode } = req.body;
    const data = readData();

    const code = shortcode || generateShortCode();
    if (data[code]) {
        return res.status(400).json({ error: 'Shortcode already exists' });
    }

    const expiry = new Date(Date.now() + (validity || 30) * 60 * 1000); // in ms

    data[code] = {
        originalURL: url,
        expiry: expiry.toISOString(),
        createdAt: getCurrentTimestamp(),
        clicks: [],
    };

    writeData(data);
    res.json({
        shortLink: `http://localhost:5000/${code}`,
        expiry: expiry.toISOString()
    });
});

// GET /shorturls/:shortcode
router.get('/shorturls/:code', (req, res) => {
    const data = readData();
    const code = req.params.code;
    const entry = data[code];

    if (!entry) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    res.json({
        createdAt: entry.createdAt,
        expiry: entry.expiry,
        clickCount: entry.clicks.length,
        clicks: entry.clicks
    });
});

// GET /:shortcode → redirect
router.get('/:code', (req, res) => {
    const data = readData();
    const code = req.params.code;
    const entry = data[code];

    if (!entry) {
        return res.status(404).send('Shortcode not found');
    }

    const now = new Date();
    const expiry = new Date(entry.expiry);
    if (now > expiry) {
        return res.status(410).send('Shortcode expired');
    }

    entry.clicks.push({
        timestamp: getCurrentTimestamp(),
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || null,
        ip: req.ip
    });

    writeData(data);
    res.redirect(entry.originalURL);
});

module.exports = router;
