const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../utilities/passport.js');

//passportJWT is used for handling tokens
const passportJWT = passport.authenticate('jwt', {session: false});
