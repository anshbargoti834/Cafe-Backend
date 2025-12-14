exports.successResponse = (res, status = 200, payload = {}) => {
return res.status(status).json({ success: true, ...payload });
};


exports.errorResponse = (res, status = 400, message = 'Bad request') => {
return res.status(status).json({ success: false, message });
};