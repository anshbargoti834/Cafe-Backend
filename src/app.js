const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { globalRateLimiter } = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');
const { allowedOrigins, nodeEnv } = require('./config/env');
const authRoutes = require('./routes/auth.routes');


const menuRoutes = require('./routes/menu.routes');
const reservationRoutes = require('./routes/reservation.routes');
const contactRoutes = require('./routes/contact.routes');


const app = express();


// Basic security
app.disable('x-powered-by');
app.use(helmet());


// Logging
if (nodeEnv !== 'production') app.use(morgan('dev'));


// Rate limiting - global
app.use(globalRateLimiter);


// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/uploads',  express.static('uploads'));



// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());


// CORS
const corsOpts = {
origin: function (origin, callback) {
if (!origin) return callback(null, true); // allow non-browser clients like curl
if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
callback(new Error('Not allowed by CORS'));
}
}
};
app.use(cors(corsOpts));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);


// Health check
app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));


// Error handling (should be last)
app.use(errorHandler);


module.exports = app;