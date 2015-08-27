'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceService
 * @description
 * # storeInstanceService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceService', function($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/dispatch/store-instances/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getStoreInstancesList: {
        method: 'GET'
      },
      getStoreInstance: {
        method: 'GET'
      },
      createStoreInstance: {
        method: 'POST'
      },
      updateStoreInstance: {
        method: 'PUT'
      },
      deleteStoreInstance: {
        method: 'DELETE'
      }
    };
    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStoreInstancesList(query) {
      return requestResource.getStoreInstancesList(query).$promise;
    }
    function getStoreInstance(id) {
      return requestResource.getStoreInstance({id: id}).$promise;
    }
    function createStoreInstance(payload) {
      return requestResource.createStoreInstance(payload).$promise;
    }
    function updateStoreInstance(id, payload) {
      return requestResource.updateStoreInstance({id: id}, payload).$promise;
    }
    function deleteStoreInstance(id) {
      return requestResource.deleteStoreInstance({id: id}).$promise;
    }

    return {
      getStoreInstancesList: getStoreInstancesList,
      getStoreInstance: getStoreInstance,
      createStoreInstance: createStoreInstance,
      updateStoreInstance: updateStoreInstance,
      deleteStoreInstance: deleteStoreInstance
    };
  });
