'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeesService
 * @description
 * # employeesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('employeesService', function ($resource, ENV, Upload) {

    var employeeRequestURL = ENV.apiUrl + '/rsvr/api/companies/:id/employees/:empId';

    var employeeActions = {
      getEmployees: {
        method: 'GET'
      },
      getEmployeeById: {
        method: 'GET',
        headers: {}
      },
      createEmployee: {
        method: 'POST',
        headers: {}
      },
      updateEmployee: {
        method: 'PUT',
        headers: {}
      },
      deleteEmployee: {
        method: 'DELETE',
        headers: {}
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
    
    var getEmployeeById = function (companyId, employeeId) {
      var requestParameters = {
          id: companyId
        };

      return empoyeeRequestResource.getEmployeeById(requestParameters, employeeId).$promise;
    };
    
    var createEmployee = function (companyId, payload) {
      var requestParameters = {
        id: companyId
      };

      return empoyeeRequestResource.createEmployee(requestParameters, payload).$promise;
    };
    
    var updateEmployee = function (companyId, employeeId, payload) {
      var requestParameters = {
          id: companyId,
          empId: employeeId
        };

      return empoyeeRequestResource.updateEmployee(requestParameters, payload).$promise;
    };
      
    var deleteEmployee = function (companyId, employeeId) {
      var payload = {
          id: companyId,
          empId: employeeId
        };
        
      return empoyeeRequestResource.deleteEmployee(payload).$promise;
    };
      
    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/employee';
      return Upload.upload({
          url: uploadRequestURL,
          file: file
        });
    };
      
    return {
      importFromExcel: importFromExcel,
      getEmployees: getEmployees,
      getEmployeeById: getEmployeeById,
      createEmployee: createEmployee,
      updateEmployee: updateEmployee,
      deleteEmployee: deleteEmployee
    };

  });
