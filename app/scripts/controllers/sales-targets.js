'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SalesTargetsCtrl
 * @description
 * # SalesTargetsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SalesTargetsCtrl', function ($scope, $q, $location, dateUtility, $routeParams, salesTargetFactory, salesTargetCategoryFactory, messageService,
                                            lodash, formValidationUtility, schedulesService, globalMenuService, companyStoresService, employeeFactory,
                                            stationsFactory, categoryFactory, itemsFactory) {

    var $this = this;

    $scope.viewName = 'Sales Target ';
    $scope.shouldDisableEndDate = false;
    $scope.menuMasterList = [];
    $scope.itemMasterList = [];
    $scope.validation = formValidationUtility;
    $scope.salesTarget = {
      schedules:[],
      stores: [],
      employees: [],
      stations: [],
      departureTimes: [],
      departureDates: [],
      itemCategories: [],
      items: []
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Sales Target';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Sales Target';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Sales Target';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();

      return $scope.salesTargetDataForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Sales Target', 'Success');
      } else {
        $this.showToastMessage('success', 'Edit Sales Target', 'Success');
      }

      $location.path('sales-targets');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createSalesTarget = function() {
      $this.showLoadingModal('Creating Sales Target');

      var payload = {
        name: $scope.salesTarget.name,
        companyId: globalMenuService.company.get(),
        description: $scope.salesTarget.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTarget.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTarget.endDate),
        targetValue: $scope.salesTarget.value,
        targetCategoryId: $scope.salesTarget.category.id,
        schedules: $this.mapCreateSchedulePayload(),
        stores: $this.mapCreateStoresPayload(),
        crews: $this.mapCreateCrewsPayload(),
        stations: $this.mapCreateStationsPayload(),
        departureTimes: $this.mapCreateDepartureTimesPayload(),
        departureDates: $this.mapCreateDepartureDatesPayload(),
        categories: $this.mapCreateCategoriesPayload(),
        items: $this.mapCreateItemsPayload()
      };

      salesTargetFactory.createSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    this.mapCreateSchedulePayload = function () {
      return $scope.salesTarget.schedules.map(function (schedule) {
        return {
          scheduleNumber: schedule.scheduleNumber
        };
      });
    };

    this.mapCreateStoresPayload = function () {
      return $scope.salesTarget.stores.map(function (store) {
        return {
          storeId: store.id
        };
      });
    };

    this.mapCreateCrewsPayload = function () {
      return $scope.salesTarget.employees.map(function (employee) {
        return {
          crewId: employee.id
        };
      });
    };

    this.mapCreateStationsPayload = function () {
      return $scope.salesTarget.stations.map(function (station) {
        return {
          departureStationId: (station.departure) ? station.departure.stationId : null,
          arrivalStationId: (station.arrival) ? station.arrival.stationId : null
        };
      });
    };

    this.mapCreateDepartureTimesPayload = function () {
      return $scope.salesTarget.departureTimes.map(function (departureTime) {
        return {
          timeFrom: departureTime.from,
          timeTo: departureTime.to
        };
      });
    };

    this.mapCreateDepartureDatesPayload = function () {
      return $scope.salesTarget.departureDates.map(function (departureDate) {
        return {
          dateFrom: (departureDate.from) ? dateUtility.formatDateForAPI(departureDate.from) : null,
          dateTo: (departureDate.to) ? dateUtility.formatDateForAPI(departureDate.to) : null
        };
      });
    };

    this.mapCreateCategoriesPayload = function () {
      return $scope.salesTarget.itemCategories.map(function (itemCategory) {
        return {
          categoryId: (itemCategory && itemCategory.value) ? itemCategory.value.id : null
        };
      });
    };

    this.mapCreateItemsPayload = function () {
      return $scope.salesTarget.items.map(function (item) {
        return {
          itemId: (item && item.value) ? item.value.id : null
        };
      });
    };

    this.editSalesTarget = function() {
      $this.showLoadingModal('Saving Sales Target');
      var payload = {
        id: $routeParams.id,
        name: $scope.salesTarget.name,
        description: $scope.salesTarget.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTarget.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTarget.endDate),
        targetValue: $scope.salesTarget.value,
        targetCategoryId: $scope.salesTarget.category.id,
        stations: [],
        departureTimes: [],
        departureDates: [],
        categories: [],
        items: []
      };

      salesTargetFactory.updateSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'SalesTarget');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    $scope.addStation = function() {
      $scope.salesTarget.stations.push({
        departure: null,
        arrival: null
      })
    };

    $scope.removeStation = function(index) {
      $scope.salesTarget.stations.splice(index, 1);
    };

    $scope.addDepartureTime = function() {
      $scope.salesTarget.departureTimes.push({
        from: '',
        to: ''
      })
    };

    $scope.removeDepartureTime = function(index) {
      $scope.salesTarget.departureTimes.splice(index, 1);
    };

    $scope.addDepartureDate = function() {
      $scope.salesTarget.departureDates.push({
        from: '',
        to: ''
      })
    };

    $scope.removeDepartureDate = function(index) {
      $scope.salesTarget.departureDates.splice(index, 1);
    };

    $scope.addItemCategory = function() {
      $scope.salesTarget.itemCategories.push({
        value: null
      })
    };

    $scope.removeItemCategory = function(index) {
      $scope.salesTarget.itemCategories.splice(index, 1);
    };

    $scope.addItem = function() {
      $scope.salesTarget.items.push({
        value: null
      })
    };

    $scope.removeItem = function(index) {
      $scope.salesTarget.items.splice(index, 1);
    };

    this.salesTargetSuccess = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI);

      var startDate = dateUtility.formatDateForApp(response.startDate);
      var endDate = dateUtility.formatDateForApp(response.endDate);
      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker(startDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

      $scope.salesTarget = {
        id: response.id,
        name: response.name,
        description: response.description,
        startDate: startDate,
        endDate: endDate,
        category: $this.findSalesTargetCategoryById(response.targetCategoryId),
        value: response.targetValue,
        stations: [],
        departureTimes: [],
        departureDates: [],
        itemCategories: [],
        items: []
      };

      $scope.isLoadingCompleted = true;
    };

    this.findSalesTargetCategoryById = function (categoryId) {
      return lodash.find($scope.salesTargetCategoryList, { id: categoryId });
    };

    this.getSalesTargetCategories = function () {
      return salesTargetCategoryFactory.getSalesTargetCategoryList().then($this.setSalesTargetCategories);
    };

    this.setSalesTargetCategories = function (dataFromAPI) {
      $scope.salesTargetCategoryList = angular.copy(dataFromAPI.salesTargetCategories);
    };

    this.getSchedules = function () {
      var companyId = globalMenuService.company.get();
      return schedulesService.getSchedules(companyId).then($this.setSchedules);
    };

    this.setSchedules = function (dataFromAPI) {
      $scope.scheduleList = angular.copy(dataFromAPI.distinctSchedules);
    };

    this.getStores = function () {
      return companyStoresService.getStoreList().then($this.setStores);
    };

    this.setStores = function (dataFromAPI) {
      $scope.storeList = angular.copy(dataFromAPI.response);
    };

    this.getEmployees = function () {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      return employeeFactory.getEmployees(payload).then($this.setEmployees);
    };

    this.setEmployees = function (dataFromAPI) {
      $scope.employeeList = angular.copy(dataFromAPI.companyEmployees);
    };

    this.getStations = function () {
      return stationsFactory.getStationList(0).then($this.setStations);
    };

    this.setStations = function (dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
    };

    this.setItemCategories = function (dataFromAPI) {
      $scope.itemCategoryList = [];

      // Flat out category list
      dataFromAPI.salesCategories.forEach(function (category) {
        $this.flatCategoryList(category, $scope.itemCategoryList);
      });

      // Assign order for flatten category list and create helper dictionary
      var count = 1;
      $scope.itemCategoryList.forEach(function (category) {
        category.orderBy = count++;
      });
    };

    this.flatCategoryList = function (category, categories) {
      categories.push(category);

      category.children.forEach(function (category) {
        $this.flatCategoryList(category, categories);
      });
    };

    this.getItemCategories = function () {
      return categoryFactory.getCategoryList({
        expand: true,
        sortBy: 'ASC',
        sortOn: 'orderBy',
        parentId: 0
      }).then($this.setItemCategories);
    };

    this.getItems = function () {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      return itemsFactory.getItemsList(payload, true).then($this.setItems);
    };

    this.setItems = function (dataFromAPI) {
      $scope.itemList = angular.copy(dataFromAPI.masterItems);
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        salesTargetFactory.getSalesTargetById($routeParams.id).then($this.salesTargetSuccess);
      } else {
        $scope.isLoadingCompleted = true;
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

    };

    this.makeInitPromises = function() {
      var promises = [
        $this.getSalesTargetCategories(),
        $this.getSchedules(),
        $this.getStores(),
        $this.getEmployees(),
        $this.getStations(),
        $this.getItemCategories(),
        $this.getItems(),
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    $this.init();

  });
