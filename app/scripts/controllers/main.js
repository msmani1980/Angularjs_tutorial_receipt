'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl', function ($rootScope, $scope, companiesFactory, GlobalMenuService, mainMenuService) {

    $scope.viewName = 'TS5 Dashboard';
    function updateNavigationPerCompanyType() {
      var companyTypeId = GlobalMenuService.getCompanyData().companyTypeId;
      $scope.dashboardMenu = mainMenuService.getMenu(companyTypeId);
    }

    updateNavigationPerCompanyType();

  });
