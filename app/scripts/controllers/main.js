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
    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'TS5 Dashboard';

    // changes the navigation depeneding on what company type you have
    function updateNavigationPerCompanyType() {
      companiesFactory.getCompany(companyId).then(function (response) {
        $scope.dashboardMenu = mainMenuService.getMenu(response.companyTypeId);
      });
    }

    updateNavigationPerCompanyType();

  });
