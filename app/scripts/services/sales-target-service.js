'use strict';

/**
 * @ngdoc service
 * @name ts5App.salesTargetService
 * @description
 * # salesTargetService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('salesTargetService', function (ENV, $resource, globalMenuService) {
    var requestURL = ENV.apiUrl + '/rsvr/api/sales/target/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getSalesTargetList: {
        method: 'GET'
      },
      getSalesTargetById: {
        method: 'GET'
      },
      createSalesTarget: {
        method: 'POST'
      },
      updateSalesTarget: {
        method: 'PUT'
      },
      deleteSalesTarget: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getSalesTargetList = function (payload) {
      return requestResource.getSalesTargetList(payload).$promise;
    };

    var getSalesTargetById = function (id) {
      return requestResource.getSalesTargetById({ id: id }).$promise;
    };

    var createSalesTarget = function (payload) {
      payload.companyId = globalMenuService.company.get();

      return requestResource.createSalesTarget(payload).$promise;
    };

    var updateSalesTarget = function (payload) {
      payload.companyId = globalMenuService.company.get();

      return requestResource.updateSalesTarget(payload).$promise;
    };

    var deleteSalesTarget = function (id) {
      return requestResource.deleteSalesTarget({ id: id }).$promise;
    };

    return {
      getSalesTargetList: getSalesTargetList,
      getSalesTargetById: getSalesTargetById,
      createSalesTarget: createSalesTarget,
      updateSalesTarget: updateSalesTarget,
      deleteSalesTarget: deleteSalesTarget
    };
  });
