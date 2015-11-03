'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl', function ($scope, companiesFactory, GlobalMenuService, mainMenuService) {
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'TS5 Dashboard';

    function updateNavigationPerCompanyType() {
      companiesFactory.getCompany(companyId).then(function (response) {
        $scope.dashboardMenu = mainMenuService.getMenu(response.companyTypeId);
      });
    }

    updateNavigationPerCompanyType();

  });
