const crypto = require('crypto');

/**
 * Verify M-Pesa callback signature
 * @param {Buffer} body - Raw request body
 * @param {string} signature - Signature from X-Safaricom-Signature header
 * @returns {boolean} True if signature is valid
 */
const verifyMPesaSignature = (body, signature) => {
    const certPath = process.env.MPESA_CERT_PATH;
    
    if (!certPath) {
        console.warn('MPESA_CERT_PATH not configured. Skipping signature verification.');
        return true;
    }

    try {
        const publicKey = require('fs').readFileSync(certPath, 'utf8');
        const verifier = crypto.createVerify('sha256');
        verifier.update(body);
        return verifier.verify(publicKey, Buffer.from(signature, 'base64'));
    } catch (error) {
        console.error('Signature verification error:', error.message);
        return false;
    }
};

/**
 * Middleware to verify M-Pesa callback authenticity
 */
const verifyCallback = (req, res, next) => {
    const signature = req.get('X-Safaricom-Signature');
    
    if (!signature) {
        console.warn('Missing signature header on callback');
        // For now, allow but log. In production, reject if cert is configured.
        return next();
    }

    const rawBody = req.rawBody || JSON.stringify(req.body);
    
    if (verifyMPesaSignature(rawBody, signature)) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Invalid callback signature'
        });
    }
};

module.exports = { verifyCallback, verifyMPesaSignature };
