const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimitter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // limit each IP to 5 login request per 'window' per minute
  message: {
    message: "Too many login attemps from this IP, please try again",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message} \t${req.method}\t${req.url}\t${req.header.origin}`,
      "errorLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable return the 'X-RateLimit-*' headers
});

module.exports = loginLimitter;
