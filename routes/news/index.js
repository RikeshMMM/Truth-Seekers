// Include Firebase
const firebase = require("firebase/app");
require("firebase/database");

// Firebase configurations
const firebaseConfig = {
  apiKey: "AIzaSyC6vrrXdXymi1Keml214KkUJzDc_ksPJfY",
  authDomain: "eosio-511fa.firebaseapp.com",
  databaseURL: "https://eosio-511fa.firebaseio.com",
  projectId: "eosio-511fa",
  storageBucket: "eosio-511fa.appspot.com",
  messagingSenderId: "133190663906",
  appId: "1:133190663906:web:5bff22a7324d59017f68bb",
  measurementId: "G-TFNY6GXKTN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const getNewsDatabase = () => firebase.database();

/**
 * Get reference to news articles
 * @returns {Reference} - Firebase database reference
 */
const getNewsArticlesRef = () => firebase.database().ref('/articles');

/**
 * Get all news articles
 * @returns {Promise} - Database snapshot with news articles
 */
const getNewsArticles = async () => await firebase.database().ref('/articles').once('value');
const getUsers = async () => await firebase.database().ref('/users').once('value');

const getSources = async () => await firebase.database().ref('/sources').once('value');


/**
 * Get specified news articles
 * @param {string} articleID - Article ID requesting for
 * @returns {Promise} - Database snapshot with news article
 */
const getNewsArticle = async (articleID) => await firebase.database().ref(`/articles/${articleID}`).once('value');

/**
 * Get news articles by source
 * @param {string} sourceID - Source ID requesting for
 * @returns {Promise} - Database snapshot with news articles from the requested source
 */
// TODO: Make index on source/id for better performance
const getNewsArticlesBySource = async (sourceID) => await getNewsArticlesRef().orderByChild('source/id').equalTo(sourceID).once('value');

const getNewsArticlesBySourceName = async (sourceName) => await getNewsArticlesRef().orderByChild('source/name').equalTo(sourceName).once('value');

module.exports = {
  getUsers,
  getSources,
  getNewsDatabase,
  getNewsArticlesRef,
  getNewsArticles,
  getNewsArticle,
  getNewsArticlesBySource,
  getNewsArticlesBySourceName
}