'use strict';

/**
 * @ngdoc service
 * @name ts5App.carrierService
 * @description
 * # carrierService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('employeesService', function ($resource, ENV) {

    var employeeRequestURL = ENV.apiUrl + '/rsvr/api/companies/:id/employees/:empId';

    var employeeActions = {
      getEmployees: {
        method: 'GET'
      }
    };
    var empoyeeRequestResource = $resource(employeeRequestURL, null, employeeActions);

    var getEmployees = function (companyId, additionalPayload) {
      var payload = { id:companyId };

      if (additionalPayload) {
        angular.extend(payload, additionalPayload);
      }

      return empoyeeRequestResource.getEmployees(payload).$promise;
    };

    return {
      getEmployees: getEmployees
    };

  });
