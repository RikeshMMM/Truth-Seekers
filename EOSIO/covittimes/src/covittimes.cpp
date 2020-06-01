#include <covittimes.hpp>

// Action to CREATE a new news article to the news articles table
ACTION covittimes::addarticle(uint64_t article_id, string article) {
  require_auth(get_self());

  // Initilize the table
  news_articles_table _news_articles(get_self(), get_self().value);

  // Find the record from _news_articles table
  auto news_articles_itr = _news_articles.find(article_id);
  check(news_articles_itr == _news_articles.end(), "Article already exists!");
  
  // Create a new article record if it does not exist
  _news_articles.emplace(get_self(), [&](auto& news_article) {
    news_article.article_id = article_id;
    news_article.article = article;
  });
}

// Action to increment rating count of a new article
ACTION covittimes::inccount(uint64_t article_id) {
  require_auth(get_self());

  // Initilize the table
  news_articles_table _news_articles(get_self(), get_self().value);

  // Find the record from _news_articles table
  auto news_articles_itr = _news_articles.find(article_id);
  check(news_articles_itr != _news_articles.end(), "Article doesnt exists!");

  // Increment the review counter
  _news_articles.modify(news_articles_itr, _self, [&](auto& news_article) {
    news_article.ratingCount = news_article.ratingCount+1;
  });
}

// Action to decrement rating count of a new article
ACTION covittimes::deccount(uint64_t article_id) {
  require_auth(get_self());

  // Initilize the table
  news_articles_table _news_articles(get_self(), get_self().value);

  // Find the record from _news_articles table
  auto news_articles_itr = _news_articles.find(article_id);
  check(news_articles_itr != _news_articles.end(), "Article doesnt exists!");

  // Increment the review counter
  _news_articles.modify(news_articles_itr, _self, [&](auto& news_article) {
    news_article.ratingCount = news_article.ratingCount-1;
  });
}

// Action to add a new user record in the users table
ACTION covittimes::adduser(name user, string password, string role) {
  require_auth(user);

  // Initilize the table
  users_table _users(get_self(), get_self().value);

  // Find the record from _users table
  auto users_itr = _users.find(user.value);
  if (users_itr == _users.end()) {
    // Create a new user record if it does not exist
    _users.emplace(user, [&](auto& new_user) {
      new_user.user = user;
      new_user.password = password;
      new_user.role = role;
    });
  } else {
    _users.modify(users_itr, user, [&](auto& new_user) {
      new_user.password = password;
      new_user.role = role;
    });
  }
}

// Action to update weight of the user
ACTION covittimes::updateweight(name user, double weight) {
  require_auth(user);

  // Initilize the table
  users_table _users(get_self(), get_self().value);

  // Find the record from _users table
  auto users_itr = _users.find(user.value);
  check(users_itr != _users.end(), "User not found!");

  string role = weight >= 0.75 ? "judge" : "reader";

  _users.modify(users_itr, user, [&](auto& new_user) {
    new_user.weight = weight;
    new_user.role = role;
  });
}

// Action to rate a news article
ACTION covittimes::ratearticle(uint64_t id, name user, uint64_t article_id, uint64_t rating) {
  require_auth(user);

  // Initilize the table
  article_ratings_table _article_ratings(get_self(), get_self().value);

  // Find the record from _article_ratings table
  auto article_ratings_itr = _article_ratings.find(id);
  if (article_ratings_itr == _article_ratings.end()) {
    // Create a new report record if it does not exist
    _article_ratings.emplace(user, [&](auto& article_rating) {
      article_rating.id = id;
      article_rating.user = user;
      article_rating.article_id = article_id;
      article_rating.rating = rating;
    });
  }
}

// Update article rating
ACTION covittimes::uprating(uint64_t article_id, uint64_t rating) {
  require_auth(get_self());

  // Initilize the table
  news_articles_table _news_articles(get_self(), get_self().value);

  // Find the record from _news_articles table
  auto news_articles_itr = _news_articles.find(article_id);
  check(news_articles_itr != _news_articles.end(), "Article doesnt exists!");

  string type = rating >= 66 ? "trusted" : "untrusted";

  // Update article rating
  _news_articles.modify(news_articles_itr, _self, [&](auto& news_article) {
    news_article.rating = rating;
    news_article.type = "trusted";
  });
}

// Action to remove rating of news article
ACTION covittimes::rmrating(uint64_t id) {
  require_auth(get_self());

  // Initilize the table
  article_ratings_table _article_ratings(get_self(), get_self().value);

  // Find the record from _news_articles table
  auto article_ratings_itr = _article_ratings.find(id);
  check(article_ratings_itr != _article_ratings.end(), "Rating doesnt exists!");

  // Delete article rating
  _article_ratings.erase(article_ratings_itr);
}

EOSIO_DISPATCH(covittimes, (addarticle)(inccount)(deccount)(adduser)(updateweight)(ratearticle)(uprating)(rmrating))
