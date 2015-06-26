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
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.init = function () {
      $scope.$watchCollection('search', function () {
        $this.updateRelationshipList();
      });
      $scope.$watchCollection('dateRange', function () {
        $this.getRelationshipList();
      });
      $scope.$watch('currentPage + relationshipsPerPage', function () {
        $this.updateRelationshipList();
      });
      this.getRelationshipList();
      this.getCatererStationList();
    };

    this.updateRelationshipList = function () {
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
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDate($scope.dateRange.startDate,
          'L', 'YYYYMMDD');
        query.endDate = dateUtility.formatDate($scope.dateRange.endDate,
          'L', 'YYYYMMDD');
      }
      return query;
    };

    this.getRelationshipList = function () {
      var query = this.generateRelationshipQuery();
      var $this = this;
      menuCatererStationsService.getRelationshipList(query).then(function (
        response) {
        console.log(response);
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

    this.findRelationshipIndex = function (relationshipId) {
      var relationshipIndex = 0;
      for (var key in $scope.relationshipList) {
        var relationship = $scope.relationshipList[key];
        if (relationship.id === relationshipId) {
          relationshipIndex = key;
          break;
        }
      }
      return relationshipIndex;
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
