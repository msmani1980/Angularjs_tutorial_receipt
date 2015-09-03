'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceService
 * @description
 * # storeInstanceService
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceService', function ($resource, ENV) {
  var requestURL = ENV.apiUrl + '/api/dispatch/store-instances/:id/:api/:itemId';
  var requestParameters = {
    id: '@id',
    api: '@api',
    itemId: '@itemId'
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
    },
    getStoreInstanceItemList: {
      method: 'GET'
    },
    getStoreInstanceItem: {
      method: 'GET'
    },
    getStoreInstancesMenuItems: {
      method: 'GET'
    }
  };

  var requestResource = $resource(requestURL, requestParameters, actions);

  function getStoreInstancesList(payload) {
    return requestResource.getStoreInstancesList(payload).$promise;
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

  function getStoreInstanceItemList(id) {
    return requestResource.getStoreInstanceItemList({
      id: id,
      api: 'items'
    }).$promise;
  }

  function getStoreInstanceItem(storeId, itemId) {
    return requestResource.getStoreInstanceItem({
      id: storeId,
      api: 'items',
      itemId: itemId
    }).$promise;
  }

  function getStoreInstanceMenuItems(id) {
    return requestResource.getStoreInstanceMenuItems({
      id: id,
      api: 'menu-items'
    }).$promise;
  }

  return {
    getStoreInstancesList: getStoreInstancesList,
    getStoreInstance: getStoreInstance,
    createStoreInstance: createStoreInstance,
    updateStoreInstance: updateStoreInstance,
    deleteStoreInstance: deleteStoreInstance,
    getStoreInstanceItemList: getStoreInstanceItemList,
    getStoreInstanceItem: getStoreInstanceItem,
    getStoreInstanceMenuItems: getStoreInstanceMenuItems
  };
});
