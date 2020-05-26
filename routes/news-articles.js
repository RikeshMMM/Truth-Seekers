const express = require('express');
const router = express.Router();

const { getNewsArticles, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');

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

/** GET : View news article */
router.get('/:articleID', async (req, res, next) => {
  // Get article ID from request params
  const { articleID } = req.params;

  // Get news article from database
  const newsArticle = (await getNewsArticle(articleID)).val();

  // Get similar articles from database
  const similarArticles = (await getNewsArticlesBySource(newsArticle.source.id)).val();

  // Remove current article from the similar articles
  delete similarArticles[articleID];

  // Render the article
  res.render('news-articles/read', {
    title: newsArticle.title,
    newsArticle,
    similarArticles
  });
})

module.exports = router;
