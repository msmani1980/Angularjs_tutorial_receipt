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

    function checkMenuItemMatchesFeaturePermission(featurePermission, menuItemPermission) {
      return featurePermission.resource.apiName === menuItemPermission.apiName &&
        lodash.intersection(featurePermission.permissionCode, menuItemPermission.permissionCodes).length === menuItemPermission.permissionCodes.length;
    }
    function checkMenuItemHasFeaturePermissions(permissions, featurePermission) {
      return lodash.find(permissions, function(menuItemPermission) {
        return checkMenuItemMatchesFeaturePermission(featurePermission, menuItemPermission);
      });
    }

    function findPackageWithMatchingMatchingMenuItem(menuItem, featurePermissions) {
      return lodash.find(featurePermissions, function (featurePermission) {
        return checkMenuItemHasFeaturePermissions(menuItem.permissions, featurePermission);
      });
    }

    function hasMenuItemMatchingPackageWithPermissions(menuItem, featurePermissions) {
      if (menuItem.permissions) {
        return findPackageWithMatchingMatchingMenuItem(menuItem, featurePermissions);
      }
      return true;
    }

    function hasResponseMatchingMenuItemWithPermissions(menuItem, response) {
      if (response[menuItem.package] && response[menuItem.package][menuItem.role]) {
        return hasMenuItemMatchingPackageWithPermissions(menuItem, response[menuItem.package][menuItem.role]);
      }
      return false;

    }

    function menuItemsWithFeaturePermissions(menuItems, response) {
      return lodash.filter(menuItems, function(menuItem) {
        return hasResponseMatchingMenuItemWithPermissions(menuItem, response);
      });
    }

    function menuWithFeaturePermissions(menu, response) {
      return lodash.filter(menu, function(item) {
        item.menuItems = menuItemsWithFeaturePermissions(item.menuItems, response);
        return item.menuItems.length !== 0;
      });
    }

    function updateNavigationPerUserFeatures() {
      identityAccessService.featuresInRole().then(function(response) {
        $scope.dashboardMenu = menuWithFeaturePermissions(mainMenuService.getMenu(), response);
      });
    }

    updateNavigationPerUserFeatures();

  });
