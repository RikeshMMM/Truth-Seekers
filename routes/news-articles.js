const express = require('express');
const router = express.Router();

const { getNewsArticles, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');

const { getArticleRatingsHistory, getArticleRatingTransactionHistory, pushTransaction, getNewsArticleMeta, getUserAccount, getUserAccounts, getArticleRatings } = require("./eosjs/index");

/** GET : Browse all news articles */
router.get('/', async (req, res, next) => {
  // Get news articles with unique id from database
  const newsArticles = (await getNewsArticles()).val();

  // Render the articles
  res.render('news-articles/browse', {
      title: 'News articles',
      page: 'search',
      newsArticles
    });
});

router.post('/article-rating', async (req, res, next) => {
  // Get news articles with unique id from database
  const { articleID, article, rating } = req.body;
  const { userData } = req.cookies;

  // Replace '_' from username
  const user = userData.username.replace('_','');
  const userAccount = await getUserAccount(user);
  
  console.log(articleID, article, rating, user, userAccount);

  // Get the next index for article rating
  const articleRatingsHistory = await getArticleRatingsHistory();
  const nextIndex = articleRatingsHistory.length+1;

  // Action to execute
  let actions = [];

  // Rate article action
  const rateArticleAction = {
    account: 'covidtimes',
    name: 'ratearticle',
    authorization: [{
        actor: user,
        permission: 'active',
    }],
    data: {
        id: nextIndex,
        user: user,
        article_id: articleID,
        rating: rating
    },
  };
  actions.push(rateArticleAction);
  
  // If the user is a judge
  if(userAccount.role == "judge") {
    // Increment article rating count action
    const incrementCountAction = {
      account: 'covidtimes',
      name: 'inccount',
      authorization: [{
          actor: 'covidtimes',
          permission: 'active',
      }],
      data: {
          article_id: articleID
      },
    };
    actions.push(incrementCountAction);
  }

  // Push the transactions
  const rateResult = await pushTransaction(actions);

  // Get updated news articles
  const newsArticleMeta = await getNewsArticleMeta(articleID);

  // If the rating count is equal to 10
  if(newsArticleMeta.ratingCount >= 10) {
    const articleRatings = await getArticleRatings(articleID);

    const userAccounts = (await getUserAccounts()).filter(user => user.role == "judge").map(user => user.user);
    const judgeRatings = articleRatings.filter(article => userAccounts.indexOf(article.user) != -1);  
    
    console.log(judgeRatings);

    const totalRating = await Promise.all(judgeRatings.map(async (article) => article.rating*parseFloat((await getUserAccount(article.user)).weight)));

    const totalWeight = await Promise.all(judgeRatings.map(async (article) => parseFloat((await getUserAccount(article.user)).weight)));
     
    const totalRatingSum = totalRating.reduce((total,r) => total + r, 0);
    const totalWeightSum = totalWeight.reduce((total,w) => total + w, 0);

    const totalScore = Math.round(totalRatingSum / totalWeightSum);
    console.log(totalRatingSum, totalWeightSum, totalScore);
  
    // Update Article Rating Action
    const updateArticleRatingAction = {
      account: 'covidtimes',
      name: 'uprating',
      authorization: [{
          actor: 'covidtimes',
          permission: 'active',
      }],
      data: {
        article_id: articleID,
        rating: totalScore
      },
    };

    // Push the transactions
    const updateResult = await pushTransaction([updateArticleRatingAction]);
  }
  res.redirect(`/news-articles/${article}`);
});

/** GET : View news article */
router.get('/:articleID', async (req, res, next) => {
  // Get article ID from request params
  const { articleID } = req.params;

  const { userData } = req.cookies;

  // Replace '_' from username
  const user = userData.username.replace('_','');

  // Get news article from database
  const newsArticle = (await getNewsArticle(articleID)).val();

  const newsSource = newsArticle.source.id;

  // Get similar articles from database
  const similarArticles = newsSource ? (await getNewsArticlesBySource(newsSource)).val() : {};

  // Remove current article from the similar articles
  delete similarArticles[articleID];

  // Get article rating transaction history
  const articleRatingTransactionHistory = await getArticleRatingTransactionHistory(newsArticle.id);
  console.log(articleRatingTransactionHistory[1].action_trace);

  const articleRatings = await getArticleRatings(newsArticle.id);
  const voted = (articleRatings.filter(article => article.user == user)).length > 0 ? true : false;

  const newsArticleMeta = await getNewsArticleMeta(newsArticle.id);
  newsArticle.rating = newsArticleMeta.rating;
  newsArticle.type = newsArticleMeta.type;

  // Render the article
  res.render('news-articles/read', {
    title: newsArticle.title,
    page: 'search',
    articleID,
    newsArticle,
    similarArticles,
    articleRatingTransactionHistory,
    voted
  });
})

module.exports = router;
