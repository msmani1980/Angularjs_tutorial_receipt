'use strict';

/**
 * @ngdoc service
 * @name ts5App.httpSessionInterceptor
 * @description
 * # httpSessionInterceptor
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('httpSessionInterceptor', function ($rootScope, $location) {

    function request(config) {
      config.headers.sessionToken = '9e85ffbb3b92134fbf39a0c366bd3f12f0f5';
      config.headers.timeout = 1200000;
      return config;
    }

    return {
      request: request
    };

  });
