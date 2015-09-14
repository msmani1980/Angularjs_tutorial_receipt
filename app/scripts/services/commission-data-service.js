'use strict';

/**
 * @ngdoc service
 * @name ts5App.commissionDataService
 * @description
 * # commissionDataService
 * Service in the ts5App.
 */

angular.module('ts5App')
  .service('commissionDataService', function ($resource, $http, ENV) {

    var requestURL = ENV.apiUrl + '/api/employee-commissions-payable/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getCommissionDataList: {
        method: 'GET'
      },
      getCommissionData: {
        method: 'GET'
      },
      updateCommissionData: {
        method: 'PUT'
      },
      deleteCommissionData: {
        method: 'DELETE'
      },
      createCommissionData: {
        method: 'POST'
      }
    };
    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCommissionPayableList(optionalPayload) {
      var payload = {};
      if (arguments.length === 1) {
        payload = optionalPayload;
      }
      requestParameters.id = '';
      return requestResource.getCommissionDataList(payload).$promise;
    }

    function getCommissionPayableData(id) {
      requestParameters.id = id;
      return requestResource.getCommissionData({}).$promise;
    }

    function updateCommissionData(id, payload) {
      requestParameters.id = id;
      return requestResource.updateCommissionData(payload).$promise;
    }

    function deleteCommissionData(id) {
      requestParameters.id = id;
      return requestResource.deleteCommissionData().$promise;
    }

    function createCommissionData(payload) {
      requestParameters.id = '';
      return requestResource.createCommissionData(payload).$promise;
    }


    return {
      getCommissionPayableList: getCommissionPayableList,
      getCommissionPayableData: getCommissionPayableData,
      createCommissionData: createCommissionData,
      updateCommissionData: updateCommissionData,
      deleteCommissionData: deleteCommissionData
    };
  });
