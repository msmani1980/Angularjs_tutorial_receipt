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

    var requestURL = ENV.apiUrl + '/api/store-instances/:id/seals/:storeInstanceId';

    var requestParameters = {
      id: '@id',
      storeInstanceId: '@storeInstanceId'
    };

    var actions = {
      getStoreInstanceSeals: {
        method: 'GET'
      },
      updateStoreInstanceSeal: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoreInstanceSeals(sealId) {
      return requestResource.getStoreInstanceSeals({id: sealId}).$promise;
    }

    function updateStoreInstanceSeal(sealId, storeInstanceId, payload) {
      return requestResource.updateStoreInstanceSeal({id: sealId, storeInstanceId: storeInstanceId}, payload).$promise;
    }

    return {
      getStoreInstanceSeals: getStoreInstanceSeals,
      updateStoreInstanceSeal: updateStoreInstanceSeal
    };
  });
