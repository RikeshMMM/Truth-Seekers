// EOSIO Setup
const { Api, JsonRpc, RpcError, WebAuthn } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch'); 
const { TextEncoder, TextDecoder } = require('util');  

const defaultPrivateKey = "5JRgFHzfFG2jSywW2PPKhQ5p2dtooKLS53QukWVm7B1kMQddvr2";
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

/**
 * Get user accounts from users table
 * @return {Array} - Array of user accounts
 */
const getUserAccounts = async () => {
    try {
        const userAccounts = await rpc.get_table_rows({
            "json": true,
            "code": "covidtimes",
            "scope": "covidtimes",
            "table": "users",
        });
        return userAccounts.rows;
    } catch (err) {
        console.error(err);
    }
};

const getArticleRatingsHistory = async () => {
    try {
        const articleRatingsHistory = await rpc.get_table_rows({
            "json": true,
            "code": "covidtimes",
            "scope": "covidtimes",
            "table": "ratings",
        });
        return articleRatingsHistory.rows;
    } catch (err) {
        console.error(err);
    }
}

const getUserActionHistory = async (user) => {
    try {
        const userActionHistory = await rpc.history_get_actions(user);
        return userActionHistory;
    } catch (err) {
        console.error(err);
    }
};

const getArticleRatingTransactionHistory = async (articleId) => {
    // Get article rating history    
    const articleRatingsHistory = await getArticleRatingsHistory();
    const filteredArticleRatingsHistory = articleRatingsHistory.filter(article => article.article_id === articleId);

    // Get action history of the users who rated the article
    const transactionHistory = filteredArticleRatingsHistory.map(async articleRating => {
        // Get the user who rated the article
        const user = articleRating.user;

        // Get action history of the user
        const userActionHistory = await (await getUserActionHistory(user)).actions;
        
        // Get the action for the rateArticle action
        const rateArticleAction = await userActionHistory.find(action => action.action_trace.act.name === "ratearticle" && action.action_trace.act.data.article_id === articleId);

        return rateArticleAction; 
    });

    return Promise.all(transactionHistory);

}

module.exports = {
    getUserAccounts,
    getArticleRatingsHistory,
    getUserActionHistory,
    getArticleRatingTransactionHistory
}

