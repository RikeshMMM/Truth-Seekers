const express = require('express');
const router = express.Router();

const {getNewsArticles} = require('./news/index');

/** GET : View home page */
router.get('/', async (req, res, next) => {
  // TODO: Send object with article id instead of just array of articles
  // Get news articles with unique id from database
  const newsArticlesObject = (await getNewsArticles()).val();
  
  // Get news articles as array
  const newsArticles = Object.values(newsArticlesObject);

  trustedArticles = []
  untrustedArticles = []

  for (let [key, value] of Object.entries(newsArticles)) {

    value.key = key;
    
    if(value.type=="trusted"){
      trustedArticles.push(value)
    }else if(value.type == "untrusted"){
      untrustedArticles.push(value)
    }
 
  }

  const user = req.cookies.userData.info.name;

  res.render('index', {
    title: 'Truth Seekers',
    trustedArticleTop: trustedArticles.slice(0,1),
    trustedArticles: trustedArticles.slice(1,4),
    fakeArticleTop:  untrustedArticles.slice(0,1),
    fakeArticles:  untrustedArticles.slice(1,4),
    page : "home",
    user
  });
});

/** GET: View introduction page */
router.get('/introduction', async (req, res, next) => {
  
});

module.exports = router;
