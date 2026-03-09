router.post('/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    
    // Validate inputs
    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }
    
    // Format phone number (remove leading 0 or +254)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = `254${phoneNumber.slice(1)}`;
    } else if (phoneNumber.startsWith('+254')) {
      formattedPhone = phoneNumber.slice(1);
    }
    
    // Get access token
    const accessToken = await getAccessToken();

    console.log('Access token obtained:', accessToken);

    console.log('Initiating STK Push with data:',data);
    
    // Prepare STK Push request
    const timestamp = getTimestamp();
    const password = getPassword(timestamp);
    const shortCode = process.env.BUSINESS_SHORT_CODE;
    
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
      AccountReference: 'Test Payment',
      TransactionDesc: 'Test Payment'
    };
    
    // Make STK Push request
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Return response to client
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
      error: error.response?.data || error.message
    });
  }
});