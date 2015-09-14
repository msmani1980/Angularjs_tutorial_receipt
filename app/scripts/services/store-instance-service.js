'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceService
 * @description
 * # storeInstanceService
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceService', function ($resource, ENV) {
  var requestURL = ENV.apiUrl + '/api/dispatch/store-instances/:id/:api/:itemIdOrBulk';
  var requestParameters = {
    id: '@id',
    api: '@api',
    itemIdOrBulk: '@itemIdOrBulk'
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
    updateStoreInstanceItemsBulk: {
      method: 'POST'
    },
    createStoreInstanceItem: {
      method: 'POST'
    },
    deleteStoreInstanceItem: {
      method: 'DELETE'
    },
    getStoreInstanceMenuItems: {
      method: 'GET'
    },
    updateStoreInstanceStatus: {
      method: 'PUT'
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
    var requestPayload = angular.extend({}, {id: id}, payload);
    return requestResource.updateStoreInstance(requestPayload).$promise;
  }

  function deleteStoreInstance(id) {
    return requestResource.deleteStoreInstance({id: id}).$promise;
  }

  function getStoreInstanceItemList(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items'
    }, payload);
    return requestResource.getStoreInstanceItemList(requestPayload).$promise;
  }

  function getStoreInstanceItem(storeId, itemId) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'items',
      itemIdOrBulk: itemId
    });
    return requestResource.getStoreInstanceItem(requestPayload).$promise;
  }

  function updateStoreInstanceItem(storeId, itemId, payload) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'items',
      itemIdOrBulk: itemId
    });
    return requestResource.updateStoreInstanceItem(requestPayload, payload).$promise;
  }

  function updateStoreInstanceItemsBulk(storeId, payload) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'items',
      itemIdOrBulk: 'bulk'
    });
    return requestResource.updateStoreInstanceItemsBulk(requestPayload, payload).$promise;
  }
  function createStoreInstanceItem(storeId, payload) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'items'
    });
    return requestResource.createStoreInstanceItem(requestPayload, payload).$promise;
  }

  function deleteStoreInstanceItem(storeId, itemId, payload) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'items',
      itemIdOrBulk: itemId
    }, payload);
    return requestResource.deleteStoreInstanceItem(requestPayload).$promise;
  }

  function getStoreInstanceMenuItems(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'menu-items'
    }, payload);
    return requestResource.getStoreInstanceMenuItems(requestPayload).$promise;
  }

  function updateStoreInstanceStatus(storeId, statusId) {
    var requestPayload = angular.extend({}, {
      id: storeId,
      api: 'status',
      itemIdOrBulk: statusId
    });
    return requestResource.updateStoreInstanceStatus(requestPayload).$promise;
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
    updateStoreInstanceItemsBulk: updateStoreInstanceItemsBulk,
    updateStoreInstanceStatus: updateStoreInstanceStatus,
    createStoreInstanceItem: createStoreInstanceItem,
    deleteStoreInstanceItem: deleteStoreInstanceItem
  };
});
