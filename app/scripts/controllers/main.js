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
    function updateNavigationPerUserFeatures() {
      identityAccessService.featuresInRole().then(function(response) {
        var features = lodash.flatten(
          lodash.map(lodash.values(response), function(pkg) {
            return lodash.keys(pkg);
          })
        );
        $scope.dashboardMenu = lodash.filter(mainMenuService.getMenu(), function(item) {
          if (lodash.intersection(features, item.roles).length !== 0) {
            item.menuItems = lodash.filter(item.menuItems, function(menuItem) {
              return lodash.includes(features, menuItem.role);
            });
            return true;
          } else {
            return false;
          }
        });
      });
    }

    updateNavigationPerUserFeatures();

    $scope.hasUserFeature = function(features) {
      return lodash.intersection(features, $scope.features).length !== 0;
    };

  });
