import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Token:', token); // Add this line to check if token is received
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

