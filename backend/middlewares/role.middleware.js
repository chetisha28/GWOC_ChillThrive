const ApiError = require("../utils/ApiError");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access only"));
  }
  next();
};

module.exports = isAdmin;
