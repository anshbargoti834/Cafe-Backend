const rateLimit = require('express-rate-limit');
const { globalRateLimitWindowMs, globalRateLimitMax, contactRateLimitWindowMs, contactRateLimitMax } = require('../config/env');


exports.globalRateLimiter = rateLimit({
windowMs: globalRateLimitWindowMs,
max: globalRateLimitMax,
standardHeaders: true,
legacyHeaders: false,
message: { success: false, message: 'Too many requests, please try again later.' }
});


exports.contactRateLimiter = rateLimit({
windowMs: contactRateLimitWindowMs,
max: contactRateLimitMax,
standardHeaders: true,
legacyHeaders: false,
message: { success: false, message: 'Too many contact requests from this IP, please try later.' }
});