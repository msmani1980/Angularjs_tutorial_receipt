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
    updateStoreInstanceItem: {
      method: 'PUT'
    },
    createStoreInstanceItem: {
      method: 'POST'
    },
    deleteStoreInstanceItem: {
      method: 'DELETE'
    },
    getStoreInstanceMenuItems: {
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

  function getStoreInstanceItemList(id, payload) {
    return requestResource.getStoreInstanceItemList({
      id: id,
      api: 'items'
    }, payload).$promise;
  }

  function getStoreInstanceItem(storeId, itemId) {
    return requestResource.getStoreInstanceItem({
      id: storeId,
      api: 'items',
      itemId: itemId
    }).$promise;
  }

  function updateStoreInstanceItem(storeId, itemId, payload) {
    return requestResource.updateStoreInstanceItem({
      id: storeId,
      api: 'items',
      itemId: itemId
    }, payload).$promise;
  }

  function createStoreInstanceItem(storeId, payload) {
    return requestResource.createStoreInstanceItem({
      id: storeId,
      api: 'items'
    }, payload).$promise;
  }

  function deleteStoreInstanceItem(storeId, itemId, payload) {
    return requestResource.deleteStoreInstanceItem({
      id: storeId,
      api: 'items',
      itemId: itemId
    }, payload).$promise;
  }

  function getStoreInstanceMenuItems(id, payload) {
    return requestResource.getStoreInstanceMenuItems({
      id: id,
      api: 'menu-items'
    }, payload).$promise;
  }

  return {
    getStoreInstancesList: getStoreInstancesList,
    getStoreInstance: getStoreInstance,
    createStoreInstance: createStoreInstance,
    updateStoreInstance: updateStoreInstance,
    deleteStoreInstance: deleteStoreInstance,
    getStoreInstanceItemList: getStoreInstanceItemList,
    getStoreInstanceItem: getStoreInstanceItem,
    getStoreInstanceMenuItems: getStoreInstanceMenuItems,
    updateStoreInstanceItem: updateStoreInstanceItem,
    createStoreInstanceItem: createStoreInstanceItem,
    deleteStoreInstanceItem: deleteStoreInstanceItem
  };
});
