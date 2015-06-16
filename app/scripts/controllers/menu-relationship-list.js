'use strict';
/* global moment */
/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipListCtrl
 * @description
 * # MenuRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipListCtrl', function ($scope) {

    var menuAPIResponse,
      stationAPIResponse;

    // TODO: Move to global function
    function formatDate(dateString, formatFrom, formatTo) {
      var dateToReturn = moment(dateString, formatFrom).format(formatTo).toString();
      return dateToReturn;
    }

    // set search and start dates to nothing
    $scope.search = {
      startDate: '',
      endDate: ''
    };

    $scope.startDateFilter = '';
    $scope.endDateFilter = '';

    var todaysDate = Date.parse(new Date());

    $scope.$watch('search.startDate + search.endDate', function () {

      $scope.formatDateFilter();

    });

    $scope.formatDateFilter = function () {

      if ($scope.search.startDate && $scope.search.endDate) {
        $scope.startDateFilter = formatDate($scope.search.startDate, 'L',
          'YYYY-MM-DD');
        $scope.endDateFilter = formatDate($scope.search.endDate, 'L',
          'YYYY-MM-DD');
      }

    };

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= todaysDate;
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= todaysDate;
    };

    $scope.clearSearchFilters = function () {
      var filters = $scope.search;
      $scope.startDate = '';
      $scope.endDate = '';
      $scope.startDateFilter = '';
      $scope.endDateFilter = '';
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
    };

    menuAPIResponse = {
      'menus': [{
        'id': 121,
        'companyId': 374,
        'menuCode': 'Test01',
        'menuName': 'Test Menu',
        'description': 'Test Menu',
        'startDate': '2015-04-15',
        'endDate': '2015-04-15',
        'createdBy': 1,
        'createdOn': '2015-04-14 02:49:35.715873',
        'updatedBy': null,
        'updatedOn': null,
        'menuItems': [{
          'id': 248,
          'itemId': 331,
          'itemName': 'Test Item',
          'menuId': 121,
          'itemQty': 1
        }]
      }, {
        'id': 122,
        'companyId': 374,
        'menuCode': 'MNCD001',
        'menuName': 'Menu Name',
        'description': 'Description for menu, testing 2',
        'startDate': '2015-04-29',
        'endDate': '2015-05-30',
        'createdBy': 1,
        'createdOn': '2015-04-27 22:04:00.266856',
        'updatedBy': 1,
        'updatedOn': '2015-04-28 21:56:11.001683',
        'menuItems': [{
          'id': 249,
          'itemId': 331,
          'itemName': 'Test Item',
          'menuId': 122,
          'itemQty': 4
        }]
      }],
      'meta': {
        'count': 2,
        'limit': 2,
        'start': 0
      }
    };

    $scope.menuList = menuAPIResponse.menus;

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
