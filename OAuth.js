const getAccessToken = async () => {
    try {
        const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });
        return response.data.access_token;
    } catch(error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};