const jwt = require('jsonwebtoken');

// This function works like Express middleware but also works for Vercel serverless functions
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not logged in! Login or Signup to access this resource!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Failed to authenticate' });
      }
      req.user = decoded.id;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Please login or signup to access this resource' });
  }
};
