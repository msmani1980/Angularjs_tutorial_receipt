'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeMessagesFactory', function (employeeMessagesService, schedulesService, employeesService, stationsService) {

    var getEmployeeMessages = function (payload) {
      return employeeMessagesService.getEmployeeMessages(payload);
    };

    var getEmployeeMessage = function (id) {
      return employeeMessagesService.getEmployeeMessage(id);

    };

    var getSchedules = function (companyId) {
      return schedulesService.getSchedules(companyId);
    };

    var getEmployees = function (companyId) {
      return employeesService.getEmployees(companyId)
    };

    var getStations = function () {
      return stationsService.getGlobalStationList({});
    };

    return {
      getEmployeeMessages: getEmployeeMessages,
      getEmployeeMessage: getEmployeeMessage,
      getSchedules: getSchedules,
      getEmployees: getEmployees,
      getStations: getStations
    };
  });
