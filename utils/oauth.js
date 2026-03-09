const axios = require('axios');

/**
 * Get M-Pesa OAuth access token
 * @returns {Promise<string>} Access token
 */
const getAccessToken = async () => {
    try {
        if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET) {
            throw new Error('CONSUMER_KEY and CONSUMER_SECRET environment variables are required');
        }

        const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });
        
        if (!response.data.access_token) {
            throw new Error('No access token in response');
        }
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = { getAccessToken };
