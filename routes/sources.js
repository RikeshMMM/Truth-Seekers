let express = require('express');
let router = express.Router();

const { getSources, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource, getNewsArticlesBySourceName } = require('./news/index');


/* GET home page. */
router.get('/', async (req, res, next) => {

  const sources = (await getSources()).val();
  sourceList = []
  
  for (let [key, value] of Object.entries(sources)) {
    var obj = {};
    // obj.rating = Math.floor(Math.random() * 99) + 75; 
    obj.name = toTitleCase(value.name);
    obj.domain = value.domain;
    obj.logo = value.logo;
    var sum = 0;

    const articles = (await getNewsArticlesBySourceName(toTitleCase(value.name))).val();
    // console.log(articles)
    if(articles!=null){
      for (let [key, value] of Object.entries(articles)) {

        sum += value.rating;

      }
      obj.rating = Math.floor(sum / Object.keys(articles).length)
      sourceList.push(obj);
    }
  }

  sourceList.sort((a, b) => (a.rating < b.rating) ? 1 : -1)

  console.log(sourceList)
  res.render('sources', {
      title: 'Trusted Source',
      sources : sourceList,
      page : "sources"
    });
});

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}
module.exports = router;
