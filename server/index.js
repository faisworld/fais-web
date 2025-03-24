const express = require('express');
const bodyParser = require('body-parser');
const verifyRecaptcha = require('./verifyRecaptcha');

const app = express();
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
    const token = req.body.token;
    const isHuman = await verifyRecaptcha(token);
    if (!isHuman) {
        return res.status(400).json({ message: 'Failed reCAPTCHA verification' });
    }
    // ...existing code to handle form submission...
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
