'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MainCtrl',
  function ($localStorage, $rootScope, $scope, mainMenuService, globalMenuService, identityAccessService,
            identityAccessFactory, lodash, $q, menuService) {

    $scope.viewName = 'TS5 Dashboard';

    function checkMenuItemMatchesFeaturePermission(featurePermission, menuItemPermission) {
      if (!featurePermission.resource) {
        return false;
      }

      return lodash.intersection(featurePermission.permissionCode, menuItemPermission.permissionCodes).length ===
        menuItemPermission.permissionCodes.length;
    }

    function checkMenuItemHasFeaturePermissions(permissions, featurePermission) {
      return lodash.find(permissions, function (menuItemPermission) {
        return checkMenuItemMatchesFeaturePermission(featurePermission, menuItemPermission);
      });
    }

    function findPackageWithMatchingMatchingMenuItem(menuItem, featurePermissions) {
      return lodash.find(featurePermissions, function (featurePermission) {
        return checkMenuItemHasFeaturePermissions(menuItem.permissions, featurePermission);
      });
    }

    function hasMenuItemMatchingPackageWithPermissions(menuItem, featurePermissions) {
      var isManageCashBagAndShouldHide = ((menuItem.name === 'Manage Cash Bag' && menuItem.package !== 'RECONCILIATION') && $rootScope.cashbagRestrictUse && !$rootScope.showManageCashBag);
      var isCashBagSubmissionAndShouldHide = (menuItem.name === 'Cash Bag Submission' && $rootScope.cashbagRestrictUse && !$rootScope.showCashBagSubmission);

      if (isManageCashBagAndShouldHide || isCashBagSubmissionAndShouldHide) {
        return false;
      }

      if (menuItem.permissions) {
        return findPackageWithMatchingMatchingMenuItem(menuItem, featurePermissions);
      }

      return true;
    }

    function hasResponseMatchingMenuItemWithPermissions(menuItem, response) {
      if (menuItem.package === 'EPOSCONFIG') {
        return true;
      }

      if (response[menuItem.package] && response[menuItem.package][menuItem.role]) {
        return hasMenuItemMatchingPackageWithPermissions(menuItem, response[menuItem.package][menuItem.role]);
      }

      return false;
    }

    function menuItemsWithFeaturePermissions(menuItems, response) {
      return lodash.filter(menuItems, function (menuItem) {
        return hasResponseMatchingMenuItemWithPermissions(menuItem, response);
      });
    }

    function menuWithFeaturePermissions(menu, response) {
      return lodash.filter(menu, function (item) {
        item.menuItems = menuItemsWithFeaturePermissions(item.menuItems, response);
        return item.menuItems.length !== 0;
      });
    }

    function assignMenuToCompanyType() {
      var companyTypeId = globalMenuService.getCompanyData().companyTypeId;
      var companyTypes = identityAccessFactory.getSessionObject().companyTypes;
      var companyTypeName = angular.copy(lodash.findWhere(companyTypes, {
        id: companyTypeId
      }).name);
      $scope.realDashboardMenu = companyTypeName;

      //$scope.realDashboardMenu = mainMenuService[companyTypeName]();
    }

    function getDashboardDependencies() {
      identityAccessService.featuresInRole().then(function (response) {
        $localStorage.featuresInRole = angular.copy(response);
        if (!angular.isDefined($localStorage.buttons)) {
          $localStorage.buttons = [];
        }

        addButton('UNRSI', 'unreceive');
        $scope.dashboardMenu = menuWithFeaturePermissions(mainMenuService.getMenu(), response);
      });

      assignMenuToCompanyType();
    }

    function addButton (taskCode, buttonCode) {
      if ($localStorage.featuresInRole.STATIONOPERATIONS && $localStorage.featuresInRole.STATIONOPERATIONS.STOREINSTANCEDASHBOARD) {
        var siDashboard =  $localStorage.featuresInRole.STATIONOPERATIONS.STOREINSTANCEDASHBOARD;
        for (var i = 0; i < siDashboard.length; i++) {
          if (siDashboard[i].taskCode === taskCode) {
            if ($localStorage.buttons.indexOf(buttonCode) === -1) {
              $localStorage.buttons.push(buttonCode);
            }
          }
        }
      }
    }

    function updateNavigationPerUserFeatures() {
      var promises = [
        menuService.isMenuCashbagRestrictUse(),
        menuService.isShowManageCashBag(),
        menuService.isShowCashBagSubmission()
      ];
      $q.all(promises).then($q.all(promises).then(getDashboardDependencies));
    }

    $scope.$on('company-fetched', updateNavigationPerUserFeatures);
    updateNavigationPerUserFeatures();

  });
