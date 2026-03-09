const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware for STK Push endpoint
 * Limits: 5 requests per minute per IP
 */
const stkPushLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many STK push requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter middleware for callback endpoint
 * Limits: 100 requests per minute (more lenient for M-Pesa server)
 */
const callbackLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => {
        // Skip rate limiting for M-Pesa callback IP addresses if needed
        // This can be enhanced with actual M-Pesa IP verification
        return false;
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { stkPushLimiter, callbackLimiter };
