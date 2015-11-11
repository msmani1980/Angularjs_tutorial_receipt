'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl', function ($rootScope, $scope, companiesFactory, mainMenuService, identityAccessService, lodash) {

    $scope.viewName = 'TS5 Dashboard';
    $scope.features = [];
    function updateNavigationPerCompanyType() {
      $scope.dashboardMenu = mainMenuService.getMenu();
      identityAccessService.featuresInRole().then(function(response) {
        $scope.features = lodash.flatten(
          lodash.map(lodash.values(response), function(pkg) {
            return lodash.keys(pkg);
          })
        );
      });
    }

    updateNavigationPerCompanyType();

    $scope.hasUserFeature = function(features) {
      return lodash.intersection(features, $scope.features).length !== 0;
    };

  });
