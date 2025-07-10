const AuthService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await AuthService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: error.message 
    });
  }
};

