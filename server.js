const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { join } = require("path");
const authConfig = require("./src/auth_config.json");

const app = express();

const port = process.env.PORT || process.env.SERVER_PORT || 3001;

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});


app.get("/api/external", checkJwt, checkPermissionJson('string.read'), (req, res) => {
  var user = req.user || {};
  res.send({
    msg: "Hello and welcome to the backend API"
  });
});

function checkPermissionJson(scope_required) {
	return function(req,res,next)
	{
		var user = req.user || {};
		var scopes = user.permissions.concat(user.permissions || []);
		if(scopes.includes(scope_required)) return next();
		return res.status(400).json({error:"Insufficient privileges."})
	}
}

app.use((_, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
