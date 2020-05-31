const express = require('express');
let cookieParser = require('cookie-parser');
const router = express.Router();

const { getNewsArticles, getUsers, getNewsArticle, getNewsArticlesRef, getNewsArticlesBySource } = require('./news/index');


/** GET : Browse all news articles */
router.get('/', async (req, res, next) => {
    // Render the articles
    res.render('login', {
        title: 'login',
        alert: ""
      });
});

  /** GET : Browse all news articles */
router.post('/verify', async (req, res, next) => {

    const { user } = req.body;
    const { password } = req.body;
    const users = (await getUsers()).val();
    let valid = false;
    let account = {};

    // console.log(users)
    userList = []
    for (let [key, value] of Object.entries(users)) {
       
       if(key==user || value.email==user){
        
        if(value.password == password){
            valid = true;
            account.username = key;
            account.info = value;
        }
    }
    }

    res.cookie("userData", account);
    console.log("#############################################################")
    // console.log(req.cookies)

    if(valid == false){
 
        res.render('login', {
            title: 'login',
            alert: "Incorrect username/password! Please try again."
        });
    }
    else{
    // console.log(user)
    // console.log(password)
    // console.log(account)
    res.redirect('/');
    }
  });

module.exports = router;
