'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyStoresService
 * @description
 * # companyStoresService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyStoresService', function ($resource, ENV) {

    var storesRequestURL = ENV.apiUrl + '/api/companies/stores';

    var storesActions = {
      createStore: {
        method: 'POST'
      },
      getStores: {
        method: 'GET'
      },
      deleteStore: {
        method: 'DELETE'
      }
    };
    var storesRequestResource = $resource(storesRequestURL, {}, storesActions);

    var createStore = function (payload) {
      return storesRequestResource.createStore(payload).$promise;
    };
    var getStores = function () {
      return storesRequestResource.getStores().$promise;
    };
    var deleteStore = function () {
      return storesRequestResource.deleteStore().$promise;
    };
    return {
      createStore: createStore,
      getStores: getStores,
      deleteStore: deleteStore
    };
  });
