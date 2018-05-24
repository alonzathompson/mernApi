const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../utilities/passport.js');

//route variable helpers
const { validateBody, schemas } = require('../utilities/validationUtil');
//Joi server validation schema
const validatorJ = validateBody(schemas.authSchema);
const UserController = require('../controllers/users');
//passportLocal is used to handle signin
const passportLocal = passport.authenticate('local', {session: false});
//passportGoogle is used to handle google oauth
const passportGoogle = passport.authenticate('googleToken', {session: false});
//passportFacebook is used to handle faceboook googleOAuth
const passportFacebook = passport.authenticate('facebookToken', {session: false});
//passportJWT is used for handling tokens
const passportJWT = passport.authenticate('jwt', {session: false});


//actual routes defined
router.route('/signup')
  .get((req, res) =>{
    res.render('./partials/signup');
  })
  .post(validatorJ, UserController.signUp);

router.route('/signin')
  .get((req, res) =>{
    res.render('./partials/login');
  })
  .post(validatorJ, passportLocal, UserController.signIn);

router.route('/oauth/google')
  .post(passportGoogle, UserController.googleOAuth);

router.route('/oauth/facebook')
  .post(passportFacebook, UserController.facebookOAuth);

router.route('/secret')
  .get(passportJWT, UserController.secret);

router.route('/')
  .get(passportJWT, UserController.getUser);

router.route('/profile')
  .get(passportJWT, UserController.getProfile);


module.exports = router;
