const logger = require('../utils/logger');


module.exports = (err, req, res, next) => {
logger.error(err && err.stack ? err.stack : err);
const status = err.status || 500;
const msg = process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal server error');
res.status(status).json({ success: false, message: msg });
};