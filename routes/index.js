const express = require('express');
const router = express.Router();

const {getNewsArticles, getNewsArticlesByType, getTopNewsArticlesByType} = require('./news/index');

/** GET : View home page */
router.get('/', async (req, res, next) => {

  const trustedArticleTop = (await getTopNewsArticlesByType('trusted')).val();
  const untrustedArticleTop = (await getTopNewsArticlesByType('untrusted')).val();
  const trustedArticles = (await getNewsArticlesByType('trusted',4)).val();
  const untrusted = (await getNewsArticlesByType('untrusted',4)).val();

  if(!req.cookies.userData) return res.redirect("/login");

  const user = req.cookies.userData.info.name;

  return res.render('index', {
    title: 'Truth Seekers',
    trustedArticleTop,
    trustedArticles,
    untrustedArticleTop,
    untrusted,
    page : "home",
    user
  });

  // console.log(topTrusted);

  // // TODO: Send object with article id instead of just array of articles
  // // Get news articles with unique id from database
  // const newsArticlesObject = (await getNewsArticles()).val();

  // // Get news articles as array
  // const newsArticles = Object.values(newsArticlesObject);

  // trustedArticles = []
  // untrustedArticles = []

  // for (let [key, value] of Object.entries(newsArticles)) {

  //   value.key = key;
    
  //   if(value.type=="trusted"){
  //     trustedArticles.push(value)
  //   }else if(value.type == "untrusted"){
  //     untrustedArticles.push(value)
  //   }
 
  // }

  // if(!req.cookies.userData) return res.redirect("/login");

  // const user = req.cookies.userData.info.name;

  // res.render('index', {
  //   title: 'Truth Seekers',
  //   trustedArticleTop: trustedArticles.slice(0,1),
  //   trustedArticles: trustedArticles.slice(1,4),
  //   fakeArticleTop:  untrustedArticles.slice(0,1),
  //   fakeArticles:  untrustedArticles.slice(1,4),
  //   page : "home",
  //   user
  // });
});

/** GET: View introduction page */
router.get('/introduction', async (req, res, next) => {
  
});

module.exports = router;
