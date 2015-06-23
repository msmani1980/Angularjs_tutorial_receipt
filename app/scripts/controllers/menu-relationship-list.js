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
    $filter, menuService) {

    var $this = this;
    $scope.currentPage = 1;
    $scope.menusPerPage = 10;
    $scope.menuList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    var stationAPIResponse;

    $scope.$watch('dateRange.startDate + dateRange.endDate', function () {
      $this.updateMenuList();
    });

    this.updateMenuList = function () {
      var filteredMenus = $this.filterItems();
      $scope.menuListCount = filteredMenus.length;
      $this.setPaginatedMenus(filteredMenus);
    };

    this.filterItems = function () {
      var dateFiltered = $filter('daterange')($scope.menuList, $scope.dateRange
        .startDate,
        $scope.dateRange.endDate);
      return $filter('filter')(dateFiltered, $scope.search);
    };

    this.setPaginatedMenus = function (filteredMenus) {
      var begin = (($scope.currentPage - 1) * $scope.menusPerPage);
      var end = begin + $scope.menusPerPage;
      $scope.paginatedMenus = filteredMenus.slice(begin, end);
    };

    this.getMenuList = function () {
      menuService.getMenuList().then(function (response) {
        $scope.menuList = response.menus;
        $scope.menuListCount = $scope.menuList.length;
        $this.updateMenuList();
      });
    };

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.endDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
      $scope.menuListCount = $scope.menuList.length;
    };

    this.getMenuList();

    stationAPIResponse = {

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
