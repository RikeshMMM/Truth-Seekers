const express = require('express');
const router = express.Router();
const domain = require('getdomain')

const { getSources, getNewsDatabase, getNewsArticles, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');

/** GET : View verify news form */
router.get('/', function(req, res, next) {
  res.render('verify-news/verify-news-form', {
    title: "Verify News Articles",
    page : "verify"
  });
});

router.post('/url', async function(req, res, next) {
  const { newsUrl } = req.body;
  var trusted = false;
  
  const sources = (await getSources()).val();  
  console.log(sources)
  domains = [];
  for (let [key, value] of Object.entries(sources)) {
    domains.push(value.domain);
  }
  console.log(domains)
  dom = domain.hostname(newsUrl);

  const verifyNewsResultTrusted = {
    result: "trusted",
    source: { name: dom},
    articles: {},
    url : newsUrl
  };

  // Verify news result - Untrusted
  const verifyNewsResultUntrusted = {
    result: "untrusted",
    source: { name: dom},
    articles: {},
    url : newsUrl
  };

  if(domains.includes(dom)){

    trusted = true;
    res.render('verify-news/verify-news-complete', {
      title: "Verify News Articles Complete",
      verifyNewsResult: verifyNewsResultTrusted,
      page : "verify"
    });

  }
  else{
    res.render('verify-news/verify-news-complete', {
      title: "Verify News Articles Complete",
      verifyNewsResult: verifyNewsResultUntrusted,
      page : "verify"
    });
  }

  // res.render('verify-news/verify-news-form', {
  //   title: "Verify News Articles"
  // });
});


router.post('/text', async function(req, res, next) {
  const { newsText } = req.body;
  var trusted = false;
  articleFound = {};
  console.log(newsText)
  
  const articles = (await getNewsArticles()).val();  
  // console.log(articles)

  content = []
  for (let [key, value] of Object.entries(articles)) {
    if(value.content!=null){
     content.push(value.content);
     if(value.content.substring(0,190).includes(newsText.substring(0,100))){
      trusted = true;
      articleFound = value;
     }
  }
  }

  console.log(content)

  console.log("******************")
  console.log(articleFound)

  const verifyNewsResultUnknown = {
    result: "unknown",
  }

  if(trusted == true){

    const verifyNewsResultTrusted = {
      result: "trusted",
      articles: {articleFound},
      source: {name: articleFound.source.name},
      url : " "
    };

    res.render('verify-news/verify-news-complete', {
      title: "Verify News Articles Complete",
      verifyNewsResult: verifyNewsResultTrusted,
      page : "verify"
    });

  }
  else{
    res.render('verify-news/verify-news-complete', {
      title: "Verify News Articles Complete",
      verifyNewsResult: verifyNewsResultUnknown,
      page : "verify"
    });
  }

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
    verifyNewsResult: verifyNewsResultUntrusted,
    page : "verify"
  });
});

module.exports = router;
