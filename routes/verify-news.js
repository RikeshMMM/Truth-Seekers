const express = require('express');
const router = express.Router();
const domain = require('getdomain')

const { getSources, getNewsDatabase, getNewsArticles, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');
const { functions } = require('firebase');

/** GET : View verify news form */
router.get('/', function(req, res, next) {
  res.render('verify-news/verify-news-form', {
    title: "Verify News Articles",
    page : "verify"
  });
});

async function verifyNewsUrl(newsUrl) {
  var trusted = false;
  const sources = (await getSources()).val();
  domains = [];
  for (let [key, value] of Object.entries(sources)) {
    domains.push(value.domain);
  };
  dom = domain.hostname(newsUrl);

  let result = {
    result: "untrusted",
    source: { name: dom},
    articles: {},
    url : newsUrl
  };

  if(domains.includes(dom)){
    result = {
      result: "trusted",
      source: { name: dom},
      articles: {},
      url : newsUrl
    };
  }

  return result;
};

/** POST: Route to verify news url */
router.post('/url', async function(req, res, next) {
  const { newsUrl } = req.body;
  const result = await verifyNewsUrl(newsUrl);
  res.render('verify-news/verify-news-complete', {
    title: "Verify News Articles Complete",
    verifyNewsResult: result,
    page : "verify"
  });
});

/** POST: API route to verify news url */
router.post('/api/verify-url', async function(req, res) {
  // return res.json(req.body);
  const { newsUrl } = req.body;
  const result = await verifyNewsUrl(newsUrl);
  res.json(result);
});

async function verifyNewsText(newsText) {
  var trusted = false;
  articleFound = {};

  const articles = (await getNewsArticles()).val();
  
  content = [];
  for (let [key, value] of Object.entries(articles)) {
    if(value.content!=null){
     content.push(value.content);
     if(value.content.substring(0,190).includes(newsText.substring(0,100))){
      trusted = true;
      articleFound = value;
     }
  }
  }

  let result = {
    result: "unknown",
  };

  if(trusted){
    result = {
      result: "trusted",
      articles: {articleFound},
      source: {name: articleFound.source.name},
      url : " "
    };
  }
  
  return result;

};

/** POST: Route to verify news text */
router.post('/text', async function(req, res, next) {
  const { newsText } = req.body;
  const result = await verifyNewsText(newsText);

  res.render('verify-news/verify-news-complete', {
    title: "Verify News Articles Complete",
    verifyNewsResult: result,
    page : "verify"
  });
});

/** POST: API route to verify news text */
router.post('/api/verify-text', async function(req, res) {
  const { newsText } = req.body;
  const result = await verifyNewsText(newsText);
  res.json(result);
});

/** GET : View verify news complete results */
// TODO: Change to POST and display only after form processes
router.get('/complete', function(req, res, next) {

  // Verify news result - Trusted
  const verifyNewsResultTrusted = {
    result: "trusted",
    source: { id: 'the-times-of-india', name: 'The Times of India' },
    articles: {
      '-M8AeAvsMfGW_kjb8mbM': {
        author: 'Quick Edit',
        content: 'Amidst everything that Covid-19 has transformed dramatically, today Eid-ul-Fitr is top of the mind. As it brings the Muslim holy month of Ramzan to a close every year, it is usually celebrated with l… [+1196 chars]',
        description: 'Amidst everything that Covid-19 has transformed dramatically, today Eid-ul-Fitr is top of the mind. As it brings the Muslim holy month of Ramzan to a close every year, it is usually celebrated with large public...',
        publishedAt: '2020-05-25T08:28:15Z',
        source: { id: 'the-times-of-india', name: 'The Times of India' },
        title: 'Quick Edit: Eid in the time of Corona',
        url: 'https://timesofindia.indiatimes.com/blogs/toi-editorials/in-the-darkness-of-the-pandemic-the-kindnesses-of-eid-shine-brighter-than-ever/',
        urlToImage: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2020/05/Eid.jpg'
      }
    }
  }

  // Verify news result - Untrusted
  const verifyNewsResultUntrusted = {
    result: "untrusted",
    source: { id: 'the-times-of-india', name: 'The Times of India' },
    articles: {
      '-M8AeAvsMfGW_kjb8mbM': {
        author: 'Quick Edit',
        content: 'Amidst everything that Covid-19 has transformed dramatically, today Eid-ul-Fitr is top of the mind. As it brings the Muslim holy month of Ramzan to a close every year, it is usually celebrated with l… [+1196 chars]',
        description: 'Amidst everything that Covid-19 has transformed dramatically, today Eid-ul-Fitr is top of the mind. As it brings the Muslim holy month of Ramzan to a close every year, it is usually celebrated with large public...',
        publishedAt: '2020-05-25T08:28:15Z',
        source: { id: 'the-times-of-india', name: 'The Times of India' },
        title: 'Quick Edit: Eid in the time of Corona',
        url: 'https://timesofindia.indiatimes.com/blogs/toi-editorials/in-the-darkness-of-the-pandemic-the-kindnesses-of-eid-shine-brighter-than-ever/',
        urlToImage: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2020/05/Eid.jpg'
      }
    }
  }

  // Verify news result - Unknown
  const verifyNewsResultUnknown = {
    result: "unknown",
  }

  res.render('verify-news/verify-news-complete', {
    title: "Verify News Articles Complete",
    verifyNewsResult: verifyNewsResultUntrusted
  });
});

module.exports = router;
