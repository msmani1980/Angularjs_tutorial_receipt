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

    this.setMenuCatererList = function(dataFromAPI) {
      $scope.filteredMenuList = [];
      angular.forEach(dataFromAPI.companyMenuCatererStations, function(menuCaterer) {
        var filteredMenu = lodash.findWhere($scope.menuMasterList, {
          id: menuCaterer.menuId
        });
        if (filteredMenu) {
          $scope.filteredMenuList.push(filteredMenu);
        }
      });
    };

    this.getMenuCatererList = function() {
      var payload = angular.extend({}, $this.getFormattedDatesPayload(), {
        catererStationId: $scope.formData.cateringStationId
      });
      if ($routeParams.action === 'replenish') {
        payload.catererStationId = $scope.formData.dispatchedCateringStationId;
      }
      menuCatererStationsService.getRelationshipList(payload).then($this.setMenuCatererList);
    };

    this.setMenuMasterList = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
      $this.menusFromApi();
    };

    this.getMenuMasterList = function() {
      var query = this.getFormattedDatesPayload();
      storeInstanceFactory.getMenuMasterList(query).then($this.setMenuMasterList);
    };

    this.setCarrierNumbers = function(dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getCarrierNumbers = function() {
      storeInstanceFactory.getAllCarrierNumbers(companyId).then($this.setCarrierNumbers);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.getStoresList = function() {
      var query = this.getFormattedDatesPayload();
      query.readyToUse = ($routeParams.action !== 'replenish');
      return storeInstanceFactory.getStoresList(query).then($this.setStoresList);
    };

    this.successMessage = function(response) {
      $this.hideLoadingModal();
      $this.showMessage('success', 'Store ' + $routeParams.action + ' ' + response.id + ' created!');
    };

    this.exitOnSave = function(response) {
      $this.hideLoadingModal();
      if (!$scope.isActionState('end-instance')) {
        $this.showMessage('success', 'Store Instance created id: ' + response.id);
      }
      $this.successMessage(response);
      $location.url('/store-instance-dashboard/');
    };

    this.createStoreInstanceSuccessHandler = function(response) {
      $this.successMessage(response);
      $location.url('/store-instance-packing/' + $routeParams.action + '/' + response.id);
    };

    this.endStoreInstanceSuccessHandler = function(response) {
      $this.hideLoadingModal();
      if (response.id) {
        $this.showMessage('success', 'End Store Instance id: ' + $routeParams.storeId);
        $location.url('/store-instance-seals/' + $routeParams.action + '/' + $routeParams.storeId);
      }
    };

    this.redispatchStoreInstanceSuccessHandler = function(response) {
      $this.hideLoadingModal();
      if (response) {
        $this.showMessage('success', 'Redispatch Instance id: ' + $routeParams.storeId);
        $location.url('/store-instance-seals/' + $routeParams.action + '/' + $routeParams.storeId);
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

    this.menusFromApi = function() {
      var newMenus = [];
      angular.forEach($scope.formData.menus, function(menu) {
        var newMenu = {
          id: menu.menuMasterId
        };
        var existingMenu = $scope.menuMasterList.filter(function(menuMaster) {
          return menuMaster.id === menu.menuMasterId;
        })[0];
        if (angular.isDefined(existingMenu)) {
          newMenu.menuCode = existingMenu.menuCode;
        }
        newMenus.push(newMenu);
      });
      $scope.formData.menus = newMenus;
    };

    this.formatDispatchPayload = function(payload) {
      payload.menus = this.formatMenus(payload.menus);
    };

    this.formatRedispatchPayload = function(payload) {
      payload.menus = this.formatMenus(payload.menus);
      delete payload.dispatchedCateringStationId;
    };

    this.formatReplenishPayload = function(payload) {
      payload.replenishStoreInstanceId = $routeParams.storeId;
      delete payload.storeId;
      delete payload.menus;
      delete payload.dispatchedCateringStationId;
    };
    this.setWizardSteps = function() {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: 'Create'
      });
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
    };

    this.formatPayload = function() {
      var payload = angular.copy($scope.formData);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      payload.scheduleNumber = payload.scheduleNumber.scheduleNumber;
      switch ($routeParams.action) {
        case 'replenish':
          $this.formatReplenishPayload(payload);
          break;
        case 'redispatch':
          $this.formatRedispatchPayload(payload);
          break;
        default:
          $this.formatDispatchPayload(payload);
          break;
      }
      return payload;
    };

    this.setStoreInstance = function(apiData) {
      $scope.formData = {
        dispatchedCateringStationId: (apiData.cateringStationId ? apiData.cateringStationId.toString() : null),
        scheduleDate: dateUtility.formatDate(apiData.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY'),
        scheduleNumber: {
          'scheduleNumber': angular.copy(apiData.scheduleNumber)
        },
        storeId: (apiData.storeId ? apiData.storeId.toString() : null),
        carrierId: (apiData.carrierId ? apiData.carrierId.toString() : null),
        menus: angular.copy(apiData.menus)
      };
      var promises = $this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.getStoreInstance = function() {
      storeInstanceFactory.getStoreInstance($routeParams.storeId).then($this.setStoreInstance);
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
      $scope.displayError = true;
      return false;
    };

    this.createStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Creating a store ' + $routeParams.action);
      var payload = this.formatPayload();
      if (!payload) {
        return false;
      }
      storeInstanceFactory.createStoreInstance(payload).then((saveAndExit ? this.exitOnSave : this.createStoreInstanceSuccessHandler),
        this.createStoreInstanceErrorHandler);
    };

    this.exitToDashboard = function() {
      this.displayLoadingModal('Loading Store Instance Dashboard');
      $location.url('/store-instance-dashboard/');
    };

    this.endStoreInstance = function(saveAndExit) {
      if (saveAndExit) {
        this.exitToDashboard();
      } else {
        this.displayLoadingModal('Loading Inbound Seals');
        storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, 6, $scope.formData.cateringStationId)
          .then((saveAndExit ? this.exitOnSave : this.endStoreInstanceSuccessHandler), this.createStoreInstanceErrorHandler);
      }
    };

    this.redispatchStoreInstance = function(saveAndExit) {
      if (saveAndExit) {
        this.exitToDashboard();
      } else {
        this.displayLoadingModal('Loading Inbound Seals');
        this.redispatchStoreInstanceSuccessHandler($routeParams.storeId);
      }
    };

    $scope.submitForm = function(saveAndExit) {
      $scope.createStoreInstance.$setSubmitted(true);
      if ($this.validateForm()) {
        if ($scope.isActionState('end-instance')) {
          $this.endStoreInstance(saveAndExit);
        } else if ($scope.isActionState('redispatch')) {
          $this.redispatchStoreInstance(saveAndExit);
        } else {
          $this.createStoreInstance(saveAndExit);
        }
      }
      return false;
    };

    $scope.validateInput = function(fieldName) {
      if ($scope.createStoreInstance[fieldName].$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }
      if ($scope.createStoreInstance[fieldName].$invalid || angular.isDefined($scope.createStoreInstance[
            fieldName]
          .$error.required)) {
        return 'has-error';
      }
      return 'has-success';
    };

    $scope.validateMenus = function() {
      if (angular.isUndefined($scope.createStoreInstance.menus) || $scope.createStoreInstance.menus.$pristine &&
        !$scope.createStoreInstance.$submitted) {
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

    $scope.isActionState = function(action) {
      return $routeParams.action === action;
    };

    $scope.isEndInstanceOrRedispatch = function() {
      if ($scope.isActionState('end-instance') || $scope.isActionState('redispatch')) {
        return true;
      }
    };

    $scope.menuPlaceholderText = function() {
      if ($routeParams.action !== 'dispatch') {
        return '';
      }
      var placeholder = 'Select one or more Menus';
      if ($scope.filteredMenuList.length === 0) {
        placeholder = 'No menus are available to select';
      }
      return placeholder;
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

    this.updateInstanceDependencies = function() {
      $this.getScheduleNumbers();
      if ($routeParams.action === 'dispatch') {
        $this.getMenuMasterList();
        $this.getMenuCatererList();
        $this.getStoresList();
      }
    };

    this.registerScopeWatchers = function() {
      $scope.$watch('formData.scheduleDate', function(newDate, oldDate) {
        if (newDate && newDate !== oldDate) {
          $this.updateInstanceDependencies();
        }
      });
      if ($routeParams.action === 'dispatch') {
        $scope.$watch('formData.cateringStationId', function(newId, oldId) {
          if (newId && oldId && newId !== oldId) {
            $this.getMenuMasterList();
            $this.getMenuCatererList();
          }
        });
      }
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
    };

    this.makeInitPromises = function() {
      var promises = [
        $this.getMenuMasterList(),
        $this.getMenuCatererList(),
        $this.getCatererStationList(),
        $this.getStoresList(),
        $this.getCarrierNumbers(),
        $this.getScheduleNumbers(),
      ];
      return promises;
    };

    this.initSuccessHandler = function() {
      $this.setUIReady();
      $this.registerScopeWatchers();
    };

    this.init = function() {
      var loadingText = 'Hang tight, we are loading some data for you';
      if ($routeParams.storeId) {
        loadingText = 'We are loading Store Instance ' + $routeParams.storeId;
      }
      this.showLoadingModal(loadingText);
      this.setWizardSteps();
      if ($routeParams.storeId) {
        $this.getStoreInstance();
        return;
      }
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.init();

  });
