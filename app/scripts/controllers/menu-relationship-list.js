'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipListCtrl
 * @description
 * # MenuRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipListCtrl', function ($scope, dateUtility,
    $filter, menuService, catererStationService) {

    var $this = this;
    $scope.currentPage = 1;
    $scope.menusPerPage = 10;
    $scope.menuList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.updateMenuList = function () {
      var filteredMenus = $this.filterMenus();
      $scope.menuListCount = filteredMenus.length;
      $this.setPaginatedMenus(filteredMenus);
    };

    this.filterMenus = function () {
      return $filter('filter')($scope.menuList, $scope.search);
    };

    this.parsePaginationToInt = function () {
      $scope.currentPageInt = parseInt($scope.currentPage);
      $scope.menusPerPageInt = parseInt($scope.menusPerPage);
    };

    this.setPaginatedMenus = function (filteredMenus) {
      this.parsePaginationToInt();
      var begin = (($scope.currentPageInt - 1) * $scope.menusPerPageInt);
      var end = begin + $scope.menusPerPageInt;
      $scope.paginatedMenus = filteredMenus.slice(begin, end);
    };

    this.generateMenuQuery = function () {
      var query = {};
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDate($scope.dateRange.startDate,
          'L', 'YYYYMMDD');
        query.endDate = dateUtility.formatDate($scope.dateRange.endDate,
          'L', 'YYYYMMDD');
      }
      return query;
    };

    this.getMenuList = function () {
      var query = this.generateMenuQuery();
      var $this = this;
      menuService.getMenuList(query).then(function (response) {
        $scope.menuList = response.menus;
        $scope.menuListCount = $scope.menuList.length;
        $this.updateMenuList();
      });
    };

    this.getCatererStationList = function () {
      catererStationService.getCatererStationList().then(function (response) {
        $scope.stationList = response.response;
      });
    };

    this.findMenuIndex = function (menuId) {
      var menuIndex = 0;
      for (var key in $scope.menuList) {
        var menu = $scope.menuList[key];
        if (menu.id === menuId) {
          menuIndex = key;
          break;
        }
      }
      return menuIndex;
    };

    $scope.removeMenu = function (menuId) {
      var menuIndex = $this.findMenuIndex(menuId);
      angular.element('#loading').modal('show').find('p').text(
        'Removing your menu');
      menuService.removeMenu(menuId).then(function () {
        angular.element('#loading').modal('hide');
        $scope.menuList.splice(menuIndex, 1);
        $this.updateMenuList();
      });
    };

    $scope.isMenuActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isMenuInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
      $scope.menuListCount = $scope.menuList.length;
    };

    $scope.$watchCollection('search', function () {
      $this.updateMenuList();
    });

    $scope.$watchCollection('dateRange', function () {
      $this.getMenuList();
    });

    $scope.$watch('currentPage + menusPerPage', function () {
      $this.updateMenuList();
    });

    this.getMenuList();
    this.getCatererStationList();

    var stationAPIResponse = {

      'response': [{
        'id': 1,
        'companyId': 326,
        'code': 'ORD',
        'name': 'Chicago O-hare'
      }, {
        'id': 2,
        'companyId': 326,
        'code': 'MDW',
        'name': 'Chicago Midway'
      }, {
        'id': 8,
        'companyId': 326,
        'code': 'LAX',
        'name': 'Los Angeles'
      }, {
        'id': 9,
        'companyId': 326,
        'code': 'MIA',
        'name': 'Miami'
      }, {
        'id': 10,
        'companyId': 326,
        'code': 'IAH',
        'name': 'Houston'
      }, {
        'id': 19,
        'companyId': 326,
        'code': 'ALC',
        'name': 'Alicante'
      }, {
        'id': 20,
        'companyId': 326,
        'code': 'BCN',
        'name': 'Barcelona'
      }, {
        'id': 21,
        'companyId': 326,
        'code': 'AGP',
        'name': 'Malaga'
      }, {
        'id': 22,
        'companyId': 326,
        'code': 'VLC',
        'name': 'Valencia'
      }, {
        'id': 23,
        'companyId': 326,
        'code': 'CPH',
        'name': 'Copenhagen'
      }, {
        'id': 24,
        'companyId': 326,
        'code': 'SKS',
        'name': 'Vojens'
      }, {
        'id': 25,
        'companyId': 326,
        'code': 'EKHG',
        'name': 'Herning'
      }, {
        'id': 26,
        'companyId': 326,
        'code': 'BSL',
        'name': 'Basel'
      }, {
        'id': 27,
        'companyId': 326,
        'code': 'GVA',
        'name': 'Geneva'
      }, {
        'id': 28,
        'companyId': 326,
        'code': 'ZRH',
        'name': 'Zurich'
      }, {
        'id': 29,
        'companyId': 326,
        'code': 'BRN',
        'name': 'Bern'
      }, {
        'id': 30,
        'companyId': 326,
        'code': 'ZHI',
        'name': 'Grenchen'
      }, {
        'id': 39,
        'companyId': 326,
        'code': 'LON',
        'name': 'Heathrow Intl'
      }, {
        'id': 41,
        'companyId': 326,
        'code': 'LGW',
        'name': 'Gatwick '
      }, {
        'id': 43,
        'companyId': 326,
        'code': 'LPL',
        'name': 'Liverpool '
      }, {
        'id': 44,
        'companyId': 326,
        'code': 'LTN',
        'name': 'Luton '
      }, {
        'id': 45,
        'companyId': 326,
        'code': 'MAD',
        'name': 'Madrid '
      }],
      'meta': {
        'count': 22,
        'limit': 22,
        'start': 0
      }
    };

    $scope.stationList = stationAPIResponse.response;

  });
