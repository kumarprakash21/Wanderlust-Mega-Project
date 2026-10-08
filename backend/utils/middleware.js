import { retrieveDataFromCache } from './cache-posts.js';
import { HTTP_STATUS } from './constants.js';
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.cookies?.access_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Insufficient permissions.' });
  }
  next();
};

export const cacheHandler = (key) => async (req, res, next) => {
  try {
    const cachedData = await retrieveDataFromCache(key);
    if (cachedData) {
      console.log(`Getting cached data for key: ${key}`);
      return res.status(HTTP_STATUS.OK).json(cachedData);
    }
    next(); // Proceed to the route handler if data is not cached
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
