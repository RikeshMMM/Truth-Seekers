const express = require('express');
const router = express.Router();

/** GET : View verify news form */
router.get('/', function(req, res, next) {
  res.render('verify-news/verify-news-form', {
    title: "Verify News Articles"
  });
});

module.exports = router;
