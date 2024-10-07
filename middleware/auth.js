const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token format is incorrect' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ msg: 'Token is not valid or has expired' });
  }
};
