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
    var requestURL = ENV.apiUrl + '/api/companies/stores';

    var requestParameters = {};

    var actions = {
      getStoresList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoresList(query) {
      return requestResource.getStoresList(query).$promise;
    }

    return {
      getStoresList: getStoresList
    };

  });
