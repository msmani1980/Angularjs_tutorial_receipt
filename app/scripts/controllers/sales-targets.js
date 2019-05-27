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

      if ($this.stationsHasDuplicates()) {
        $this.showCantHaveDuplicatesError('Stations');
        return false;
      }

      if ($this.departureTimesHasDuplicates()) {
        $this.showCantHaveDuplicatesError('Departure Times');
        return false;
      }

      if ($this.departureDatesHasDuplicates()) {
        $this.showCantHaveDuplicatesError('Departure Dates');
        return false;
      }

      return $scope.salesTargetDataForm.$valid;
    };

    this.stationsHasDuplicates = function() {
      var ids = $scope.salesTarget.stations.map(function (station) {
        var departureId = (station.departure) ? station.departure.id : null;
        var arrivalId =  (station.arrival) ? station.arrival.id : null;

        return departureId + '-' + arrivalId;
      });

      return lodash.uniq(ids).length !== ids.length;
    };

    this.departureTimesHasDuplicates = function() {
      var ids = $scope.salesTarget.departureTimes.map(function (departureTime) {
        return $this.safeString(departureTime.from) + '-' + $this.safeString(departureTime.to);
      });

      return lodash.uniq(ids).length !== ids.length;
    };

    this.departureDatesHasDuplicates = function() {
      var ids = $scope.salesTarget.departureDates.map(function (departureDate) {
        return $this.safeString(departureDate.from) + '-' + $this.safeString(departureDate.to);
      });

      return lodash.uniq(ids).length !== ids.length;
    };

    this.showCantHaveDuplicatesError = function (field) {
      $scope.errorCustom = [{
        field: field,
        value: 'Can\'t have duplicates'
      }];
      $scope.displayError = true;
    };

    this.safeString = function (value) {
      if (!value) {
        return '';
      }

      return value;
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
        schedules: $this.mapSchedulePayload(),
        stores: $this.mapStoresPayload(),
        crews: $this.mapCrewsPayload(),
        stations: $this.mapStationsPayload(),
        departureTimes: $this.mapDepartureTimesPayload(),
        departureDates: $this.mapDepartureDatesPayload(),
        categories: $this.mapCategoriesPayload(),
        items: $this.mapItemsPayload()
      };

      salesTargetFactory.createSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
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
        schedules: $this.mapSchedulePayload(),
        stores: $this.mapStoresPayload(),
        crews: $this.mapCrewsPayload(),
        stations: $this.mapStationsPayload(),
        departureTimes: $this.mapDepartureTimesPayload(),
        departureDates: $this.mapDepartureDatesPayload(),
        categories: $this.mapCategoriesPayload(),
        items: $this.mapItemsPayload()
      };

      salesTargetFactory.updateSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    this.mapSchedulePayload = function () {
      return $scope.salesTarget.schedules.map(function (schedule) {
        var persistedSchedule = lodash.find($scope.persistedSalesTarget.schedules, { scheduleNumber: schedule.scheduleNumber });

        return {
          id: (persistedSchedule) ? persistedSchedule.id : null,
          scheduleNumber: schedule.scheduleNumber
        };
      });
    };

    this.mapStoresPayload = function () {
      return $scope.salesTarget.stores.map(function (store) {
        var persistedStore = lodash.find($scope.persistedSalesTarget.stores, { storeId: store.id });

        return {
          id: (persistedStore) ? persistedStore.id : null,
          storeId: store.id
        };
      });
    };

    this.mapCrewsPayload = function () {
      return $scope.salesTarget.employees.map(function (employee) {
        var persistedEmployee = lodash.find($scope.persistedSalesTarget.crews, { crewId: employee.id });

        return {
          id: (persistedEmployee) ? persistedEmployee.id : null,
          crewId: employee.id
        };
      });
    };

    this.mapStationsPayload = function () {
      return $scope.salesTarget.stations
        .filter(function (station) {
          return station.departure || station.arrival;
        })
        .map(function (station) {
          return {
            id: station.entityId,
            departureStationId: (station.departure) ? station.departure.stationId : null,
            arrivalStationId: (station.arrival) ? station.arrival.stationId : null
          };
        });
    };

    this.mapDepartureTimesPayload = function () {
      return $scope.salesTarget.departureTimes
        .filter(function (departureTime) {
          return departureTime.from || departureTime.to;
        })
        .map(function (departureTime) {
          return {
            id: departureTime.entityId,
            timeFrom: departureTime.from,
            timeTo: departureTime.to
          };
        });
    };

    this.mapDepartureDatesPayload = function () {
      return $scope.salesTarget.departureDates
        .filter(function (departureDate) {
          return departureDate.from || departureDate.to;
        })
        .map(function (departureDate) {
          return {
            id: departureDate.entityId,
            dateFrom: (departureDate.from) ? dateUtility.formatDateForAPI(departureDate.from) : null,
            dateTo: (departureDate.to) ? dateUtility.formatDateForAPI(departureDate.to) : null
          };
        });
    };

    this.mapCategoriesPayload = function () {
      return $scope.salesTarget.itemCategories
        .filter(function (itemCategory) {
          return itemCategory.value;
        })
        .map(function (itemCategory) {
          var persistedItemCategory = lodash.find($scope.persistedSalesTarget.categories, { categoryId: itemCategory.value.id });

          return {
            id: (persistedItemCategory) ? persistedItemCategory.id : null,
            categoryId: itemCategory.value.id
          };
        });
    };

    this.mapItemsPayload = function () {
      return $scope.salesTarget.items
        .filter(function (item) {
          return item.value;
        })
        .map(function (item) {
          var persistedItem = lodash.find($scope.persistedSalesTarget.items, { itemId: item.value.id });

          return {
            id: (persistedItem) ? persistedItem.id : null,
            itemId: item.value.id
          };
        });
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

    $scope.isItemCategoryNotInUse = function(itemCategory) {
      return !lodash.find($scope.salesTarget.itemCategories, function (categoryFromList) {
          return categoryFromList.value && categoryFromList.value.id === itemCategory.id
      });
    };

    $scope.isItemNotInUse = function(item) {
      return !lodash.find($scope.salesTarget.items, function (itemFromList) {
          return itemFromList.value && itemFromList.value.id === item.id
      });
    };

    this.salesTargetSuccess = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI);

      $scope.persistedSalesTarget = response;

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
        category: $this.findItemById($scope.salesTargetCategoryList, response.targetCategoryId),
        value: response.targetValue,
        schedules: response.schedules.map(function (item) { return $this.mapScheduleFromResponse(item) }),
        stores: response.stores.map(function (item) { return $this.mapStoreFromResponse(item) }),
        employees: response.crews.map(function (item) { return $this.mapEmployeeFromResponse(item) }),
        stations: response.stations.map(function (item) { return $this.mapStationFromResponse(item) }),
        departureTimes: response.departureTimes.map(function (item) { return $this.mapDepartureTimeFromResponse(item) }),
        departureDates: response.departureDates.map(function (item) { return $this.mapDepartureDateFromResponse(item) }),
        itemCategories: response.categories.map(function (item) { return $this.mapItemCategoryFromResponse(item) }),
        items: response.items.map(function (item) { return $this.mapItemFromResponse(item) })
      };

      $scope.isLoadingCompleted = true;
    };

    this.findItemById = function (array, id) {
      return lodash.find(array, { id: id });
    };

    this.mapScheduleFromResponse = function (schedule) {
      return lodash.find($scope.scheduleList, { scheduleNumber: schedule.scheduleNumber });
    };

    this.mapStoreFromResponse = function (store) {
      return lodash.find($scope.storeList, { id: store.storeId });
    };

    this.mapEmployeeFromResponse = function (employee) {
      return lodash.find($scope.employeeList, { id: employee.crewId });
    };

    this.mapStationFromResponse = function (station) {
      return {
        entityId: station.id,
        departure: lodash.find($scope.stationList, { stationId: station.departureStationId }),
        arrival: lodash.find($scope.stationList, { stationId: station.arrivalStationId })
      };
    };

    this.mapDepartureTimeFromResponse = function (departureTime) {
      return {
        entityId: departureTime.id,
        from: departureTime.timeFrom,
        to: departureTime.timeTo
      };
    };

    this.mapDepartureDateFromResponse = function (departureDate) {
      return {
        entityId: departureDate.id,
        from: (departureDate.dateFrom) ? dateUtility.formatDateForApp(departureDate.dateFrom) : null,
        to: (departureDate.dateTo) ? dateUtility.formatDateForApp(departureDate.dateTo) : null
      };
    };

    this.mapItemCategoryFromResponse = function (itemCategory) {
      return {
        entityId: itemCategory.id,
        value: lodash.find($scope.itemCategoryList, { id: itemCategory.categoryId })
      };
    };

    this.mapItemFromResponse = function (item) {
      return {
        entityId: item.id,
        value: lodash.find($scope.itemList, { id: item.itemId })
      };
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
        $this.getItems()
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
