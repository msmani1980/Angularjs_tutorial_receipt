'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeFactory
 * @description
 * # employeeFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
    .factory('employeeFactory',  function (globalMenuService, employeesService) {

      var getCompanyId = function () {
        return globalMenuService.company.get();
      };

      var getEmployees = function (payload) {
        return employeesService.getEmployees(getCompanyId(), payload);
      };

      var getEmployee = function(employeeId) {
        return employeesService.getEmployeeById(getCompanyId(), employeeId);
      };

      var createEmployee = function (payload) {
        return employeesService.createEmployee(getCompanyId(), payload);
      };

      var updateEmployee = function (payload) {
        return employeesService.updateEmployee(getCompanyId(), payload.id, payload);
      };

      var deleteEmployee = function (companyId, employeeId) {
        return employeesService.deleteEmployee(companyId, employeeId);
      };

      return {
        getEmployees: getEmployees,
        getEmployee: getEmployee,
        createEmployee: createEmployee,
        updateEmployee: updateEmployee,
        deleteEmployee: deleteEmployee,
        getCompanyId: getCompanyId
      };
    });
