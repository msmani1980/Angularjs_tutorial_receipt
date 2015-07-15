'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionService
 * @description
 * # employeeCommissionService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('employeeCommissionService', function ($resource, ENV, $http, dateUtility) {
    var requestURL = ENV.apiUrl + '/api/employee-commissions/:commissionId';
    var requestParameters = {
      commissionId: '@id',
      limit: 50
    };

    // TODO: will implement dates serializer at a later point
    function formatDatesForAPI(dataFromAPI) {
      dataFromAPI.employeeCommissions.forEach(function (companyRelationship) {
        if (companyRelationship.startDate) {
          companyRelationship.startDate = dateUtility.formatDateForApp(companyRelationship.startDate);
        }

        if (companyRelationship.endDate) {
          companyRelationship.endDate = dateUtility.formatDateForApp(companyRelationship.endDate);
        }
      });
      return dataFromAPI;
    }

    function transformRequest(requestData) {
      requestData.startDate = dateUtility.formatDateForAPI(requestData.startDate);
      requestData.endDate = dateUtility.formatDateForAPI(requestData.endDate);
      return requestData;
    }

    var appendTransform = function appendTransform(transform) {
      return $http.defaults.transformResponse.concat(transform);
    };

    var actions = {
      getCommissionList: {
        method: 'GET'//,
        //transformResponse: appendTransform(formatDatesForAPI)
      },
      getCommission: {
        method: 'GET'
      },
      createCommission: {
        method: 'POST'
      },
      updateCommission: {
        method: 'PUT'
      },
      deleteCommission: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCommissionList = function (payload) {
      return requestResource.getCommissionList(payload).$promise;
    };

    var getCommission = function (commissionId) {
      var payload = {
        commissionId: commissionId
      };
      return requestResource.getCommission(payload).$promise;
    };

    var createCommission = function (payload) {
      return requestResource.createCommission(payload).$promise;
    };

    var updateCommission = function (payload) {
      return requestResource.updateCommission(payload).$promise;
    };

    var deleteCommission = function (commissionId) {
      var payload = {
        commissionId: commissionId
      };
      return requestResource.deleteCommission(payload).$promise;
    };

    return {
      getCommissionList: getCommissionList,
      getCommission: getCommission,
      createCommission: createCommission,
      updateCommission: updateCommission,
      deleteCommission: deleteCommission
    };
  });
