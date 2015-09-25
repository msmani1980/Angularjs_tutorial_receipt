'use strict';

/**
 * @ngdoc service
 * @name ts5App.httpErrorHandlerFactory
 * @description
 * # httpErrorHandlerFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('httpErrorHandlerFactory', function ($q) {

    //$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    var sessionInjector = {
      request: function (config) {
        config.headers.sessionToken = '9e85ffbb3b92134fbf39a0c366bd3f12f0f5';
        config.headers.timeout      = 1200000;
        return config;
      },
      requestError: function (rejection) {
        console.log(rejection.status);
        return $q.reject(rejection);
      },
      responseError: function (rejection) {
        if (!rejection.status && rejection.message) {
          rejection = {
            status: 404,
            message: rejection.message
          }
        }
        return $q.reject(rejection);
      },
      response: function (response) {
        // Session has expired
        //if (response.status == 403){
        //  var deferred = $q.defer();
        //
        //  // Create a new session (recover the session)
        //  // We use login method that logs the user in using the current credentials and
        //  // returns a promise
        //  SessionService.login().then(deferred.resolve, deferred.reject);
        //
        //  // When the session recovered, make the same backend call again and chain the request
        //  return deferred.promise.then(function() {
        //    return $http(response.config);
        //  });
        //}
        //return $q.reject(response);
        return response;
      }
    };
    return sessionInjector;

  });
