var gt = (function (ns, $, d3, Trello) {

  /*
  * Private helpers
  * */
  function par(array) {
    var seed = $.Deferred().resolve([]);
    if (!array || array.length == 0) return seed;
    else {
      return array.map(
        function (p) {
          return p();
        }).reduce(function (state, promise) {
          return state.pipe(function (input) {
            return promise.pipe(function (i) {
              return input.concat(i);
            });
          });
        }, seed.promise());
    }
  }


  /*
  * Public API
  * */
  var my = {
    auth: function () {
      return $.Deferred(function (d) {
        Trello.authorize({
          type: "popup",
          name: "Gantrello",
          expiration: "never",
          success: function () {
            d.resolve();
          },
          error: function (err) {
            d.reject(err);
          }
        });
      })
    },
    whoAmI: function () {
      return $.Deferred(function (d) {
        Trello.rest('GET', '/members/me', function (me) {
          d.resolve(me);
        }, function (err) {
          d.reject(err);
        })
      })
    },
    getMyBoard: function (memberId) {
      return $.Deferred(function (d) {
        Trello.rest('GET', 'members/' + memberId + '/boards', function (boards) {
          d.resolve(boards);
        }, function (err) {
          d.reject(err);
          alert('Invalid member id', err);
        })
      })
    },
    getBoard : function(boardId){
      return $.Deferred(function(d) {
        Trello.rest('GET', '/boards/'+ boardId + '?cards=open', function(boardWithCards){
          d.resolve(boardWithCards);
        }, function(err){
          d.reject(err);
        })
      })
    },
    getCardActions: function (cardId) {
      return $.Deferred(function (d) {
        Trello.rest('GET', '/cards/' + cardId + '/actions?filter=updateCard:idList', function (actions) {
          d.resolve(actions);
        }, function (err) {
          d.reject(err);
        })
      }).promise;
    },
    getCardsActions: function (cardIds) {
      var self = this;
      return par(cardIds.map(function (id) {
        return self.getCardActions(id);
      }));
    }



};

  console.log(my);
  return my;

}(gt || {}, jQuery, d3, Trello));
