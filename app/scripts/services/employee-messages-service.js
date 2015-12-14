'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeMessagesService
 * @description
 * # employeeMessagesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('employeeMessagesService', function ($resource, ENV) {

    var employeeMessagesRequestURL = ENV.apiUrl + '/api/employee-messages/:id';

    var employeeActions = {
      getEmployeeMessages: {
        method: 'GET'
      }
    };
    var employeeMessagesRequestResource = $resource(employeeMessagesRequestURL, null, employeeActions);

    var getEmployeeMessages = function (payload) {
      var requestPayload = payload || {};
      return employeeMessagesRequestResource.getEmployeeMessages(requestPayload).$promise;
    };

    var getEmployeeMessage = function (id) {
      var requestPayload = {id: id};
      return employeeMessagesRequestResource.getEmployeeMessages(requestPayload).$promise;
    };

    return {
      getEmployeeMessages: getEmployeeMessages,
      getEmployeeMessage: getEmployeeMessage
    };

  });
