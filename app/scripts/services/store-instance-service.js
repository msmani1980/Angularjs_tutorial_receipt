'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceService
 * @description
 * # storeInstanceService
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceService', function ($resource, ENV) {
  var requestURL = ENV.apiUrl + '/rsvr/api/dispatch/store-instances/:id/:api/:itemIdOrBulk';
  var bulkItemsRequestURL = ENV.apiUrl + '/rsvr/api/dispatch/store-instance/:id/bulkitems';
  var calculatedInboundsRequestURL = ENV.apiUrl + '/rsvr/api/store-instances/:id/calculated-inbounds';

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
    createStoreInstanceItems: {
      method: 'POST'
    },
    updateStoreInstanceItems: {
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
    getStoreInstanceUpliftList: {
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
    },
    getStoreInstanceCalculatedInbounds: {
      method: 'GET'
    }
  };

  var requestResource = $resource(requestURL, requestParameters, actions);
  var bulkItemsRequestResource = $resource(bulkItemsRequestURL, requestParameters, actions);
  var calculatedInboundsRequestResources = $resource(calculatedInboundsRequestURL, requestParameters, actions);

  function getStoreInstancesList(payload, companyId) {
    if (companyId) {
      actions.getStoreInstancesList.headers = { companyId: companyId };
    }

    return requestResource.getStoreInstancesList(payload).$promise;
  }

  function getStoreInstance(id, companyId) {
    if (companyId) {
      actions.getStoreInstance.headers = { companyId: companyId };
    }

    return requestResource.getStoreInstance({
      id: id
    }).$promise;
  }

  function createStoreInstance(payload) {
    return requestResource.createStoreInstance(payload).$promise;
  }

  function updateStoreInstance(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id
    }, payload);
    return requestResource.updateStoreInstance(requestPayload).$promise;
  }

  function deleteStoreInstance(id) {
    return requestResource.deleteStoreInstance({
      id: id
    }).$promise;
  }

  function getStoreInstanceItemList(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items'
    }, payload);
    return requestResource.getStoreInstanceItemList(requestPayload).$promise;
  }

  function getStoreInstanceItem(id, itemId) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items',
      itemIdOrBulk: itemId
    });
    return requestResource.getStoreInstanceItem(requestPayload).$promise;
  }

  function updateStoreInstanceItem(id, itemId, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items',
      itemIdOrBulk: itemId
    });
    return requestResource.updateStoreInstanceItem(requestPayload, payload).$promise;
  }

  function updateStoreInstanceItemsBulk(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items',
      itemIdOrBulk: 'bulk'
    });
    return requestResource.updateStoreInstanceItemsBulk(requestPayload, payload).$promise;
  }

  function createStoreInstanceItems(id, items) {
    var requestPayload = angular.extend({}, {
      id: id
    });
    var payload = {
      bulkItems: items
    };

    return bulkItemsRequestResource.createStoreInstanceItems(requestPayload, payload).$promise;
  }

  function updateStoreInstanceItems(id, items) {
    var requestPayload = angular.extend({}, {
      id: id
    });
    var payload = {
      bulkItems: items
    };

    return bulkItemsRequestResource.updateStoreInstanceItems(requestPayload, payload).$promise;
  }

  function createStoreInstanceItem(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
      api: 'items'
    });
    return requestResource.createStoreInstanceItem(requestPayload, payload).$promise;
  }

  function deleteStoreInstanceItem(id, itemId, payload) {
    var requestPayload = angular.extend({}, {
      id: id,
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

  function updateStoreInstanceStatus(id, statusId, inboundId, isManual, endInstance, packingListSortOrderType) {
    var requestPayload = angular.extend({}, {
      id: id,
      inboundStationId: inboundId,
      api: 'status',
      itemIdOrBulk: statusId,
      isManual: isManual,
      endInstance: endInstance,
      packingListSortOrderType: packingListSortOrderType
    });
    return requestResource.updateStoreInstanceStatus(requestPayload).$promise;
  }

  function updateStoreInstanceStatusUndispatch(id, statusId, undispatch) {
    var requestPayload = angular.extend({}, {
      id: id,
      inboundStationId: undefined,
      api: 'status',
      itemIdOrBulk: statusId,
      isManual: undefined,
      undispatch:undispatch
    });
    return requestResource.updateStoreInstanceStatus(requestPayload).$promise;
  }

  function updateStoreInstanceStatusForceReconcile(id, statusId, inboundId, isManual, forceReconcile) {
    var requestPayload = angular.extend({}, {
      id: id,
      inboundStationId: inboundId,
      api: 'status',
      itemIdOrBulk: statusId,
      isManual: isManual,
      forceReconcile: forceReconcile
    });
    return requestResource.updateStoreInstanceStatus(requestPayload).$promise;
  }

  function updateStoreInstanceStatusUnreceive(id, statusId) {
    var requestPayload = angular.extend({}, {
      id: id,
      inboundStationId: undefined,
      api: 'status',
      itemIdOrBulk: statusId,
      isManual: undefined,
      endInstance: undefined,
      unReceive: true
    });
    return requestResource.updateStoreInstanceStatus(requestPayload).$promise;
  }

  function getStoreInstanceCalculatedInbounds(id, payload) {
    var requestPayload = angular.extend({}, {
      id: id
    }, payload);
    return calculatedInboundsRequestResources.getStoreInstanceCalculatedInbounds(requestPayload).$promise;
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
    deleteStoreInstanceItem: deleteStoreInstanceItem,
    getStoreInstanceCalculatedInbounds: getStoreInstanceCalculatedInbounds,
    updateStoreInstanceStatusForceReconcile: updateStoreInstanceStatusForceReconcile,
    updateStoreInstanceStatusUndispatch: updateStoreInstanceStatusUndispatch,
    createStoreInstanceItems: createStoreInstanceItems,
    updateStoreInstanceItems: updateStoreInstanceItems,
    updateStoreInstanceStatusUnreceive: updateStoreInstanceStatusUnreceive
  };
});
