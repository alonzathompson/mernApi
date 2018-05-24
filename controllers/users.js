const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/jwtSecret');

const signToken = user => {
  return JWT.sign({
    iss: 'artraun',
    sub: user.id,
    iat: new Date().getTime(), //current time
    exp: new Date().setDate(new Date().getDate() + 1) //cuerrent time plus one day ahead
  }, JWT_SECRET)
}

module.exports = {
  signUp: async(req, res, next) => {
    //email and password varification
    console.log(req.value);
    const {email, password } = req.value.body;
    //checking nested properties in mongoose must have quotes
    const foundUser = await User.findOne({ "local.email": email })

    if(foundUser){
      return res.status(403).json({
        message: "email is already in use"
      })
    }

    const newUser = new User({
      method: "local",
      local:{
        email: email,
        password: password
      }
    })

    await newUser.save();

    const token = signToken(newUser);

    res.status(200).json({
      message: `Welcome ${newUser.local.email}`,
      token: token
    })

  },

  signIn: async(req, res, next) => {
    //generate token
    console.log(req.value);
    console.log(req.headers);
    const token = signToken(req.user);
    res.status(200).json({ token });
    console.log(`successful login`);
  },

  googleOAuth: async(req, res, next) => {
    //generate token for google oauth
    console.log('req.user', req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async(req, res, next) => {
    console.log('req.user', req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async(req, res, next) => {
    console.log(`I managed to get here`);
    res.json({ secret: 'resource'})
  },

  getUser: async(req, res, next) => {
    const userHandler = await User.findById(req.user.id, (err, user)=>{
      if(err){
        console.log(err);
      } else {
        res.render('./partials/users',{
          userDetails: user || 'working',
          confirmation: 'success',
        });
        console.log(user);
      }
    });
  },

  getProfile: async(req, res, next) => {
    res.status(200).render('./partials/profile', { token });
  }

}
