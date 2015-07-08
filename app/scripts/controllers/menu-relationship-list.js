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
    $q, ngToast) {

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
      $scope.$watch('currentPage + relationshipsPerPage', $this.updateRelationshipList);
    };

    this.showSuccessMessage = function (message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: message
      });
    };

    this.updateRelationshipList = function () {
      $this.associateMenuData();
      $this.associateStationData();
      $scope.relationshipListCount = $scope.relationshipList.length;
      $this.setPaginatedRelationships($scope.relationshipList);
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
      var query = {
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange
          .startDate);
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange
          .endDate);
      }
      return query;
    };

    this.makePromises = function () {
      return [
        catererStationService.getCatererStationList(),
        menuService.getMenuList(),
        menuCatererStationsService.getRelationshipList()
      ];
    };

    this.getRelationshipList = function () {
      $this.displayLoadingModal('Getting all the relationships for you');
      var promises = $this.makePromises();
      $q.all(promises).then(function (response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.setRelationshipList(response[2]);
        $this.updateRelationshipList();
        $this.initSelectUI();
        $this.hideLoadingModal();
      });
    };

    this.searchRelationshipList = function () {
      $this.displayLoadingModal('Searching the relationships for you');
      var query = $this.generateRelationshipQuery();
      menuCatererStationsService.getRelationshipList(query).then(function (
        response) {
        $this.setRelationshipList(response);
        $this.updateRelationshipList();
        $this.hideLoadingModal();
      });
    };

    $scope.searchRecords = this.searchRelationshipList;

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

    this.removeRecordFromList = function (relationshipIndex) {
      $this.hideLoadingModal();
      $this.showSuccessMessage('Menu Relationship Removed');
      $scope.relationshipList.splice(relationshipIndex, 1);
      $this.updateRelationshipList();
    };

    $scope.removeRecord = function (relationshipId) {
      var relationshipIndex = $this.findRelationshipIndex(relationshipId);
      $this.displayLoadingModal('Removing your menu relationship');
      menuCatererStationsService.deleteRelationship(relationshipId).then(
        $this.removeRecordFromList(relationshipIndex));
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    $scope.isRelationshipActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isRelationshipInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange = {};
      $scope.search = {};
      $this.searchRelationshipList();
    };

    this.init();

  });
