'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDashboardActionsConfig
 * @description
 * # storeInstanceDashboardActionsConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceDashboardActionsConfig', function () {

    var createURL = 'store-instance-create/';
    var packingURL = 'store-instance-packing/';
    var sealsURL = 'store-instance-seals/';
    var inboundSealsURL = 'store-instance-inbound-seals/';
    var reviewURL = 'store-instance-review/';
    var dashboardURL = 'store-instance-dashboard';

    function setActions() {
      var actionToURLMap = {
        'Dashboard': dashboardURL,
        'Pack': packingURL + 'dispatch/',
        'Pack-Redispatch': packingURL + 'redispatch/',
        'Pack-Replenish': packingURL + 'replenish/',
        'Seal': sealsURL + 'dispatch/',
        'Seal-Redispatch': sealsURL + 'redispatch/',
        'Seal-Replenish': sealsURL + 'replenish/',
        'Dispatch': reviewURL + 'dispatch/',
        'Dispatch-Redispatch': reviewURL + 'redispatch/',
        'Dispatch-Replenish': reviewURL + 'replenish/',
        'Replenish': createURL + 'replenish/',
        'Redispatch': createURL + 'redispatch/',
        'End Instance': createURL + 'end-instance/',
        'Inbound Seals': inboundSealsURL + 'end-instance/',
        'Inbound Seals-Redispatch': inboundSealsURL + 'redispatch/',
        'Offload': packingURL + 'end-instance/',
        'Offload-Redispatch-Pack': packingURL + 'redispatch/',
        'Offload-Redispatch-Seal': sealsURL + 'redispatch/',
        'Offload-Redispatch-Dispatch': reviewURL + 'redispatch/'
      };
      return actionToURLMap;
    }

    function getURL(actionName, id) {
      var actionToURLMap = setActions();
      if(!actionName) {
        return actionToURLMap.Dashboard;
      }
      return actionToURLMap[actionName] + id;
    }

    return {
      getURL: getURL
    };
  });
