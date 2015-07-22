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

    var storesRequestURL = ENV.apiUrl + '/api/companies/stores/:id';

    var requestParameters = {
      id: '@id'
    };

    var storesActions = {
      createStore: {
        method: 'POST'
      },
      getStores: {
        method: 'GET'
      },
      deleteStore: {
        method: 'DELETE'
      },
      getStore : {
        method: 'GET'
      }
    };
    var storesRequestResource = $resource(storesRequestURL, requestParameters, storesActions);

    var createStore = function (payload) {
      return storesRequestResource.createStore(payload).$promise;
    };
    var getStores = function () {
      return storesRequestResource.getStores().$promise;
    };
    var deleteStore = function (_id) {
      return storesRequestResource.deleteStore({id:_id}).$promise;
    };
    var getStore = function(_id) {
      return storesRequestResource.getStore({id:_id}).$promise;
    };
    return {
      getStore: getStore,
      createStore: createStore,
      getStores: getStores,
      deleteStore: deleteStore
    };
  });
