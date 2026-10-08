import { retrieveDataFromCache } from './cache-posts.js';
import { HTTP_STATUS } from './constants.js';
import jwt from 'jsonwebtoken';

const requestCounts = new Map();
const WINDOW_MS = 60_000;
const MAX_AUTH_REQUESTS = 20;

export const authRateLimit = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const entry = requestCounts.get(key);
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    requestCounts.set(key, { startedAt: now, count: 1 });
    return next();
  }
  entry.count += 1;
  if (entry.count > MAX_AUTH_REQUESTS) {
    return res.status(429).json({ message: 'Too many authentication attempts. Try again later.' });
  }
  next();
};

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
