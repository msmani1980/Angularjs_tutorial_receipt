'use strict';

/**
 * @ngdoc service
 * @name ts5App.salesTargetFactory
 * @description
 * # salesTargetFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('salesTargetFactory', function (salesTargetService) {
    function getSalesTargetList(searchParams) {
      return salesTargetService.getSalesTargetList(searchParams);
    }

    function getSalesTargetById(id) {
      return salesTargetService.getSalesTargetById(id);
    }

    function createSalesTarget(payload) {
      return salesTargetService.createSalesTarget(payload);
    }

    function updateSalesTarget(payload) {
      return salesTargetService.updateSalesTarget(payload);
    }

    function deleteSalesTarget(id) {
      return salesTargetService.deleteSalesTarget(id);
    }

    return {
      getSalesTargetList: getSalesTargetList,
      getSalesTargetById: getSalesTargetById,
      createSalesTarget: createSalesTarget,
      updateSalesTarget: updateSalesTarget,
      deleteSalesTarget: deleteSalesTarget
    };
  });
