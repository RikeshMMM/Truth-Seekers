const express = require('express');
const router = express.Router();

const {getNewsArticles} = require('./news/index');

/** GET : View home page */
router.get('/', async (req, res, next) => {
  // TODO: Send object with article id instead of just array of articles
  // Get news articles with unique id from database
  const newsArticlesObject = (await getNewsArticles()).val();
  console.log(newsArticlesObject);

  // Get news articles as array
  const newsArticles = Object.values(newsArticlesObject);

  res.render('index', {
    title: 'Covid Times',
    latestArticleTop: newsArticles.slice(0,1),
    latestArticles: newsArticles.slice(1,4),
    fakeArticleTop: newsArticles.slice(4,6),
    fakeArticles: newsArticles.slice(5,8),
  });
});

/** GET: View introduction page */
router.get('/introduction', async (req, res, next) => {
  
});

module.exports = router;
