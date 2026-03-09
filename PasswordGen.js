const getPassword = (timestamp) => {
    const shortCode = process.env.BUSINESS_SHORT_CODE;
    const passKey = process.env.PASS_KEY;
    const password = `${shortCode}${passKey}${timestamp}`;
    return Buffer.from(password).toString('base64');
};