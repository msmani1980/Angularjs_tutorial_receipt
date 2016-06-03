'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionService
 * @description
 * # employeeCommissionService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('employeeCommissionService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/employee-commissions/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getCommissionList: {
        method: 'GET'
      },
      getCommission: {
        method: 'GET'
      },
      createCommission: {
        method: 'POST'
      },
      updateCommission: {
        method: 'PUT',
        params: {
          id: '@employeeCommission.id'
        }
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
        id: commissionId
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
        id: commissionId
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
