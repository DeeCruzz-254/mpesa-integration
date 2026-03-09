const express = require('express');
const router = express.Router();
const { verifyCallback } = require('../middleware/verifyCallback');
const { callbackLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/callbacks
 * Receives M-Pesa STK Push callback
 * 
 * Expected callback body structure:
 * {
 *   "Body": {
 *     "stkCallback": {
 *       "MerchantRequestID": "...",
 *       "CheckoutRequestID": "...",
 *       "ResultCode": 0,
 *       "ResultDesc": "Success",
 *       "CallbackMetadata": {
 *         "Item": [...]
 *       }
 *     }
 *   }
 * }
 */
router.post('/callback', callbackLimiter, verifyCallback, (req, res) => {
  try {
    console.log('STK Callback received at', new Date().toISOString());
    console.log('Callback body:', JSON.stringify(req.body, null, 2));
    
    // M-Pesa requires immediate 200 response
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    
    // Process callback asynchronously
    handleCallback(req.body);
  } catch (error) {
    console.error('Callback processing error:', error.message);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

/**
 * Async callback processing
 * In production, you'd save this to a database queue
 */
const handleCallback = async (callbackData) => {
  try {
    if (!callbackData.Body || !callbackData.Body.stkCallback) {
      console.warn('Invalid callback structure');
      return;
    }

    const stkCallback = callbackData.Body.stkCallback;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    if (resultCode === 0) {
      // Payment successful
      console.log('✓ Payment successful:', resultDesc);
      
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const transactionDetails = {};
      
      metadata.forEach(item => {
        transactionDetails[item.Name] = item.Value;
      });

      console.log('Transaction details:', transactionDetails);

      // TODO: In production:
      // 1. Save to database
      // 2. Update order status
      // 3. Send confirmation email/SMS
      // 4. Trigger fulfillment process
    } else {
      // Payment failed
      console.log('✗ Payment failed:', resultDesc, '(Code:', resultCode + ')');
      
      // TODO: Handle failed payment
      // 1. Update order status
      // 2. Notify customer
      // 3. Log for investigation
    }
  } catch (error) {
    console.error('Error processing callback:', error.message);
  }
};

module.exports = router;
