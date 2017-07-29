'use strict';

const yelp = require('yelp-fusion');

function SearchHandler() {
  this.getNightLife = (req, res) => {
    return yelp
      .accessToken(
        process.env.YELP_CLIENT_ID,
        process.env.YELP_CLIENT_SECRET
      )
      .then(response => {
          const client = yelp.client(response.jsonBody.access_token);

          client.search({
            term:'bars',
            location: 'helsinki'
          }).then(response => {
            return res.render('home',
              {
                data: JSON.stringify(response.jsonBody.businesses),
                total: JSON.stringify(response.jsonBody.total),
              }
            );
          });
        }).catch(e => {
          console.log(e);
          return e;
        });
  }
}

module.exports = SearchHandler;
