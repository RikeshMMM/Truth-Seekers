const express = require('express');
const router = express.Router();

const axios = require('axios');

// Include Firebase
const firebase = require("firebase/app");
require("firebase/database");

// Firebase configurations
const firebaseConfig = {
  apiKey: "AIzaSyC6vrrXdXymi1Keml214KkUJzDc_ksPJfY",
  authDomain: "eosio-511fa.firebaseapp.com",
  databaseURL: "https://eosio-511fa.firebaseio.com",
  projectId: "eosio-511fa",
  storageBucket: "eosio-511fa.appspot.com",
  messagingSenderId: "133190663906",
  appId: "1:133190663906:web:5bff22a7324d59017f68bb",
  measurementId: "G-TFNY6GXKTN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

/**
 * Get all news articles
 * @returns {Promise} - Database snapshot with news articles
 */
async function getNewsArticle() {
  return await firebase.database().ref('/articles').once('value')
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  // Get news articles with unique id from database
  const newsArticles = (await getNewsArticle()).val();

  // Get news articles as array
  const newsArticleArray = Object.values(newsArticles);

  res.render('index', {
    title: 'Covid Times',
    latestArticleTop: newsArticleArray.slice(0,1),
    latestArticles: newsArticleArray.slice(1,4),
    fakeArticleTop: newsArticleArray.slice(4,6),
    fakeArticles: newsArticleArray.slice(5,8),
  });
});

module.exports = router;
