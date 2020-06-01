const express = require('express');
const router = express.Router();

const {getNewsArticles, getUsers} = require('./news/index');
const {getUserAccounts, getUserActionHistory, getUserAccount, getNewsArticleMeta, pushTransaction, getArticleRatingsHistory, calculateArticleScore, getArticleRatings} = require('./eosjs/index');

router.get('/', async (req, res, next) => {
    const articleRatings = await getArticleRatings(8);

    const userAccounts = (await getUserAccounts()).filter(user => user.role == "judge").map(user => user.user);
    const judgeRatings = articleRatings.filter(article => userAccounts.indexOf(article.user) != -1);  
    
    console.log(judgeRatings);

    const totalRating = await Promise.all(judgeRatings.map(async (article) => article.rating*parseFloat((await getUserAccount(article.user)).weight)));

    const totalWeight = await Promise.all(judgeRatings.map(async (article) => parseFloat((await getUserAccount(article.user)).weight)));
     
    const totalRatingSum = totalRating.reduce((total,r) => total + r, 0);
    const totalWeightSum = totalWeight.reduce((total,w) => total + w, 0);

    const totalScore = Math.round(totalRatingSum / totalWeightSum);

    res.json({
        totalRatingSum,
        totalWeightSum,
        totalScore
    });
});

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