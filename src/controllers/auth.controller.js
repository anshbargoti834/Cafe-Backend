const jwt = require('jsonwebtoken');

// HARDCODED ADMIN CREDENTIALS (Simple & Secure for this scale)
// In a real SaaS, these would be in a database.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check Credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // 2. Generate Token (The "Badge")
    // Expires in 24 hours so they don't have to login constantly
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    // 3. Send Token to Frontend
    res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};