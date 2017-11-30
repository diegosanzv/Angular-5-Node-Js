const     bodyParser      = require('body-parser'),
          path            = require('path'),
          fs              = require('fs'),
          multer          = require('multer'),
          {sign, unsign}  = require('cookie-signature');

/*multer*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./app/public/uploads/")
  },
  filename: function (req, file, cb) {
    var pathImage = file.fieldname + file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname);
    cb(null, pathImage)
  }
});

const upload = multer({storage: storage}).any();

module.exports = (app, db) => {
  const collection = db.collection('users'),
        parseJson  = bodyParser.json();

  app.post('//', parseJson, (req, res) => {
    console.log(req.body);
    if (req.body.userName && req.body.userPassword) {
            collection.findOne({'login': req.body.userName, 'password': req.body.userPassword}, (err, result) => {

              if (err) {
                res.status(503).json('DB problem detected');
              } else if (result) {
                cookie.set(res, 'login', sign(req.body.userName, 'secret'));
                res.send(req.body);
              } else {
                res.status(503).json('login or password missmath');
              }
            });
          } else {
            res.status('500').end();
          }
  });


  app.get('//user/', parseJson, (req, res) => {
    const userName = checkCookie(req, res)
    if (userName !== undefined && userName !== false) {
      collection.findOne({'login': userName}, (err, result) => {
        if(result) {
          console.log('result' + result);
          if (result.admin === true) {
            collection.find().toArray(function(err, result) {
              const data = {
                "login":  userName,
                "admin": true,
                "images": null,
                "data": result
              }
              res.send(data);
            });
          } else {
            const data = {
              "login":  result.login,
              "admin": false,
              "images": result.images,
              "data": null
            }
          console.log('2');
            res.send(data);
          }
        } else {
          res.status(500).send('cookie');
        }
      });
    }
  });

  app.post('//user/', upload, (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const userName = checkCookie(req, res);
    checkAdmin(userName).then((result) => {
      if (result === true) {
        let pathOfImages = [];
        let id = 0;
        console.log(req.files)
        req.files.forEach((file) => {

          let newPath = file.path.replace(/app\\public\\/, '/');;
          let src = '/node'+ newPath.replace(/\\/g, '/')
          id++;

          pathOfImages.push({
            "id":id,
            "name": "Image " + id,
            "src": src
          });
          console.log(pathOfImages);
        });
          let userData = {
          "login": req.body.userName,
          "password": req.body.userPassword,
          "admin": false,
          "images": pathOfImages
        }
        console.log('userdata= '+userData);

        collection.insert(userData, function(err, result) {
          if (err) {
            deleteImages(pathOfImages, (cb) => {
              if(cb === true) {
                res.status(500).send(err.errmsg);
                console.log(err.errmsg);}
            });

          } else {
          let data = {
              "login": userData.login,
              "images": pathOfImages
            };
            res.status('200').send(data);
            console.log(result);
          }
        });
      }
    });
  });

  app.put('//user/', parseJson, (req, res) => {                                          //PUT EDIT
    console.log('body: '+req.body )
    const userName = checkCookie(req, res);
    checkAdmin(userName).then((result) => {
      try {
        if (req.body.images) {
          collection.findOneAndUpdate(
            { "login": req.body.login },
            { $set:
              {
                "images": req.body.images
              }
            }
          );
          res.status(200).send('success');
        } else if (req.body.newLogin) {
          collection.findOneAndUpdate(
            { "login": req.body.login },
            { $set:
              {
                "login": req.body.newLogin,
                "password": req.body.newPassword
              },
            }
          );
          console.log('login password : ' + req.body.newLogin+req.body.newPassword )
          res.status(200).send('success');
        }

      } catch (err) {
        res.status(500).send(err);
        console.log(err)
      }
    });
  });

  app.delete('//user/:id', parseJson, (req, res) => {                                     //DELETE DELETE
    const userName = checkCookie(req, res);
    checkAdmin(userName).then((isAdmin) => {
      if (userName != req.params.id && isAdmin === true) {
        collection.findOne({'login': req.params.id}, (err, result) => {
          console.log(result.images);
          deleteImages(result.images, (deleteResult) => {
            if (deleteResult === true) {
              collection.remove({'login': req.params.id}, (err, result) => {
                (err) ? res.status(500).send(err) : res.status(200).send(result);
              });
            } else {
              res.status(500).send(deleteResult);
            }
          });
        });
      }
    });
  });

  let checkAdmin = (login) => {
    return new Promise((resolve, reject) => {
      collection.findOne({'login': login}, (err, result) => {
      resolve (result.admin);
    });
  });
}
  function deleteImages(imgObject, cb) {
    if (imgObject) {
      imgObject.forEach((imgPath) => {
        const temp = imgPath.src;
        console.log('./app/public' + temp.replace('/node', ''))
        fs.unlink('./app/public' + temp.replace('/node', ''), (err) => {
          if (err) {console.log(err)}
        });
      });
    }
    cb(true);
  }

};
