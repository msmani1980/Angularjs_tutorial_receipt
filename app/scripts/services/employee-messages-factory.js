'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeMessagesFactory', function (employeeMessagesService) {

    var getEmployeeMessages = function (payload) {
      return employeeMessagesService.getEmployeeMessages(payload);
    };

    return {
      getEmployeeMessages: getEmployeeMessages
    };
  });
