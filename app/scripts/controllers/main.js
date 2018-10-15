/*jshint maxcomplexity:6 */
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
  function ($localStorage, $rootScope, $scope, $filter, mainMenuService, mainMenuOrderService, globalMenuService, identityAccessService,
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
    	console.log ('menu', menu);
    	console.log ('response', response);
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

      var menu = [];
      var companyData = globalMenuService.getCompanyData();
      if (!companyData.isMenuSorted || companyData.companyTypeId !== 1) {
        filterMenuWithIAM(mainMenuService.getMenu());
        return;
      }
        
      mainMenuOrderService.getMenuOrderList().then(function (response) {
        if (angular.isDefined(response) && response.length > 0) {
          var responseSorted  = $filter('orderBy')(response, 'menuSortOrder');
          for (var i = 0; i < responseSorted.length; i++) {
            var module = angular.copy(responseSorted[i]);
            var menuModule = { 
              title: module.menuName,
              menuItems:[]
            };
            var menuItemsSorted = $filter('orderBy')(module.menuItems, 'menuItemSortOrder');
            for (var j = 0; j < menuItemsSorted.length; j++) {
              var item = angular.copy(menuItemsSorted[j]);
              var menuItem = {
                name: item.menuItemName,
                route:item.menuItemRoute,
                icon:item.menuIcon,
                className:item.menuItemClassName,
                package:item.menuItemPackage,
                role:item.menuItemRole,
                permissions: [{
                  apiName: (angular.isDefined(item.menuItemPermissionApiName) ? item.menuItemPermissionApiName : null),
                  permissionCodes:[item.menuItemPermissionCode]
                }]
              };

              var filledItem = angular.copy(menuItem);
              menuModule.menuItems.push(filledItem);
            }

            menu.push(menuModule);    
          }

        }

        filterMenuWithIAM(menu);
      });
    }

    function filterMenuWithIAM (menu) {
      identityAccessService.featuresInRole().then(function (response) {
        $localStorage.featuresInRole = angular.copy(response);
        if (!angular.isDefined($localStorage.buttons)) {
          $localStorage.buttons = [];
        }

        addButton('UNRSI', 'unreceive');
        $scope.dashboardMenu = menuWithFeaturePermissions(menu, response);
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
