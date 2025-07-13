const Joi = require('joi');

const CoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'image/webp').required(),
  'content-length': Joi.number().max(512000).required(),
}).unknown();

module.exports = { CoverHeadersSchema };