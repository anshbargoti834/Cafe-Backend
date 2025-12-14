const Joi = require('joi');


exports.validateBody = (schema) => (req, res, next) => {
const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
if (error) {
const message = error.details.map(d => d.message).join(', ');
return res.status(400).json({ success: false, message });
}
req.body = value;
next();
};


exports.validateQuery = (schema) => (req, res, next) => {
const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
if (error) {
const message = error.details.map(d => d.message).join(', ');
return res.status(400).json({ success: false, message });
}
req.query = value;
next();
};