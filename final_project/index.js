const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const config = require("./config/config.js");

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({ secret: config.JWT_SECRET, resave: true, saveUninitialized: true })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const accessToken = req?.session?.authorization?.accessToken;

  if (accessToken) {
    console.log("Inside access token");
    jwt.verify(accessToken, config.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(404).json({ message: "Token is not valid" });
      } else {
        console.log("Token is valid");
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(404).json({ message: "Authentication Error" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
