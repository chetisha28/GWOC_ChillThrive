const ApiError = require("../utils/ApiError");

const validate = (fields = []) => {
  return (req, res, next) => {
    const missingFields = fields.filter(
      (field) => !req.body[field]
    );

    if (missingFields.length) {
      return next(
        new ApiError(
          400,
          `Missing fields: ${missingFields.join(", ")}`
        )
      );
    }

    next();
  };
};

module.exports = validate;
