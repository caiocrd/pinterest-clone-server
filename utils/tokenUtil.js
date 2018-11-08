var jwt = require('jsonwebtoken');

var createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      return next();
  },
  sendToken: function(req, res) {
      res.setHeader('x-auth-token', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  },
  validateToken: function(req, res, next){
      const bearerHeader = req.headers['authorization'];
      if(typeof bearerHeader !== 'undefined'){
        //Split the token at the space
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const user = jwt.verify(bearerToken, 'my-secret', (err, user) => {
            if(err){
                res.sendStatus(403);
            }else{
                req.user = user.id;
                next();
            }

        });
      }else{
          res.sendStatus(403);
      }
  }
};