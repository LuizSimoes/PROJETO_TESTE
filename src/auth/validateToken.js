const jwt = require('jsonwebtoken');
const model = require('../models/cookModelUsers');
const { unauthorized } = require('../utils/messages');

const secret = 'segredo';

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization;
  if (!token) return res.status(unauthorized).json({ message: 'missing auth token' });

  try {
    const decoded = jwt.verify(token, secret);
    const user = await model.findByEmail(decoded.email);
    if (!user) return res.status(unauthorized).json({ message: 'jwt malformed' });
    req.user = user;
    next();
  } catch (error) {
    res.status(unauthorized).json({ message: 'jwt malformed' });
  }
};
