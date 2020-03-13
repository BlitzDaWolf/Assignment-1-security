const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { join } = require("path");
const authConfig = require("./src/auth_config.json");
const secrets = require("./secrets.json");

const https = require('https');

const request = require("request");

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
  console.log(user);
  res.send({
    msg: "Hello and welcome to the backend API"
  });
});

app.get('/api/getrole', checkJwt, async (req,res) => {
  let userId = req.user.sub;
  var options = {
    method: 'POST',
    url: `https://${secrets.domain}/api/v2/users/${userId}/permissions`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${secrets.token}`,
      'cache-control': 'no-cache'
    },
    body: {
      permissions: [
        {
          resource_server_identifier: secrets.api,
          permission_name: 'string.read'
        }
      ]
    },
    json: true
  };
  
  try{
    await doRequest(options);
    res.json({msg: "Success"});
  }catch(error){
    res.json({error});
  }
});

function checkPermissionJson(scope_required) {
	return async function(req,res,next)
	{
    var user = req.user || {};
    
    var options = {
      method: 'GET',
      url: `https://${secrets.domain}/api/v2/users/${user.sub}/permissions`,
      headers: {authorization: `Bearer ${secrets.token}`}
    };
    
    let result = await doRequest(options);
    const json = JSON.parse(result);

    if(json.find(x => x.permission_name == scope_required) != null) return next();
		return res.status(400).json({error:"Insufficient privileges."})
	}
}

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}


app.use((_, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
