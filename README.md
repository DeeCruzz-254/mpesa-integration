# M-Pesa STK Push Integration API

A production-ready Node.js/Express API for M-Pesa STK Push payments using Safaricom's API.

## Features

✅ **STK Push Payments** - Initiate payments directly from customer's phone  
✅ **Callback Handling** - Secure callback processing with signature verification  
✅ **Rate Limiting** - Built-in protection against abuse  
✅ **Input Validation** - Phone number and amount validation  
✅ **Error Handling** - Comprehensive error management  
✅ **Logging** - Request logging for debugging  
✅ **Security** - Signature verification, environment-based configuration  

## Project Structure

```
mpesa-integration/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example            # Environment template
├── .env                    # Local environment (git ignored)
│
├── utils/                  # Utility functions
│   ├── oauth.js           # OAuth token generation
│   ├── timestamp.js       # Timestamp formatting
│   ├── passwordGen.js     # Password generation
│   └── validation.js      # Input validation
│
├── middleware/            # Express middleware
│   ├── logger.js          # Request logging
│   ├── rateLimiter.js     # Rate limiting
│   └── verifyCallback.js  # Callback verification
│
├── routes/                # API routes
│   ├── stkPush.js         # STK Push endpoint
│   └── callbacks.js       # Callback endpoint
│
└── (legacy files)         # Original files (can be archived/deleted)
    ├── Routes.js
    ├── Express.js
    ├── OAuth.js
    ├── TimeStamp.js
    ├── PasswordGen.js
    └── CallBacksRoutes.js
```

## Installation

1. **Clone/extract the project**
   ```bash
   cd mpesa-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Safaricom credentials
   ```

4. **Start the server**
   ```bash
   npm start           # Production mode
   npm run dev         # Development mode (auto-reload)
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T10:30:00.000Z"
}
```

### 2. Initiate STK Push
```http
POST /api/stk-push
Content-Type: application/json

{
  "phoneNumber": "0712345678",
  "amount": 100
}
```

**Phone Format Options:**
- `0712345678` (with leading 0)
- `+254712345678` (international format)
- `254712345678` (without +)

**Success Response (200):**
```json
{
  "success": true,
  "message": "STK Push initiated successfully",
  "data": {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "...",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success. Request accepted for processing"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Phone number must be valid (254 + 9 digits)"
}
```

### 3. Callback Endpoint
```http
POST /api/callback
X-Safaricom-Signature: [signature]
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "Success",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 100 },
          { "Name": "MpesaReceiptNumber", "Value": "..." },
          { "Name": "TransactionDate", "Value": "20240122103000" },
          { "Name": "PhoneNumber", "Value": "254712345678" }
        ]
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |
| `CONSUMER_KEY` | Yes | Safaricom OAuth consumer key |
| `CONSUMER_SECRET` | Yes | Safaricom OAuth consumer secret |
| `BUSINESS_SHORT_CODE` | Yes | M-Pesa business short code |
| `PASS_KEY` | Yes | M-Pesa pass key |
| `CALLBACK_URL` | Yes | Public URL for callbacks (use ngrok for local dev) |
| `MPESA_CERT_PATH` | No | Path to M-Pesa certificate for signature verification |

## Getting Safaricom Credentials

1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an account and log in
3. Create a new app under your profile
4. Under the app, go to **Keys** to get:
   - `CONSUMER_KEY`
   - `CONSUMER_SECRET`
5. For sandbox testing, use:
   - `BUSINESS_SHORT_CODE`: 174379
   - `PASS_KEY`: bfb279f9aa9bdbcf158e97dd1a503b6e

## Local Development with ngrok

For testing callbacks locally:

1. **Install ngrok**: https://ngrok.com/download
2. **Start your server**: `npm run dev`
3. **Create tunnel**: `ngrok http 3000`
4. **Update .env**: Set `CALLBACK_URL=https://[your-ngrok-url].ngrok.io/api/callback`
5. **Test**: Send requests to the ngrok URL

## Security Considerations

- ✅ **Rate Limiting**: 5 requests/minute for STK Push, 100 requests/minute for callbacks
- ✅ **Input Validation**: Phone numbers and amounts validated
- ✅ **Callback Verification**: Signature verification (when cert configured)
- ✅ **Error Handling**: Sensitive errors hidden in production
- ⚠️ **HTTPS**: Always use HTTPS in production
- ⚠️ **Credentials**: Store credentials securely, never commit .env to git

## Troubleshooting

**"CONSUMER_KEY and CONSUMER_SECRET environment variables are required"**
- Ensure `.env` file exists and contains valid credentials

**"Phone number must be valid"**
- Use Kenyan phone numbers starting with 07, 01, or 254

**Callbacks not received**
- Verify `CALLBACK_URL` is publicly accessible
- Check firewall/router port forwarding
- Review server logs

**Rate limit errors**
- Wait 1 minute before retrying the same endpoint

## Next Steps / Production Checklist

- [ ] Add database for storing transactions
- [ ] Implement JWT authentication for API consumers
- [ ] Add request signing for enhanced security
- [ ] Set up proper logging (Winston, Pino)
- [ ] Add unit and integration tests
- [ ] Deploy to production server (Heroku, AWS, DigitalOcean, etc.)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure CORS if needed
- [ ] Set up monitoring and alerting
- [ ] Implement request/response encryption

## License

ISC
