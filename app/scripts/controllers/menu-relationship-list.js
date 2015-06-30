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
    $filter, menuService, catererStationService, menuCatererStationsService) {

    var $this = this;
    $scope.currentPage = 1;
    $scope.relationshipsPerPage = 10;
    $scope.relationshipList = [];

    this.init = function () {
      $scope.$watchCollection('search', function () {
        $this.updateRelationshipList();
      });
      $scope.$watchCollection('dateRange', function () {
        $this.getMenuList();
      });
      $scope.$watch('currentPage + relationshipsPerPage', function () {
        $this.updateRelationshipList();
      });
      this.getMenuList();
      this.getCatererStationList();
    };

    this.associateMenuData = function () {
      for (var key in $scope.relationshipList) {
        var relationship = $scope.relationshipList[key];
        var menuIndex = this.findMenuIndex(relationship.menuId);
        if (menuIndex !== null) {
          $scope.relationshipList[key].menu = $scope.menuList[menuIndex];
        }
      }
    };

    this.associateStationData = function () {
      for (var key in $scope.relationshipList) {
        var relationship = $scope.relationshipList[key];
        relationship.stations = [];
        for (var stationKey in relationship.catererStationIds) {
          var stationId = relationship.catererStationIds[stationKey];
          var stationIndex = this.findStationIndex(stationId);
          if (stationIndex !== null) {
            $scope.relationshipList[key].stations[stationKey] = $scope.stationList[
              stationIndex];
          }
        }
      }
    };

    this.updateRelationshipList = function () {
      this.associateMenuData();
      this.associateStationData();
      var filteredRelationships = $this.filterRelationships();
      $scope.relationshipListCount = filteredRelationships.length;
      $this.setPaginatedRelationships(filteredRelationships);
    };

    this.filterRelationships = function () {
      return $filter('filter')($scope.relationshipList, $scope.search);
    };

    this.setPaginatedRelationships = function (filteredRelationships) {
      var currentPage = parseInt($scope.currentPage);
      var relationshipsPerPage = parseInt($scope.relationshipsPerPage);
      var begin = ((currentPage - 1) * relationshipsPerPage);
      var end = begin + relationshipsPerPage;
      $scope.paginatedRelationships = filteredRelationships.slice(begin,
        end);
    };

    this.generateRelationshipQuery = function () {
      var query = {};
      if ($scope.dateRange && $scope.dateRange.startDate && $scope.dateRange
        .endDate) {
        query.startDate = dateUtility.formatDate($scope.dateRange.startDate,
          'L', 'YYYYMMDD');
        query.endDate = dateUtility.formatDate($scope.dateRange.endDate,
          'L', 'YYYYMMDD');
      }
      return query;
    };

    this.getRelationshipList = function () {
      var query = this.generateRelationshipQuery();
      menuCatererStationsService.getRelationshipList(query).then(function (
        response) {
        $scope.relationshipList = response.companyMenuCatererStations;
        $scope.relationshipListCount = $scope.relationshipList.length;
        $this.updateRelationshipList();
      });
    };

    this.getCatererStationList = function () {
      catererStationService.getCatererStationList().then(function (
        apiResponse) {
        $scope.stationList = apiResponse.response;
        $this.initSelectUI();
      });
    };

    this.getMenuList = function () {
      var query = this.generateRelationshipQuery();
      menuService.getMenuList(query).then(function (apiResponse) {
        $scope.menuList = apiResponse.menus;
        $this.getRelationshipList();
      });
    };

    this.findRelationshipIndex = function (relationshipId) {
      var relationshipIndex = null;
      for (var key in $scope.relationshipList) {
        var relationship = $scope.relationshipList[key];
        if (parseInt(relationship.id) === parseInt(relationshipId)) {
          relationshipIndex = key;
          break;
        }
      }
      return relationshipIndex;
    };

    this.findMenuIndex = function (menuId) {
      var menuIndex = null;
      for (var key in $scope.menuList) {
        var menu = $scope.menuList[key];
        if (parseInt(menu.menuId) === parseInt(menuId)) {
          menuIndex = key;
          break;
        }
      }
      return menuIndex;
    };

    this.findStationIndex = function (stationId) {
      var stationIndex = null;
      for (var key in $scope.stationList) {
        var station = $scope.stationList[key];
        if (parseInt(station.id) === parseInt(stationId)) {
          stationIndex = key;
          break;
        }
      }
      return stationIndex;
    };

    this.initSelectUI = function () {
      angular.element('.multi-select').select2({
        width: '100%'
      });
    };

    $scope.removeRelationship = function (relationshipId) {
      var relationshipIndex = $this.findRelationshipIndex(relationshipId);
      angular.element('#loading').modal('show').find('p').text(
        'Removing your menu');
      menuCatererStationsService.removeRelationship(relationshipId).then(
        function () {
          angular.element('#loading').modal('hide');
          $scope.relationshipList.splice(relationshipIndex, 1);
          $this.updateRelationshipList();
        });
    };

    $scope.isRelationshipActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isRelationshipInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
      $scope.relationshipListCount = $scope.relationshipList.length;
    };

    this.init();

  });
