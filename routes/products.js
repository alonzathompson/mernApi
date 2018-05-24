const express = require('express');
const router = require('express-promise-router')();

router.route('/')
  .get((req, res) => {
    console.log(req.headers);
    res.render('./partials/products');
  })


module.exports = router;
