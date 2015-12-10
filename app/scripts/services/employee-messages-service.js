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

    var employeeMessagesRequestURL = ENV.apiUrl + '/api/employee-messages/';

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

    return {
      getEmployeeMessages: getEmployeeMessages
    };

  });
