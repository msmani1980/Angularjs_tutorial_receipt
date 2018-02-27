'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationListCtrl
 * @description
 * # StationListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationListCtrl', function($scope, dateUtility, messageService, stationsFactory, $q, $filter, lodash, identityAccessFactory, globalMenuService, ENV) {

    var $this = this;

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
    $scope.stationList = [];

    this.setCityList = function(stationsList) {
      var citiesList = [];
      angular.forEach(stationsList, function (station) {
        var country = {
          id: station.cityId,
          cityName: station.cityName,
          countryId: station.countryId
        };
        citiesList.push(country);
      });

      $scope.cityList = $filter('unique')(citiesList, 'id');
    };

    this.setCountryList = function (stationsList) {
      var countriesList = [];
      angular.forEach(stationsList, function (station) {
        var country = {
          id: station.countryId,
          countryName: station.countryName
        };
        countriesList.push(country);
      });

      $scope.countryList = $filter('unique')(countriesList, 'id');
    };

    this.setStationList = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      $scope.stationList = $scope.stationList.concat(angular.copy(dataFromAPI.response).map(function (station) {
        station.startDate = dateUtility.formatDateForApp(station.startDate);
        station.endDate = dateUtility.formatDateForApp(station.endDate);

        return station;
      }));
    };

    this.mapStationIdForSearchPayload = function(payload) {
      return payload.stationId.map(function(stationId) {
        return stationId.id;
      }).join(',');
    };

    this.mapCityIdForSearchPayload = function(payload) {
      return payload.cityId.map(function(cityId) {
        return cityId.id;
      }).join(',');
    };

    this.buildSearchPayload = function() {
      var search = $scope.search;

      var payload = {
        countryId: search.countryId,
        startDate: (search.startDate) ? dateUtility.formatDateForAPI(search.startDate) : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        endDate: (search.endDate) ? dateUtility.formatDateForAPI(search.endDate) : null,
        stationIds: (search.stationId && search.stationId.length > 0) ? $this.mapStationIdForSearchPayload(search) : null,
        cityIds: (search.cityId && search.cityId.length > 0) ? $this.mapCityIdForSearchPayload(search) : null,
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };

      return payload;
    };

    this.getStationList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      this.showLoadingBar();

      var payload = $this.buildSearchPayload();

      $this.meta.offset += $this.meta.limit;

      return stationsFactory.getStationList($this.meta.offset, payload).then($this.setStationList).finally(this.hideLoadingBar);
    };

    this.setGlobalStationList = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI.response);

      var distinctStations = $filter('unique')(response, 'stationId');

      $scope.globalStationList = distinctStations;
      $this.setCountryList(distinctStations);
      $this.setCityList(distinctStations);
    };

    this.getGlobalStationList = function() {
      return stationsFactory.getGlobalStationList().then($this.setGlobalStationList);
    };

    this.showLoadingBar = function() {
      if (!$scope.isSearch) {
        return;
      }

      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    };

    this.hideLoadingBar = function() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setupFormDataObject = function() {
      $scope.formData = {
        stations: []
      };

      $scope.formData.stations = angular.copy($scope.stationList);
    };

    this.dateActive = function(date) {
      return dateUtility.isTodayOrEarlier(date);
    };

    this.getSelectedStations = function() {
      return $scope.selectedStations.filter(function(selected, stationId) {
        if (selected === true) {
          return stationId;
        }
      });
    };

    this.canSave = function() {
      if ($scope.selectedStations.length > 0) {
        var selected = this.getSelectedStations();
        return selected.length > 0;
      }

      return $scope.selectedStations.length > 0;
    };

    this.showSuccessMessage = function(message) {
      messageService.display('success', message, 'Success');
    };

    this.getStationObject = function(stationId) {
      var selectedStation = $scope.stationList.filter(function(station) {
        return station.id === stationId;
      })[0];

      return selectedStation;
    };

    this.generatePayload = function() {
      var payload = [];
      angular.forEach($scope.selectedStations, function(selected, stationId) {
        if (selected) {
          payload.push($this.getStationObject(stationId));
        }
      });

      return payload;
    };

    this.validateForm = function() {
      $scope.displayError = $scope.stationListForm.$invalid;
      return $scope.stationListForm.$valid;
    };

    this.errorHandler = function(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.showToast = function(className, type, message) {
      messageService.display(className, '<strong>' + type + '</strong>: ' + message);
    };

    this.saveStationsSuccess = function() {
      this.showSuccessMessage('Selected stations have been updated!');
    };

    this.showSaveErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $this.errorHandler(dataFromAPI);
    };

    this.saveStations = function() {
      this.displayLoadingModal('Saving stations');

      var payload = {
        stations: [],
        startDate: dateUtility.formatDateForAPI($scope.dateRange.startDate),
        endDate: dateUtility.formatDateForAPI($scope.dateRange.endDate)
      };

      angular.forEach($scope.selectedStations, function(selected, stationId) {
        if (selected) {
          payload.stations.push(stationId);
        }
      });

      stationsFactory.bulkUpdateStation(payload).then(this.saveStationsSuccess, this.showSaveErrors);
    };

    this.submitForm = function() {
      if ($this.validateForm()) {
        $this.saveStations();
      }
    };

    this.saveStation = function(index) {
      var station = $scope.formData.stations[index];

      this.displayLoadingModal('Saving stations');

      var payload = {
        stations: [station.id],
        startDate: dateUtility.formatDateForAPI(station.startDate),
        endDate: dateUtility.formatDateForAPI(station.endDate)
      };

      stationsFactory.bulkUpdateStation(payload).then(this.saveStationsSuccess, this.showSaveErrors);
    };

    this.getStationInFormData = function(stationId) {
      return $scope.formData.stations.filter(function(station) {
        return stationId === station.id;
      })[0];
    };

    this.updateStationStartDate = function(current, stationId) {
      var station = this.getStationInFormData(stationId);
      if (station && !this.dateActive(station.startDate)) {
        station.startDate = current.startDate;
      }
    };

    this.updateStationEndDate = function(current, stationId) {
      var station = this.getStationInFormData(stationId);
      if (station && !dateUtility.isYesterdayOrEarlier(station.endDate) &&
        !dateUtility.isYesterdayOrEarlier(current.endDate)) {
        station.endDate = current.endDate;
      }
    };

    this.updateSelectedStartDates = function(current) {
      if (angular.isDefined(current) && current.startDate) {
        angular.forEach($scope.selectedStations, function(selected, stationId) {
          if (selected) {
            $this.updateStationStartDate(current, stationId);
          }
        });
      }
    };

    this.updateSelectedEndDates = function(current) {
      if (angular.isDefined(current) && current.endDate) {
        angular.forEach($scope.selectedStations, function(selected, stationId) {
          if (selected) {
            $this.updateStationEndDate(current, stationId);
          }
        });
      }
    };

    this.selectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = true;
      });
    };

    this.deselectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = false;
      });
    };

    this.toggleAllStations = function(selectAll) {
      if (selectAll) {
        this.selectAllStations();
        return;
      }

      this.deselectAllStations();
    };

    this.filterByCountry = function(record) {
      if (!$scope.search || !$scope.search.countryId) {
        return true;
      }

      return parseInt(record.countryId) === parseInt($scope.search.countryId);
    };

    this.filterByCity = function(record) {
      if (!$scope.search || !$scope.search.cityId || $scope.search.cityId.length === 0) {
        return true;
      }

      return lodash.find($scope.search.cityId, { id: record.cityId });
    };

    this.buildExportParameters = function() {
      // jshint ignore: start
      var search = $scope.search;

      var parameters = '&startDate=' + (search.startDate ? dateUtility.formatDateForAPI(search.startDate) : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()));

      if (search.countryId) {
        parameters = parameters + '&countryId=' + search.countryId;
      }

      if (search.endDate) {
        parameters = parameters + '&endDate=' + dateUtility.formatDateForAPI(search.endDate);
      }

      if (search.stationId && search.stationId.length > 0) {
        parameters = parameters + '&stationIds=' + $this.mapStationIdForSearchPayload(search);
      }

      if (search.cityId && search.cityId.length > 0) {
        parameters = parameters + '&cityIds=' + $this.mapCityIdForSearchPayload(search);
      }

      return parameters;

      // jshint ignore: end
    };

    this.removeStationSuccess = function (stationId) {
      lodash.remove($scope.companyStationList, function (station) {
        return station.id === stationId;
      });
    };

    this.removeStationFailure = function () {
      $this.showToast('danger', 'Station', 'Error deleting station!');
    };

    this.makeInitPromises = function() {
      return [
        this.getGlobalStationList()
      ];
    };

    this.initSuccessHandler = function() {
      $this.hideLoadingModal();
    };

    this.init = function() {
      this.hideLoadingBar();
      this.displayLoadingModal('Retrieving Station information');
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.init();

    function hasLength(data) {
      return angular.isDefined(data) && data.length;
    }

    function searchIsDirty() {
      var s = $scope.search;
      var check = [];
      for (var search in s) {
        if (angular.isDefined(search) && hasLength(search)) {
          check.push(search);
        }
      }

      return (check.length);
    }

    /* Scope */

    $scope.selectedStations = [];

    $scope.search = {};

    $scope.hideSearch = function() {
      var filterControls = angular.element(
        angular.element.find('#filter-controls')[0]
      );
      filterControls.addClass('collapse').removeClass('in');
    };

    $scope.searchRecords = function() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;
      $scope.stationList = [];

      $this.getStationList().then($this.setupFormDataObject).finally($scope.hideSearch);
    };

    $scope.getStationList = function () {
      if (!$scope.isSearch) {
        return;
      }

      return $this.getStationList().then($this.setupFormDataObject).finally($scope.hideSearch);
    };

    $scope.clearSearchFilters = function() {
      $scope.search = {};
      $scope.stationList = [];
      $scope.isSearch = false;
      $scope.loadingBarVisible = false;
    };

    $scope.showClearButton = function() {
      return (searchIsDirty() || ($scope.stationList && $scope.stationList.length));
    };

    $scope.canSave = function() {
      return $this.canSave();
    };

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.saveStation = function(index) {
      $this.saveStation(index);
    };

    $scope.filterByCountry = function(record) {
      return $this.filterByCountry(record);
    };

    $scope.filterByCity = function(record) {
      return $this.filterByCity(record);
    };

    $scope.isDateActive = function(date) {
      return $this.dateActive(date);
    };

    $scope.removeRecord = function (stationId) {
      $this.displayLoadingModal('Removing Station id');

      stationsFactory.removeStation(stationId).then($this.removeStationSuccess(stationId), $this.removeStationFailure).finally($this.hideLoadingModal);
    };

    $scope.exportTo = function(type) {
      var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
      var companyId = globalMenuService.company.get();
      var exportParameters = $this.buildExportParameters();

      return ENV.apiUrl + '/rsvr-pdf/api/stations/' + companyId + '/' + type + '?sessionToken=' + sessionToken + exportParameters;
    };

    $scope.$watch('dateRange', function(current) {
      $this.updateSelectedStartDates(current);
      $this.updateSelectedEndDates(current);
    }, true);

    $scope.$watch('allStationsSelected', function(selectAll) {
      $this.toggleAllStations(selectAll);
    });

    $scope.$watch('search.countryId', function(countryId) {
      if (!$scope.search || !countryId) {
        return;
      }

      $scope.search.stationId = lodash.filter($scope.search.stationId, { countryId: parseInt(countryId.toString()) });
      $scope.search.cityId = lodash.filter($scope.search.cityId, { countryId: parseInt(countryId.toString()) });
    });

    $scope.$watch('search.cityId', function(cityId) {
      if (!$scope.search || !cityId) {
        return;
      }

      $scope.search.stationId = lodash.filter($scope.search.stationId, function (station) {
        return lodash.filter(cityId, { id: parseInt(station.cityId) }).length > 0;
      });
    });

  });
