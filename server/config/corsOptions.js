const allowedOrigins = require("./allowedOrigin");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  // default is 204, but some device will get the problem
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
