/**
 * Generate M-Pesa password (base64 encoded)
 * @param {string} timestamp - M-Pesa formatted timestamp
 * @returns {string} Base64 encoded password
 */
const getPassword = (timestamp) => {
    const shortCode = process.env.BUSINESS_SHORT_CODE;
    const passKey = process.env.PASS_KEY;
    
    if (!shortCode || !passKey) {
        throw new Error('BUSINESS_SHORT_CODE and PASS_KEY environment variables are required');
    }
    
    const password = `${shortCode}${passKey}${timestamp}`;
    return Buffer.from(password).toString('base64');
};

module.exports = { getPassword };
