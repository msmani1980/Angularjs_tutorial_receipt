'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeCommissionFactory', function (itemsService) {

    var getItemsList = function (payload) {
      return itemsService.getItemsList(payload);
    };

    return {
      getItemsList: getItemsList
    };
  });
