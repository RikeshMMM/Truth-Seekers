const express = require('express');
const router = express.Router();

const {getNewsArticles} = require('./news/index');
const {getUserActionHistory, pushTransaction} = require('./eosjs/index');

router.get('/', async (req, res, next) => {
    const userActionHistory = await getUserActionHistory("covidtimes");
    res.send(userActionHistory);
})

router.get('/update-news-articles', async (req, res, next) => {
    // Get news articles from database
    const newsArticles = await (await getNewsArticles()).val();

    let actions = [];

    for (let [key, value] of Object.entries(newsArticles)) {
        let actionObj = {
            account: 'covidtimes',
            name: 'addarticle',
            authorization: [{
                actor: 'covidtimes',
                permission: 'active',
            }],
            data: {
                article: key,
                article_id: value.id
            },
        };
        actions.push(actionObj);
    };

    const result = await pushTransaction(actions);
    res.send(result);
});

module.exports = router;