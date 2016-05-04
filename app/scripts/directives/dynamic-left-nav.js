'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

  var dynamicLeftNavController = function ($q, $rootScope, $scope, $location, $window, $filter, mainMenuService, globalMenuService, identityAccessFactory, lodash, menuService) {

	  function deleteMenuCashBag(menuName) {
		  var indx=-1;
		  var i=0;
		  angular.forEach($scope.menuItems, function(obj){
			  if (obj.name === menuName) {
				  indx=i;
			  }
			  i=i+1;
		  });
		  if (indx!==-1) {
			  $scope.menuItems.splice(indx, 1);
		  }
    }

	  function promiseResponseHandler() {
    	  var companyTypeId = globalMenuService.getCompanyData().companyTypeId;
    	  var companyTypes = identityAccessFactory.getSessionObject().companyTypes;
    	  var companyTypeName = angular.copy(lodash.findWhere(companyTypes, { id: companyTypeId }).name);
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
    	  if (companyTypeName, menuItems.length) {
    		  $scope.menuItems = menuItems[0].menuItems;
    	  }
    	  if (companyTypeName === 'Cash Handler' && !$rootScope.showManageCashBag) {
    		  // delete 'Manage Cash Bag' menu
    		  deleteMenuCashBag('Manage Cash Bag');
    	  }
    	  if (companyTypeName === 'Cash Handler' && !$rootScope.showCashBagSubmission) {
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

      $scope.sendToEmber = function (path) {
        path = '/ember/#/' + path.substring(9);
        var emberPath = $location.$$protocol + '://' + $location.$$host + path;
        $window.location.href = emberPath;
      };

      $scope.leaveViewNav = function (path) {
        if (path.substring(0, 2) === '/#') {
          path = path.substring(2);
          $location.path(path);
        } else if (path.substring(1, 6) === 'ember') {
          $scope.sendToEmber(path);
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
