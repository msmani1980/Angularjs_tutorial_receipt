'use strict';

/**
 * @ngdoc service
 * @name ts5App.exciseDutyService
 * @description
 * # exciseDutyService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('exciseDutyService', function ($resource, ENV) {

    var exciseDutyRequestURL = ENV.apiUrl + '/api/excise-duty/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getExciseDuty: {
        method: 'GET'
      },
      createExciseDuty: {
        method: 'POST'
      },
      updateExciseDuty: {
        method: 'PUT'
      },
      deleteExciseDuty: {
        method: 'DELETE'
      }
    };
    var exciseDutyRequestResources = $resource(exciseDutyRequestURL, requestParameters, actions);

    var getExciseDutyList = function (payload) {
      requestParameters.id = '';
      var requestPayload = payload || {};
      return exciseDutyRequestResources.getExciseDuty(requestPayload).$promise;
    };

    var getExciseDuty = function (id) {
      requestParameters.id = id;
      return exciseDutyRequestResources.getExciseDuty().$promise;
    };

    var createExciseDuty = function (payload) {
      requestParameters.id = '';
      return exciseDutyRequestResources.createExciseDuty(payload).$promise;
    };

    var updateExciseDuty = function (id, payload) {
      requestParameters.id = id;
      return exciseDutyRequestResources.updateExciseDuty(payload).$promise;
    };

    var deleteExciseDuty = function (id) {
      requestParameters.id = id;
      return exciseDutyRequestResources.deleteExciseDuty().$promise;
    };

    return {
      getExciseDutyList: getExciseDutyList,
      getExciseDuty: getExciseDuty,
      createExciseDuty: createExciseDuty,
      updateExciseDuty: updateExciseDuty,
      deleteExciseDuty: deleteExciseDuty
    };

  });
