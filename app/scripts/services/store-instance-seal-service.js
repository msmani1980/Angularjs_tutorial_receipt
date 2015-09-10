'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceSealService
 * @description
 * # storeInstanceSealService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceSealService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/dispatch/store-instances/:id/seals';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getStoreInstanceSeals: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoreInstanceSeals(id) {
      return requestResource.getStoreInstanceSeals({id: id}).$promise;
    }

    return {
      getStoreInstanceSeals: getStoreInstanceSeals
    };
  });
