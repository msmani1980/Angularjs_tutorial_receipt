'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceCreateCtrl
 * @description
 * # StoreInstanceCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceCreateCtrl',
  function($scope, $routeParams, $q, storeInstanceFactory, ngToast, dateUtility, GlobalMenuService,
    storeInstanceWizardConfig, $location, schedulesService, menuCatererStationsService, lodash) {

    $scope.cateringStationList = [];
    $scope.menuMasterList = [];
    $scope.filteredMenuList = [];
    $scope.carrierNumbers = [];
    $scope.storesList = [];
    $scope.scheduleNumbers = [];
    $scope.formData = {
      scheduleDate: dateUtility.nowFormatted(),
      menus: []
    };

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    var $this = this;

    this.getFormattedDatesPayload = function() {
      return {
        startDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate)
      };
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getCatererStationListPromise = function() {
      return storeInstanceFactory.getCatererStationList();
    };

    this.getCatererStationList = function() {
      $this.getCatererStationListPromise().then(this.setCatererStationList);
    };

    this.menuCatererResponseHandler = function(dataFromAPI) {
      $scope.filteredMenuList = [];
      $scope.formData.menus = [];
      angular.forEach(dataFromAPI.companyMenuCatererStations, function(menuCaterer) {
        var filteredMenu = lodash.findWhere($scope.menuMasterList, {
          id: menuCaterer.menuId
        });
        if (filteredMenu) {
          $scope.filteredMenuList.push(filteredMenu);
        }
      });
    };

    $scope.getMenuCatererList = function() {
      if (!$scope.formData.cateringStationId || !$scope.formData.scheduleDate) {
        return;
      }
      var payload = angular.extend({}, $this.getFormattedDatesPayload(), {
        catererStationId: $scope.formData.cateringStationId
      });
      menuCatererStationsService.getRelationshipList(payload).then($this.menuCatererResponseHandler);
    };

    this.menuMasterResponseHandler = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
      $scope.getMenuCatererList();
    };

    this.getMenuMasterListPromise = function() {
      var query = this.getFormattedDatesPayload();
      return storeInstanceFactory.getMenuMasterList(query);
    };

    this.getMenuMasterList = function() {
      $this.getMenuMasterListPromise().then(this.menuMasterResponseHandler);
    };

    this.setCarrierNumbers = function(dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getCarrierNumbersPromise = function() {
      return storeInstanceFactory.getAllCarrierNumbers(companyId);
    };

    this.getCarrierNumbers = function() {
      $this.getCarrierNumbersPromise().then(this.setCarrierNumbers);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.getStoresListPromise = function() {
      var query = this.getFormattedDatesPayload();
      if ($routeParams.action === 'dispatch') {
        query.readyToUse = true;
      }
      return storeInstanceFactory.getStoresList(query);
    };

    this.getStoresList = function() {
      $this.getStoresListPromise().then(this.setStoresList);
    };

    this.exitOnSave = function(response) {
      $this.hideLoadingModal();
      $this.showMessage('success', 'Store '+ $routeParams.action + ' ' + response.id +' created!');
      $location.url('/store-instance-dashboard/');
    };

    this.createStoreInstanceSuccessHandler = function(response) {
      $this.hideLoadingModal();
      if (response.id) {
        $this.showMessage('success', 'Store '+ $routeParams.action + ' ' + response.id + ' created!');
        $location.url('/store-instance-packing/' + $routeParams.action + '/' + response.id);
      }
    };

    this.createStoreInstanceErrorHandler = function(response) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      if (response.data) {
        $scope.formErrors = response.data;
        return false;
      }
      $scope.response500 = true;
      return false;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
      $scope.response500 = false;
    };

    this.formatMenus = function(menus) {
      var newMenus = [];
      angular.forEach(menus, function(menu) {
        newMenus.push({
          menuMasterId: menu.id
        });
      });
      return newMenus;
    };

    this.menusFromApi = function(menus) {
      var newMenus = [];
      angular.forEach(menus, function(menu) {
        var existingMenu = $scope.menuMasterList.filter(function(menuMaster) {
          return menuMaster.id === menu.menuMasterId;
        })[0];
        newMenus.push({
          id: menu.menuMasterId,
          menuCode: existingMenu.menuCode
        });
      });
      return newMenus;
    };

    this.formatDispatchPayload = function(payload) {
      payload.menus = this.formatMenus(payload.menus);
    };

    this.formatReplenishPayload = function(payload) {
      payload.replenishStoreInstanceId = $routeParams.storeId;
      delete payload.storeId;
      delete payload.menus;
    };

    this.formatPayload = function() {
      var payload = angular.copy($scope.formData);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      payload.scheduleNumber = payload.scheduleNumber.scheduleNumber;
      switch($routeParams.action) {
        case 'replenish':
          $this.formatReplenishPayload(payload);
        break;
        default:
          $this.formatDispatchPayload(payload);
        break;
      }
      return payload;
    };

    this.setStoreInstanceData = function(apiData) {
      $scope.formData = {
        cateringStationId: (apiData.cateringStationId ? apiData.cateringStationId.toString() : null),
        scheduleDate: dateUtility.formatDate(apiData.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY'),
        scheduleNumber: {
          'scheduleNumber': angular.copy(apiData.scheduleNumber)
        },
        storeId: (apiData.storeId ? apiData.storeId.toString() : null),
        carrierId: (apiData.carrierId ? apiData.carrierId.toString() : null),
        menus: $this.menusFromApi(apiData.menus)
      };
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.showMessage = function(type, message) {
      ngToast.create({
        className: type,
        dismissButton: true,
        content: message
      });
    };

    this.validateForm = function() {
      this.resetErrors();
      if ($scope.createStoreInstance.$valid && $scope.formData.menus.length > 0) {
        return true;
      }
      if ($scope.isEndInstance()) {
        return true;
      }
      $scope.displayError = true;
      return false;
    };

    this.createStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Creating a store '+ $routeParams.action);
      var payload = this.formatPayload();
      if (!payload) {
        return false;
      }
      storeInstanceFactory.createStoreInstance(payload).then((saveAndExit ? this.exitOnSave : this.createStoreInstanceSuccessHandler),
        this.createStoreInstanceErrorHandler);
    };

    $scope.submitForm = function(saveAndExit) {
      $scope.createStoreInstance.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.createStoreInstance(saveAndExit);
      }
      return false;
    };

    $scope.validateInput = function(fieldName) {
      if ($scope.createStoreInstance[fieldName].$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }
      if ($scope.createStoreInstance[fieldName].$invalid || angular.isDefined($scope.createStoreInstance[fieldName]
          .$error.required)) {
        return 'has-error';
      }
      return 'has-success';
    };

    $scope.validateMenus = function() {
      if (angular.isUndefined($scope.createStoreInstance.menus) || $scope.createStoreInstance.menus.$pristine && !
        $scope.createStoreInstance.$submitted) {
        return '';
      }
      if ($scope.formData.menus.length === 0) {
        $scope.createStoreInstance.menus.$setValidity('required', false);
        return 'has-error';
      }
      $scope.createStoreInstance.menus.$setValidity('required', true);
      return 'has-success';
    };

    $scope.saveAndExit = function() {
      return $scope.submitForm(true);
    };

    $scope.isEndInstance = function() {
      return $routeParams.action === 'end-instance';
    };

    $scope.isReplenish = function() {
      return $routeParams.action === 'replenish';
    };

    this.setScheduleNumbers = function(apiData) {
      if (!apiData || !apiData.meta.count) {
        return;
      }
      $scope.scheduleNumbers = angular.copy(apiData.schedules);
    };

    this.getScheduleNumbersPromise = function() {
      var datesForApi = this.getFormattedDatesPayload();
      return schedulesService.getSchedulesInDateRange(companyId, datesForApi.startDate,
        datesForApi.endDate);
    };

    this.getScheduleNumbers = function() {
      $scope.scheduleNumbers = [];
      if (!$scope.formData.scheduleDate) {
        this.setScheduleNumbers();
        return;
      }
      $this.getScheduleNumbersPromise().then($this.setScheduleNumbers);
    };

    this.registerScopeWatchers = function() {
      $scope.$watch('formData.scheduleDate', function(newDate, oldDate) {
        if (newDate && newDate !== oldDate) {
          delete $scope.formData.storeId;
          delete $scope.formData.scheduleNumber;
          $this.getMenuMasterList();
          $this.getStoresList();
          $this.getScheduleNumbers();
        }
      });
    };

    this.setDependencies = function(response) {
      $this.menuMasterResponseHandler(response[0]);
      $this.setCatererStationList(response[1]);
      $this.setStoresList(response[2]);
      $this.setCarrierNumbers(response[3]);
      $this.setScheduleNumbers(response[4]);
      $this.setStoreInstanceData(response[5]);
    };

    this.getLoadStorePromises = function() {
      return [
        $this.getMenuMasterListPromise(),
        $this.getCatererStationListPromise(),
        $this.getStoresListPromise(),
        $this.getCarrierNumbersPromise(),
        $this.getScheduleNumbersPromise(),
        storeInstanceFactory.getStoreInstance($routeParams.storeId)
      ];
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setUIReady = function() {
      $scope.uiSelectTemplateReady = true;
      $this.hideLoadingModal();
      $this.registerScopeWatchers();
    };

    // TODO: Refactor this to just push dependencyPromises
    this.loadStoreInstance = function() {
      $this.showLoadingModal('We are loading the Store Instance!');
      var dependencyPromises = this.getLoadStorePromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
        $this.setUIReady();
      });
    };

    this.init = function() {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      if ($routeParams.storeId) {
        this.loadStoreInstance();
      } else {
        this.getCatererStationList();
        this.getMenuMasterList();
        this.getStoresList();
        this.getCarrierNumbers();
        this.getScheduleNumbers();
        $this.setUIReady();
      }
    };
    this.init();

  });
