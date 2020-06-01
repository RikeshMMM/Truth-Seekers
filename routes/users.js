const express = require('express');
const router = express.Router();

/** GET : View user profile */
router.get('/:userID', function(req, res, next) {
  // Get user ID from request params
  const { userID } = req.params;

  // Get the user information from the database
  // TODO: Define user in the database

  const user = req.cookies.userData.info;

  res.render('users/read', {
    title: "User Profile",
    page : "profile",
    user
  });
});

module.exports = router;
