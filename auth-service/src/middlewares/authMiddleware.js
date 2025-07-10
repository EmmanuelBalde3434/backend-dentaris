const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.split(' ')[1];       

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;                                
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};
