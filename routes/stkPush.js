const express = require('express');
const axios = require('axios');
const router = express.Router();

const { getAccessToken } = require('../utils/oauth');
const { getTimestamp } = require('../utils/timestamp');
const { getPassword } = require('../utils/passwordGen');
const { formatPhoneNumber, validateAmount } = require('../utils/validation');
const { stkPushLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/stk-push
 * Initiates M-Pesa STK Push payment
 * 
 * Request body:
 * {
 *   "phoneNumber": "0712345678",
 *   "amount": 100
 * }
 */
router.post('/stk-push', stkPushLimiter, async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    
    // Validate inputs
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and amount are required'
      });
    }

    try {
      validateAmount(amount);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    let formattedPhone;
    try {
      formattedPhone = formatPhoneNumber(phoneNumber);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    // Get access token
    const accessToken = await getAccessToken();
    
    // Prepare STK Push request
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);
    const shortCode = process.env.BUSINESS_SHORT_CODE;
    
    if (!shortCode || !process.env.CALLBACK_URL) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: 'Payment',
      TransactionDesc: 'M-Pesa Payment'
    };
    
    // Make STK Push request
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return res.json({
      success: true,
      message: 'STK Push initiated successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error initiating STK Push:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate STK Push',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
