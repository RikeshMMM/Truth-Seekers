#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <math.h>

using namespace std;
using namespace eosio;

CONTRACT covittimes : public contract {
  public:
    using contract::contract;

    // Action to add a new news article to the news articles table
    ACTION addarticle(uint64_t article_id, string article);

    // Action to increment rating count of a new article
    ACTION inccount(uint64_t article_id);

    // Action to decrement rating count of a new article
    ACTION deccount(uint64_t article_id);

    // Action to add a new user record in the users table
    ACTION adduser(name user, string password, string role);

    // Action to update weight of the user
    ACTION updateweight(name user, double weight);

    // Action to rate a news article
    ACTION ratearticle(uint64_t id, name user, uint64_t article_id, uint64_t rating);

    // Update article rating
    ACTION uprating(uint64_t article_id, uint64_t rating);

    // Action to remove rating of news article
    ACTION rmrating(uint64_t id);

  private:
    TABLE news_article_info {
      uint64_t article_id;
      string article;
      string type = "pending";
      uint64_t rating = 0;
      uint64_t ratingCount = 0;
      auto primary_key() const { return article_id; }
    };
    typedef multi_index<name("newsarticles"), news_article_info> news_articles_table;

    TABLE user_info {
      name user;
      string password;
      string role;
      double weight = 0.0;
      auto primary_key() const { return user.value; }
    };
    typedef multi_index<name("users"), user_info> users_table; 

    TABLE article_rating_info {
      uint64_t id;
      name user;
      uint64_t article_id;
      uint64_t rating;
      auto primary_key() const { return id; }
    };
    typedef multi_index<name("ratings"), article_rating_info> article_ratings_table; 
};
