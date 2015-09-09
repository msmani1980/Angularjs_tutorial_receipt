'use strict';

/**
 * @ngdoc service
 * @name ts5App.storesService
 * @description
 * # storesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storesService', function($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/companies/stores/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getStoresList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoresList(query) {
      return requestResource.getStoresList(query).$promise;
    }

    function getStore(id) {
      return requestResource.getStoresList({id: id}).$promise;
    }

    return {
      getStoresList: getStoresList,
      getStore: getStore
    };

  });
