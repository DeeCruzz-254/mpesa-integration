router.post('/callback', (req, res) => {
  console.log('STK Callback response:', JSON.stringify(req.body));
  
  // Extract info from callback
  const callbackData = req.body.Body.stkCallback;
  
  // Always respond to Safaricom with a success to acknowledge receipt
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  
  // Process the callback data as needed for your application
  if (callbackData.ResultCode === 0) {
    // Payment successful
    const transactionDetails = callbackData.CallbackMetadata.Item;
    // Process the successful payment
    console.log('Payment successful');
    
    // In a real application, you would:
    // 1. Update your database
    // 2. Fulfill the order
    // 3. Notify the customer
    // etc.
  } else {
    // Payment failed
    console.log('Payment failed:', callbackData.ResultDesc);
  }
});