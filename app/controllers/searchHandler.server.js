'use strict';

const yelp = require('yelp-fusion');

function SearchHandler() {
  this.getNightLife = (req, res) => {
    const location = req.query.search ? req.query.search : '';

    return yelp
      .accessToken(
        process.env.YELP_CLIENT_ID,
        process.env.YELP_CLIENT_SECRET
      )
      .then(response => {
          const client = yelp.client(response.jsonBody.access_token);

          client.search({
            term:'bars',
            location: location
          }).then(response => {
            return res.render('home',
              {
                data: JSON.stringify(response.jsonBody.businesses)
              }
            );
          })
          .catch(e => {
            const errorMessage = 'We couldn\'t find anything in the location "' + location + '."';
            return res.render('home',
              {
                error: location ? errorMessage : null,
                data: JSON.stringify([]),
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
