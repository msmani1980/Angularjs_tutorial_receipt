'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeFactory
 * @description
 * # employeeFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
    .factory('employeeFactory',  function (globalMenuService, employeesService, stationsService, countriesService) {

      var getCompanyId = function () {
        return globalMenuService.company.get();
      };

      var getEmployees = function (payload) {
        return employeesService.getEmployees(getCompanyId(), payload);
      };

      var getEmployee = function(employeeId) {
        return employeesService.getEmployeeById(getCompanyId(), employeeId);
      };
      
      var getEmployeeTitles = function() {
        return employeesService.getEmployeeTitles(getCompanyId());
      };

      var createEmployee = function (payload) {
        return employeesService.createEmployee(getCompanyId(), payload);
      };

      var updateEmployee = function (payload) {
        return employeesService.updateEmployee(getCompanyId(), payload.id, payload);
      };

      var deleteEmployee = function (employeeId) {
        return employeesService.deleteEmployee(getCompanyId(), employeeId);
      };
      
      var getCompanyGlobalStationList = function (payload) {
        return stationsService.getGlobalStationList(payload);
      };

      var getCountriesList = function() {
        return countriesService.getCountriesList();
      };
        
      return {
        getEmployees: getEmployees,
        getEmployee: getEmployee,
        createEmployee: createEmployee,
        updateEmployee: updateEmployee,
        deleteEmployee: deleteEmployee,
        getCompanyId: getCompanyId,
        getEmployeeTitles: getEmployeeTitles,
        getCompanyGlobalStationList: getCompanyGlobalStationList,
        getCountriesList: getCountriesList,
      };
    });
