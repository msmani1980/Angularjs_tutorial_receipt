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
    $filter, menuService, catererStationService, menuCatererStationsService,
    $q) {

    var $this = this;
    $scope.currentPage = 1;
    $scope.relationshipsPerPage = 10;
    $scope.relationshipList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.init = function () {
      this.getRelationshipList();
      $scope.$watch('search', function () {
        $this.updateRelationshipList();
      }, true);
      $scope.$watchCollection('dateRange', function () {
        $this.getRelationshipList();
      });
      $scope.$watch('currentPage + relationshipsPerPage', function () {
        $this.updateRelationshipList();
      });
    };

    this.updateRelationshipList = function () {
      this.associateMenuData();
      this.associateStationData();
      var filteredRelationships = $this.filterRelationships();
      $scope.relationshipListCount = filteredRelationships.length;
      $this.setPaginatedRelationships(filteredRelationships);
    };

    this.filterRelationships = function () {
      console.log($scope.relationshipList, $scope.search, $filter('filter')
        ($scope.relationshipList,
          $scope.search));
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

    this.makePromises = function () {
      var query = this.generateRelationshipQuery();
      return [
        catererStationService.getCatererStationList(),
        menuService.getMenuList(),
        menuCatererStationsService.getRelationshipList(query)
      ];
    };

    this.getRelationshipList = function () {
      var promises = this.makePromises();
      $q.all(promises).then(function (response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.setRelationshipList(response[2]);
        $this.updateRelationshipList();
        $this.initSelectUI();
        angular.element('#loading').modal('hide');
      });
    };

    this.setRelationshipList = function (apiResponse) {
      $scope.relationshipList = apiResponse.companyMenuCatererStations;
      $scope.relationshipListCount = $scope.relationshipList.length;
    };

    this.setCatererStationList = function (apiResponse) {
      $scope.stationList = apiResponse.response;
    };

    this.setMenuList = function (apiResponse) {
      $scope.menuList = apiResponse.menus;
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
      angular.element('select.multi-select').select2({
        width: '100%'
      });
    };

    $scope.deleteRelationship = function (relationshipId) {
      var relationshipIndex = $this.findRelationshipIndex(relationshipId);
      angular.element('#loading').modal('show').find('p').text(
        'Removing your menu');
      menuCatererStationsService.deleteRelationship(relationshipId).then(
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
