const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

app.disable('x-powered-by');

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'BusBook API is running'
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));

app.use((req, res) => {
    res.status(404).json({
        message: 'API route not found'
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.status || 500).json({
        message: error.message || 'Internal server error'
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`BusBook API running on http://localhost:${PORT}`);
    });
}

module.exports = app;
