const express = require('express');
const router = express.Router();

const { getArticleRatingsHistory, getArticleRatingTransactionHistory } = require("./eosjs/index");

router.get('/', async (req, res, next) => {
  const data = await getArticleRatingTransactionHistory(2);
  res.send(data);
});

/** GET : View user profile */
router.get('/:userID', (req, res, next) => {
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
