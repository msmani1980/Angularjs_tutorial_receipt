'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

    var dynamicLeftNavController = function ($q, $rootScope, $scope, $location, $window, $filter, mainMenuService, globalMenuService, $localStorage, 
                                             identityAccessFactory, lodash, menuService) {

      function deleteMenuCashBag(menuName) {
        var indexToDelete = -1;
        var itemsLength = $scope.menuItems.length;

        for (var i = 0; i < itemsLength; i++) {
          if ($scope.menuItems[i].name === menuName) {
            indexToDelete = i;
            break;
          }
        }

        if (indexToDelete !== -1) {
          $scope.menuItems.splice(indexToDelete, 1);
        }
      }
      
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
        return lodash.filter(menu, function (item) {
          item.menuItems = menuItemsWithFeaturePermissions(item.menuItems, response);
          return item.menuItems.length !== 0;
        });
      }
      
      function promiseResponseHandler() {
        var companyTypeId = globalMenuService.getCompanyData().companyTypeId;
        var companyTypes = identityAccessFactory.getSessionObject().companyTypes;
        var companyTypeName = angular.copy(lodash.findWhere(companyTypes, { id: companyTypeId }).companyTypeName);

        var menu = mainMenuService.getMenu();
        var menuItems = [];

        if ($scope.title) {
          menuItems = $filter('filter')(menu, {
            title: $scope.title
          }, true);
        } else {
          menuItems = $filter('filter')(menu, {
            menuItems: {
              route: $location.path()
            }
          });
        }

        if (companyTypeName && menuItems.length) {
          var menuItemsPermitted = menuWithFeaturePermissions(menuItems, $localStorage.featuresInRole);
          $scope.menuItems = menuItemsPermitted[0].menuItems;
        }

        if (companyTypeName === 'Cash Handler' && $rootScope.cashbagRestrictUse && !$rootScope.showManageCashBag) {
          // delete 'Manage Cash Bag' menu
          deleteMenuCashBag('Manage Cash Bag');
        }

        if (companyTypeName === 'Cash Handler' && $rootScope.cashbagRestrictUse && !$rootScope.showCashBagSubmission) {
          // delete 'Cash Bag Submission' menu
          deleteMenuCashBag('Cash Bag Submission');
        }
      }

      function checkForData() {
        var promises = [
          menuService.isMenuCashbagRestrictUse(),
          menuService.isShowManageCashBag(),
          menuService.isShowCashBagSubmission()
        ];
        $q.all(promises).then(promiseResponseHandler);
      }

      $rootScope.$on('DEXsaved', checkForData);

      $scope.leaveViewNav = function (path) {
        if (path.substring(0, 2) === '/#') {
          path = path.substring(2);
          $location.path(path);
        }
      };

      $scope.itemClass = function (path) {
        var itemClass = '';
        if ('/#' + $location.path() === path) {
          itemClass += ' active';
        }

        return itemClass;
      };

      // end promises
      checkForData();
    };
    
    return {
      templateUrl: '/views/directives/dynamic-left-nav.html',
      restrict: 'E',
      scope: {
        title: '@',
        isEditing: '@'
      },
      controller: dynamicLeftNavController
    };
  });
