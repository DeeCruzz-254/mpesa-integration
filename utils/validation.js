/**
 * Format and validate phone number for M-Pesa
 * @param {string} phoneNumber - Phone number in any format
 * @returns {string} Formatted phone number (254XXXXXXXXXX)
 * @throws {Error} If phone number is invalid
 */
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        throw new Error('Phone number must be a non-empty string');
    }

    let formatted = phoneNumber.trim();

    // Remove leading 0 or +254 and format to 254XXXXXXXXXX
    if (formatted.startsWith('0')) {
        formatted = `254${formatted.slice(1)}`;
    } else if (formatted.startsWith('+254')) {
        formatted = formatted.slice(1);
    } else if (formatted.startsWith('254')) {
        // Already in correct format
    } else {
        throw new Error('Phone number must start with 0, +254, or 254');
    }

    // Validate length (254 + 9 digits = 12 characters)
    if (!/^\d{12}$/.test(formatted)) {
        throw new Error('Phone number must be valid (254 + 9 digits)');
    }

    return formatted;
};

/**
 * Validate amount
 * @param {number} amount - Payment amount
 * @returns {boolean} True if valid
 * @throws {Error} If amount is invalid
 */
const validateAmount = (amount) => {
    const numAmount = Number(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Amount must be a positive number');
    }
    
    if (numAmount < 1) {
        throw new Error('Minimum amount is 1 KES');
    }
    
    return true;
};

module.exports = { formatPhoneNumber, validateAmount };
