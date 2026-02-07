const requestCounts = new Map();

export const customRateLimiter = (limit, windowMs) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, startTime: now });
      return next();
    }

    const userData = requestCounts.get(ip);
    if (now - userData.startTime > windowMs) {
      // Reset window
      userData.count = 1;
      userData.startTime = now;
      return next();
    }

    if (userData.count >= limit) {
      return res.status(429).json({ error: 'Too many requests. Slow down!' });
    }

    userData.count++;
    next();
  };
};