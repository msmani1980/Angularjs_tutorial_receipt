'use strict';

/**
 * @ngdoc service
 * @name ts5App.httpSessionInterceptor
 * @description
 * # httpSessionInterceptor
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('httpSessionInterceptor', function ($rootScope, $q) {

    var errorCodeMap = {
      401: 'unauthorized',
      404: 'http-response-error',
      500: 'http-response-error'
    };

    function responseError(response) {
      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }
      return $q.reject(response);
    }

    return {
      responseError: responseError
    };

  });
