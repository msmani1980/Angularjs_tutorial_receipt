'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipListCtrl
 * @description
 * # MenuRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipListCtrl', function ($scope, dateUtility, $filter, menuService, catererStationService,
                                                    menuCatererStationsService, $q, messageService, lodash, accessService) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.relationshipList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    $scope.menuList = [];
    $scope.stationList = [];

    var _initDone = false;

    function showLoadModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadModal() {
      angular.element('#loading').modal('hide');
    }

    this.showSuccessMessage = function (message) {
      messageService.display('success', message);
    };

    this.updateRelationshipList = function () {
      $this.associateStationData();
    };

    this.generateRelationshipQuery = function () {
      var todaysDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var query = {
        startDate: todaysDate,
        sortBy: 'ASC',
        sortOn: 'startDate'
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
      }

      if ($scope.dateRange.endDate) {
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }

      return query;
    };

    this.makePromises = function () {
      var query = this.generateRelationshipQuery();
      return [
        catererStationService.getCatererStationList(query),
        menuService.getMenuList(query, false)
      ];
    };

    this.getStationAndMenuList = function () {
      var promises = $this.makePromises();
      $q.all(promises).then(function (response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        _initDone = true;
        $scope.searchRelationshipList();
      });
    };

    $scope.searchRelationshipList = function () {
      if ($this.menuList === null || $this.stationList === null) {
        hideLoadModal();
        return;
      }

      if ($this.meta.offset >= $this.meta.count) {
        hideLoadModal();
        return;
      }

      if (!_initDone) {
        hideLoadModal();  
        return;
      }

      var query = lodash.assign($this.generateRelationshipQuery(), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      menuCatererStationsService.getRelationshipList(query).then(function (response) {
        $this.meta.count = $this.meta.count || response.meta.count;
        $this.appendRelationshipList(response);
        $this.updateRelationshipList();
        $this.initSelectUI();
        $this.hideLoadingModal();
        hideLoadModal();        
      });

      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchRecords = function () {
      showLoadModal('Searching');
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.relationshipList = [];

      $scope.searchRelationshipList();
    };

    this.appendRelationshipList = function (apiResponse) {
      var companyMenuCatererStations = angular.copy(apiResponse.companyMenuCatererStations);
      lodash.map(companyMenuCatererStations, function (item) {
        item.startDate = dateUtility.formatDateForApp(item.startDate);
        item.endDate = dateUtility.formatDateForApp(item.endDate);

        item.isMenuExpired = true;

        item.masterMenu.menus.forEach(function (menu) {
          var menuEndDate = dateUtility.formatDateForApp(menu.endDate);
          if (dateUtility.isTomorrowOrLaterDatePicker(menuEndDate)) {
            item.isMenuExpired = false;
          }
        });

      });

      $scope.relationshipList = $scope.relationshipList.concat(companyMenuCatererStations);
    };

    this.setCatererStationList = function (apiResponse) {
      $scope.stationList = apiResponse.response;
    };

    this.setMenuList = function (apiResponse) {
      $scope.menuList = apiResponse.menus;
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

    this.findRelationshipIndex = function (relationship) {
      var index = $scope.relationshipList.indexOf(relationship);
      return parseInt(index);
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

      return parseInt(stationIndex);
    };

    this.initSelectUI = function () {
      angular.element('select.multi-select').select2({
        width: '100%'
      });
    };

    this.removeRecordFromList = function (relationshipIndex) {
      $this.hideLoadingModal();
      $this.showSuccessMessage(
        'Menu to Caterer Station Relationship Removed');
      $scope.relationshipList.splice(relationshipIndex, 1);
      $this.updateRelationshipList();
    };

    $scope.removeRecord = function (relationship) {
      var relationshipIndex = $this.findRelationshipIndex(relationship);
      $this.displayLoadingModal();
      menuCatererStationsService.deleteRelationship(relationship.id).then(
        $this.removeRecordFromList(relationshipIndex));
    };

    this.displayLoadingModal = function () {
      angular.element('.loading-more').show();
    };

    this.hideLoadingModal = function () {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    };

    $scope.isRelationshipActive = function (date) {
      return dateUtility.isTodayOrEarlierDatePicker(date);
    };

    $scope.isRelationshipInactive = function (date) {
      return dateUtility.isYesterdayOrEarlierDatePicker(date);
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange = {};
      $scope.search = {};
      $scope.relationshipList = [];
    };

    $scope.getUpdateBy = function (menu) {
      if (menu.updatedByPerson) {
        return menu.updatedByPerson.userName;
      }

      if (menu.createdByPerson) {
        return menu.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (menu) {
      return menu.updatedOn ? dateUtility.formatTimestampForApp(menu.updatedOn) : dateUtility.formatTimestampForApp(menu.createdOn);
    };

    this.init = function () {
      showLoadModal('Loading Data');
      $scope.isCRUD = accessService.crudAccessGranted('MENUCAT', 'MENUSTATION', 'CRUDMCS');
      $this.getStationAndMenuList();
    };

    this.init();

  });
