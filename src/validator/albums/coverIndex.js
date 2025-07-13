const InvariantError = require('../../exceptions/InvariantError');
const { CoverHeadersSchema } = require('./coverSchema');

const CoverValidator = {
  validateCoverHeaders: (headers) => {
    const validationResult = CoverHeadersSchema.validate(headers);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = CoverValidator;