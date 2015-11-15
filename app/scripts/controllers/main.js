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
        $scope.dashboardMenu = lodash.filter(mainMenuService.getMenu(), function(item) {
          item.menuItems = lodash.filter(item.menuItems, function(menuItem) {
            if (response[menuItem.package] && response[menuItem.package][menuItem.role]) {
              if (menuItem.permissions) {
                return lodash.find(response[menuItem.package][menuItem.role], function (featurePermission) {
                  return lodash.find(menuItem.permissions, function (menuItemPermission) {
                    return featurePermission.resource.apiName === menuItemPermission.apiName &&
                    lodash.intersection(featurePermission.permissionCode, menuItemPermission.permissionCodes).length === menuItemPermission.permissionCodes.length;
                  });
                });
              }
              return true;
            }
            return false;
          });
          return item.menuItems.length !== 0;
        });
      });
    }

    updateNavigationPerUserFeatures();

    $scope.hasUserFeature = function(features) {
      return lodash.intersection(features, $scope.features).length !== 0;
    };

  });
