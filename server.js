const express         = require('express'),
      path            = require('path'),
      app             = express(),
      userRoutes      = require('./app/routes/userRoutes'),
      config          = require('./app/db/config'),
      {sign, unsign} = require('cookie-signature'),
      mongoClient     = require('mongodb').MongoClient;

global.cookie = require('./app/cookie/cookie');

global.checkCookie = (req, res) => {
  if (cookie.get(req, 'login')) {
    const cookieValue = cookie.get(req, 'login'),
          cookieLogin = unsign(cookieValue, 'secret');

    if (cookieLogin === false) {
      cookie.set(res, 'login', null);
      res.send('no cookie')
    } else {
      return cookieLogin;
    }
  } else {
    res.send('no cookie')
  }
}

/* start mongodb */
mongoClient.connect(config.admin.uri, (err, db) => {
  /* modules */
  userRoutes(app, db);
});

app.use(express.static('./app/public'));

app.listen(8082, function () {
    console.log('listen 8082');

});
