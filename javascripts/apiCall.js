'use strict';

var movieHistor = (function () {
  return {
    OMDbCredentials : function() {
      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'GET',
          url: 'http://www.omdbapi.com/?t=star+wars&y=&plot=short&r=json'
        }).then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
      });
    }
  };
})();