'use strict';

/**
 * @ngdoc service
 * @name ts5App.preOrdersFactory
 * @description
 * # preOrdersFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('preOrdersFactory', function (preOrdersService) {
    function getPreOrderList(searchParams) {
      return preOrdersService.getPreOrderList(searchParams);
    }

    function getPreOrderById(id) {
      return preOrdersService.getPreOrderById(id);
    }

    return {
      getPreOrderList: getPreOrderList,
      getPreOrderById: getPreOrderById
    };
  });
