import jwt from 'jsonwebtoken';
import authService from '../services/authService.js';

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Authorization required' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await authService.getById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', detail: err.message });
  }
};

export default authMiddleware;
