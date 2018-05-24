const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/jwtSecret');

module.exports = {
  handleProfile: async (req, res, next)=> {
    console.log('got here');
  }
}
