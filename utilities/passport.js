const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const { JWT_SECRET } = require('../config/jwtSecret');
const Google = require('../config/googleCredentials');
const FB = require('../config/facebookCredentials');
const User = require('../models/user');

// JSON web token strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try{
    //find user specified in token
    const user = await User.findById(payload.sub)
    //if user doesn't exist handle it
    if(!user){
      return done(null, false);
    }
    //otherwise return the user
    done(null, user);
  } catch(err){
    done(err, false);
  }
}));

//Google oauth Strategy
passport.use("googleToken", new GooglePlusTokenStrategy({
  clientID: Google.oauth.client,
  clientSecret: Google.oauth.Secret
}, async (accessToken, refreshToken, profile, done) => {
  try{
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("profile", profile);

    //check wether the user exist in our db
    //we are trying to find the google id in our userSchema (our db) with the profile id that we get back
    //from oauth
    const existingUser = await User.findOne({ "google.id": profile.id });
    if(existingUser) {
      console.log('User already exist in DB');
      return done(null, existingUser);
    }


    console.log(`User doesn't exist in DB, creating new one`);
    //if user does not exist then we create a new user
    const newUser = new User({
      //setting the method to google allows the userSchema pre method to bypass local
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();
    done(null, newUser);
  }catch(err){
    done(err, false, err.message);
  }

}));

//Facebook strategy
passport.use("facebookToken", new FacebookTokenStrategy({
  clientID: FB.oauth.client,
  clientSecret: FB.oauth.secret
}, async (accessToken, refreshToken, profile, done) => {
  try{
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("profile", profile);

    //check wether the user exist in our db
    //we are trying to find the facebook id in our userSchema (our db) with the profile id that we get back
    //from oauth
    const existingUser = await User.findOne({ "facebook.id": profile.id });
    if(existingUser) {
      console.log('User already exist in DB');
      return done(null, existingUser);
    }


    console.log(`User doesn't exist in DB, creating new one`);
    //if user does not exist then we create a new user
    const newUser = new User({
      //setting the method to google allows the userSchema pre method to bypass local
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();
    done(null, newUser);
  }catch(err){
    done(err, false, err.message);
  }
}))

//local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try{
    //find user specified by email
    const user = await User.findOne({ "local.email": email });
    //if user doesn't exist handle it
    if(!user){
      return done(null, false);
    }
    //check if the password is correct
    const isMatch = await user.isValidPassword(password);
    //if not handle it
    if(!isMatch){
      return done(null, false);
    }
    //otherwise return the user
    done(null, user);
  } catch(err){
    done(err, false);
  }
}));
