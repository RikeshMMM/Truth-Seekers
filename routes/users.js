const express = require('express');
const router = express.Router();

/** GET : View user profile */
router.get('/:userID', function(req, res, next) {
  // Get user ID from request params
  const { userID } = req.params;

  // Get the user information from the database
  // TODO: Define user in the database
  const user = {
    name: "John Thomas",
    role: "Reader",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
  }

  res.render('users/read', {
    title: "User Profile",
    user
  });
});

module.exports = router;
