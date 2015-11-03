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
      500: 'internal-server-error'
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
