const express = require('express');
const router = express.Router();

const { getNewsArticles, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');

const { getArticleRatingTransactionHistory } = require("./eosjs/index");

/** GET : Browse all news articles */
router.get('/', async (req, res, next) => {
  // Get news articles with unique id from database
  const newsArticles = (await getNewsArticles()).val();

  // Render the articles
  res.render('news-articles/browse', {
      title: 'News articles',
      newsArticles
    });
});

router.post('/article-rating', async (req, res, next) => {
  // Get news articles with unique id from database
  const { articleID, rating } = req.body;
  const { userData } = req.cookies;

  console.log(articleID, rating, userData)
  // Render the articles
 
});

/** GET : View news article */
router.get('/:articleID', async (req, res, next) => {
  // Get article ID from request params
  const { articleID } = req.params;

  // Get news article from database
  const newsArticle = (await getNewsArticle(articleID)).val();

  const newsSource = newsArticle.source.id;

  // Get similar articles from database
  const similarArticles = newsSource ? (await getNewsArticlesBySource(newsSource)).val() : {};

  // Remove current article from the similar articles
  delete similarArticles[articleID];

  // Get article rating transaction history
  const articleRatingTransactionHistory = await getArticleRatingTransactionHistory(newsArticle.id);

  // Render the article
  res.render('news-articles/read', {
    title: newsArticle.title,
    articleID : articleID,
    newsArticle,
    similarArticles,
    articleRatingTransactionHistory
  });
})

module.exports = router;
