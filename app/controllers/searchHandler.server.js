'use strict';

const yelp = require('yelp-fusion');
const Bar = require('../models/bars');

function SearchHandler() {
  this.voteForBar = (req, res) => {
    const searchTerm = req.query.search;
    const barId = req.params.id;
    if (!barId) { return }

    return Bar
      .findOne({id: barId})
      .then(addOrUpdateBar)
      .then(redirectToHomePage);

    function addOrUpdateBar(dbData) {
      if (dbData) {
        updateExistingBar(dbData);
      } else {
        addNewBar();
      }
    }

    function updateExistingBar(bar) {
      if (bar.visitors.includes(req.user.twitter.id)) {
        let visitors = bar.visitors.filter(
          id => id !== req.user.twitter.id
        );
        bar.visitors = visitors;
      } else {
        bar.visitors.push(req.user.twitter.id);
      }
      return bar.save();
    }

    function addNewBar() {
      let bar = new Bar({
        id: barId,
        visitors: [req.user.twitter.id]
      });
      return bar.save();
    }

    function redirectToHomePage() {
      res.redirect('/?search=' + searchTerm);
    }
  };

  this.getNightLife = (req, res) => {
    const location = req.query.search ? req.query.search : '';
    const userId = req.user ? req.user.twitter.id : null;
    const searchTerm = req.query.search;

    return yelp
      .accessToken(
        process.env.YELP_CLIENT_ID,
        process.env.YELP_CLIENT_SECRET
      )
      .then(renderResponse)
      .catch(e => { console.log(e); return e; });

      function renderResponse(response) {
        const client = yelp.client(response.jsonBody.access_token);

        return client
          .search({term:'bars', location: location})
          .then(returnData)
          .catch(returnErrorMessage);

        function returnData(response) {
          const businesses = response.jsonBody.businesses;
          return Bar
            .find()
            .then(renderBarsAndResponse);

            function renderBarsAndResponse(bars) {
              return res.render('home',
                {
                  data: JSON.stringify(businesses),
                  bars: JSON.stringify(bars),
                  userId: userId,
                  searchTerm: searchTerm
                }
            );
          }
        }

        function returnErrorMessage() {
          const errorMessage = 'We couldn\'t find anything in the location "' + location + '."';
          return res.render(
            'home',
            {
              error: location ? errorMessage : null,
              data: JSON.stringify([]),
              searchTerm: searchTerm
            }
          );
        }
      }
  }
}

module.exports = SearchHandler;
