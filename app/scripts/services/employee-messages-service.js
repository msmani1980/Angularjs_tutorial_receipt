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
    var requestParameters = {
      id: '@id'
    };
    var employeeActions = {
      getEmployeeMessages: {
        method: 'GET'
      },
      createEmployeeMessage: {
        method: 'POST'
      },
      editEmployeeMessage: {
        method: 'PUT'
      }
    };
    var employeeMessagesRequestResource = $resource(employeeMessagesRequestURL, requestParameters, employeeActions);

    var getEmployeeMessages = function (payload) {
      requestParameters.id = '';
      requestParameters = payload || requestParameters;
      return employeeMessagesRequestResource.getEmployeeMessages().$promise;
    };

    var getEmployeeMessage = function (id) {
      requestParameters.id = id;
      return employeeMessagesRequestResource.getEmployeeMessages().$promise;
    };

    var createEmployeeMessage = function (payload) {
      requestParameters.id = '';
      return employeeMessagesRequestResource.createEmployeeMessage(payload).$promise;
    };

    var editEmployeeMessage = function (id, payload) {
      requestParameters.id = id;
      return employeeMessagesRequestResource.editEmployeeMessage(payload).$promise;
    };

    return {
      getEmployeeMessages: getEmployeeMessages,
      getEmployeeMessage: getEmployeeMessage,
      createEmployeeMessage: createEmployeeMessage,
      editEmployeeMessage: editEmployeeMessage
    };

  });
