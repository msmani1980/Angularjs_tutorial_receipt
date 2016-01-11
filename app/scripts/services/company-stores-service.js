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
      getStoreList: {
        method: 'GET'
      },
      deleteStore: {
        method: 'DELETE'
      },
      getStore: {
        method: 'GET'
      },
      saveStore: {
        method: 'PUT'
      }
    };
    var storesRequestResource = $resource(storesRequestURL, requestParameters, storesActions);

    var createStore = function (payload) {
      return storesRequestResource.createStore(payload).$promise;
    };

    var getStoreList = function (payload) {
      return storesRequestResource.getStoreList(payload).$promise;
    };

    var deleteStore = function (_id) {
      return storesRequestResource.deleteStore({ id:_id }).$promise;
    };

    var getStore = function(_id) {
      return storesRequestResource.getStore({ id:_id }).$promise;
    };

    var saveStore = function(payload) {
      return storesRequestResource.saveStore(payload).$promise;
    };

    return {
      getStore: getStore,
      createStore: createStore,
      getStoreList: getStoreList,
      deleteStore: deleteStore,
      saveStore: saveStore
    };
  });
