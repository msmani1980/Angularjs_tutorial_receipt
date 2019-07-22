'use strict';

/**
 * @ngdoc service
 * @name ts5App.preOrdersService
 * @description
 * # preOrdersService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('preOrdersService', function (ENV, $resource, globalMenuService) {
    var requestURL = ENV.apiUrl + '/rsvr/api/preorders/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPreOrderList: {
        method: 'GET'
      },
      getPreOrderById: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getPreOrderList = function (payload) {
      return requestResource.getPreOrderList(payload).$promise;
    };

    var getPreOrderById = function (id) {
      return requestResource.getPreOrderById({ id: id }).$promise;
    };

    return {
      getPreOrderList: getPreOrderList,
      getPreOrderById: getPreOrderById
    };
  });
