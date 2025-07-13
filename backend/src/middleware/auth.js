import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
      return;
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};