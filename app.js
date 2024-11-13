const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const app = express();
const PORT = 3000;
let maliciousUrls = [];
fs.createReadStream(path.join(__dirname, 'malicious_urls.csv'))
    .pipe(csv())
    .on('data', (row) => {
        maliciousUrls.push(row.url.trim());
    })
    .on('end', () => {
        console.log('Malicious URLs loaded');
    });
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.post('/check-url', (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    const isSafe = !maliciousUrls.includes(url);
    res.json({ is_safe: isSafe });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});