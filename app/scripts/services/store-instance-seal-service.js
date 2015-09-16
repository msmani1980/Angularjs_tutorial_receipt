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

    var requestURL = ENV.apiUrl + '/api/store-instances/:storeInstanceId/seals/:id';

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
      },
      createStoreInstanceSeal: {
        method: 'POST',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoreInstanceSeals(storeInstanceId,sealId) {
      return requestResource.getStoreInstanceSeals({storeInstanceId: storeInstanceId, id: sealId}).$promise;
    }

    function createStoreInstanceSeal(storeInstanceId, payload) {
      return requestResource.createStoreInstanceSeal({storeInstanceId: storeInstanceId}, payload).$promise;
    }

    function updateStoreInstanceSeal(sealId, storeInstanceId, payload) {
      return requestResource.updateStoreInstanceSeal({id: sealId, storeInstanceId: storeInstanceId}, payload).$promise;
    }

    return {
      getStoreInstanceSeals: getStoreInstanceSeals,
      updateStoreInstanceSeal: updateStoreInstanceSeal,
      createStoreInstanceSeal: createStoreInstanceSeal
    };
  });
