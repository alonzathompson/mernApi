const express = require('express');
const router = require('express-promise-router')();
const User = require('../models/user');

router.route('/maps')
  .get( (req, res)=> {
    res.render('./partials/map');
  });

router.route('/panel')
  .get( async(req, res) => {

    const users = [] = await User.find({});
    console.log(users);
    res.render('./partials/panel', { users });
  })

module.exports = router;
