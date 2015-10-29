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
    storeInstanceWizardConfig, $location, schedulesService, menuCatererStationsService, lodash, $route) {

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

    this.isActionState = function(action) {
      return $routeParams.action === action;
    };

    this.isDispatchOrRedispatch = function() {
      return (this.isActionState('dispatch') || this.isActionState('redispatch'));
    };

    this.isEndInstanceOrRedispatch = function() {
      return (this.isActionState('end-instance') || this.isActionState('redispatch'));
    };

    this.setStoreInstancesOnFloor = function(dataFromAPI) {
      $scope.storeInstancesOnFloor = angular.copy(dataFromAPI.response);
    };

    this.getInstancesOnFloor = function() {
      var query = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        statusId: 10
      };
      return storeInstanceFactory.getStoreInstancesList(query).then($this.setStoreInstancesOnFloor);
    };

    this.setReplenishInstance = function(storeDetailsJSON) {
      if (storeDetailsJSON.replenishStoreInstanceId) {
        $scope.formData.replenishStoreInstanceId = $scope.storeDetails.replenishStoreInstanceId;
        $scope.formData.cateringStationId = storeDetailsJSON.cateringStationId.toString();
        $scope.formData.menus = storeDetailsJSON.parentStoreInstance.menus;
        return;
      }
      delete $scope.formData.scheduleNumber;
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      if ($this.isActionState('replenish')) {
        $this.setReplenishInstance(storeDetailsJSON);
      }
    };

    this.getStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getFormattedDatesPayload = function() {
      return {
        startDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate)
      };
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getCatererStationList = function() {
      return storeInstanceFactory.getCatererStationList().then(this.setCatererStationList);
    };

    this.setMenuCatererList = function(dataFromAPI) {
      $scope.menuCatererList = angular.copy(dataFromAPI.companyMenuCatererStations);
    };

    this.removeInvalidMenus = function() {
      angular.forEach($scope.formData.menus, function(menu) {
        var validMenu = $scope.filteredMenuList.filter(function(filteredMenu) {
          return filteredMenu.id === menu.id;
        });
        if (validMenu.length === 0) {
          var index = $scope.formData.menus.indexOf(menu);
          $scope.formData.menus.splice(index, 1);
        }
      });
    };

    this.filterMenusList = function() {
      $scope.filteredMenuList = [];
      angular.forEach($scope.menuCatererList, function(menuCaterer) {
        var filteredMenu = lodash.findWhere($scope.menuMasterList, {
          id: menuCaterer.menuId
        });
        if (filteredMenu) {
          $scope.filteredMenuList.push(filteredMenu);
        }
      });
      if ($this.isDispatchOrRedispatch() && angular.isDefined($scope.formData.cateringStationId)) {
        $this.removeInvalidMenus();
      }
    };

    this.generateNewMenu = function(menu) {
      var newMenu = {
        id: menu.menuMasterId
      };
      var existingMenu = $scope.filteredMenuList.filter(function(menuMaster) {
        return menuMaster.id === menu.menuMasterId;
      })[0];
      if (angular.isDefined(existingMenu)) {
        newMenu.menuCode = existingMenu.menuCode;
      }
      return newMenu;
    };

    this.setStoreInstanceMenus = function() {
      var newMenus = [];
      angular.forEach($scope.formData.menus, function(menu) {
        var newMenu = $this.generateNewMenu(menu);
        newMenus.push(newMenu);
      });
      $scope.formData.menus = newMenus;
    };

    this.getMenuCatererList = function() {
      var payload = angular.extend({}, $this.getFormattedDatesPayload(), {
        catererStationId: $scope.formData.cateringStationId
      });
      if ($routeParams.action === 'replenish') {
        payload.catererStationId = $scope.formData.dispatchedCateringStationId;
      }
      return menuCatererStationsService.getRelationshipList(payload).then($this.setMenuCatererList);
    };

    this.setMenuMasterList = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
    };

    this.getMenuMasterList = function() {
      var query = this.getFormattedDatesPayload();
      return storeInstanceFactory.getMenuMasterList(query).then($this.setMenuMasterList);
    };

    this.setCarrierNumbers = function(dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getCarrierNumbers = function() {
      return storeInstanceFactory.getAllCarrierNumbers(companyId).then($this.setCarrierNumbers);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.getStoresList = function() {
      var query = this.getFormattedDatesPayload();
      query.readyToUse = ($routeParams.action !== 'replenish');
      return storeInstanceFactory.getStoresList(query).then($this.setStoresList);
    };

    this.successMessage = function(response, action) {
      $this.showMessage('success', 'Store ' +
        $routeParams.action + ' ' + response.id + ' ' +
        (action ? action : 'created') + '!');
    };

    this.exitOnSave = function(response) {
      $this.hideLoadingModal();
      $this.successMessage(response[0], 'saved');
      $location.url('/store-instance-dashboard/');
    };

    this.findStatusObject = function(stepObject) {
      if (stepObject) {
        return lodash.findWhere($scope.storeDetails.statusList, {
          name: stepObject.stepName
        });
      }
    };

    this.updateStatusToStep = function(stepObject) {
      var statusObject = this.findStatusObject(stepObject);
      return storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusObject.name);
    };

    this.updateStoreInstanceSuccessHandler = function(response) {
      $this.successMessage(response, 'updated');
      $this.hideLoadingModal();
      $location.url($this.nextStep.uri);
    };

    this.determineNextStepURI = function(response) {
      var uri = $this.nextStep.uri.replace('undefined', response.id);
      if ($routeParams.action !== 'dispatch') {
        uri = $this.nextStep.uri.replace(/[0-9]+/, response.id);
      }
      return uri;
    };

    this.createStoreInstanceSuccessHandler = function(response) {
      $this.successMessage(response[0]);
      var uri = $this.determineNextStepURI(response[0]);
      $this.hideLoadingModal();
      $location.url(uri);
    };

    this.createStoreInstanceErrorHandler = function(response) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = response;
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

    this.formatEndInstancePayload = function(payload) {
      payload.menus = this.formatMenus(payload.menus);
      payload.inboundStationId = angular.copy(payload.cateringStationId);
      delete payload.dispatchedCateringStationId;
    };

    this.formatDispatchPayload = function(payload) {
      payload.menus = this.formatMenus(payload.menus);
      if ($routeParams.storeId) {
        delete payload.dispatchedCateringStationId;
      }
    };

    this.formatRedispatchPayload = function(payload) {
      payload.prevStoreInstanceId = $routeParams.storeId;
      payload.menus = this.formatMenus(payload.menus);
      delete payload.dispatchedCateringStationId;
    };

    this.formatReplenishPayload = function(payload) {
      if (!$scope.formData.replenishStoreInstanceId) {
        payload.replenishStoreInstanceId = $routeParams.storeId;
      }
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

    this.setPrevInstanceWizardSteps = function() {
      $scope.prevInstanceWizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.prevInstanceWizardSteps, {
        controllerName: 'Create'
      });
      $this.prevInstanceNextStep = angular.copy($scope.prevInstanceWizardSteps[currentStepIndex]);
    };

    this.formatPayload = function(action) {
      var payload = angular.copy($scope.formData);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      payload.scheduleNumber = payload.scheduleNumber.scheduleNumber;
      var actionSwitch = (action ? action : $routeParams.action);
      switch (actionSwitch) {
        case 'replenish':
          $this.formatReplenishPayload(payload);
          break;
        case 'redispatch':
          $this.formatRedispatchPayload(payload);
          break;
        case 'end-instance':
          $this.formatEndInstancePayload(payload);
          break;
        default:
          $this.formatDispatchPayload(payload);
          break;
      }
      return payload;
    };

    this.determineMinDate = function() {
      var diff = dateUtility.diff(
        dateUtility.nowFormatted(),
        $scope.formData.scheduleDate
      );
      var dateString = diff.toString() + 'd';
      if (diff >= 0) {
        dateString = '+' + dateString;
      }
      return dateString;
    };

    this.isStepOneFromStepTwo = function(apiData) {
      return (angular.isNumber(apiData.prevStoreInstanceId));
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
      if ($this.isStepOneFromStepTwo(apiData)) {
        $scope.stepOneFromStepTwo = true;
        $scope.prevStoreInstanceId = apiData.prevStoreInstanceId;
      }
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

    this.exitToDashboard = function() {
      this.displayLoadingModal('Loading Store Instance Dashboard');
      $location.url('/store-instance-dashboard/');
    };

    this.updateStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      var payload = this.formatPayload();
      return storeInstanceFactory.updateStoreInstance($routeParams.storeId, payload).then(
        (saveAndExit ? this.exitOnSave : this.updateStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.makeRedispatchPromises = function() {
      var prevInstanceStatus = Math.abs(parseInt($this.prevInstanceNextStep.storeOne.stepName) + 1).toString();
      var payload = this.formatPayload('end-instance');
      return [
        storeInstanceFactory.updateStoreInstance($routeParams.storeId,payload),
        storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, prevInstanceStatus)
      ];
    };

    this.checkForOnFloorInstance = function() {
      if ($scope.storeInstancesOnFloor) {
        var onFloorInstance = $scope.storeInstancesOnFloor.filter(function(instance) {
          return (instance.storeId === parseInt($scope.formData.storeId));
        });
        return onFloorInstance[0];
      }
    };

    $scope.goToActionState = function(actionState) {
      if (actionState) {
        $route.updateParams({
          action: actionState,
          storeId: $scope.onFloorInstance.id
        });
      }
      return;
    };

    this.displayConfirmDialog = function() {
      angular.element('#confirmation-modal').modal('show');
    };

    this.makeCreatePromises = function() {
      var payload = this.formatPayload();
      var promises = [];
      promises.push(storeInstanceFactory.createStoreInstance(payload));
      return promises;
    };

    this.createStoreInstance = function(saveAndExit) {
      if ($this.isActionState('dispatch')) {
        $scope.onFloorInstance = $this.checkForOnFloorInstance();
        if (angular.isDefined($scope.onFloorInstance) && $scope.onFloorInstance.id) {
          $this.displayConfirmDialog();
          return;
        }
      }
      this.displayLoadingModal('Creating new Store Instance');
      var promises = $this.makeCreatePromises();
      $q.all(promises).then(
        (saveAndExit ? this.exitOnSave : this.createStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.invokeStoreInstanceStatusPromises = function(updateInstanceStatusPromises, saveAndExit) {
      $q.all(updateInstanceStatusPromises).then(
        (saveAndExit ? $this.exitOnSave : $this.createStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };


    this.makeEditPromises = function(actionOne, actionTwo) {
      var payload;
      var prevPayload;
      if (!actionOne && !actionTwo) {
        payload = this.formatPayload();
      }
      if (actionOne) {
        payload = this.formatPayload(actionOne);
      }
      if (actionTwo) {
        prevPayload = this.formatPayload(actionTwo);
      }
      var promises = {
        updateInstancePromises: [],
        updateInstanceStatusPromises: []
      };
      promises.updateInstancePromises.push(storeInstanceFactory.updateStoreInstance($routeParams.storeId, payload));
      promises.updateInstanceStatusPromises.push(storeInstanceFactory.updateStoreInstanceStatus(
        $routeParams.storeId, $this.nextStep.stepName, $scope.formData.cateringStationId
      ));
      if ($scope.prevStoreInstanceId && actionTwo) {
        promises.updateInstancePromises.push(storeInstanceFactory.updateStoreInstance($scope.prevStoreInstanceId, prevPayload));
        promises.updateInstanceStatusPromises.push(storeInstanceFactory.updateStoreInstanceStatus(
          $scope.prevStoreInstanceId, $this.nextStep.storeOne.stepName
        ));
      }
      return promises;
    };

    this.endStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Starting the End Instance process');
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('end-instance', 'redispatch');
      $q.all(promises.updateInstancePromises).then(function() {
          $this.invokeStoreInstanceStatusPromises(promises.updateInstanceStatusPromises, saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.redispatchStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Redispatching Store Instance ' + $routeParams.storeId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeCreatePromises();
      promises.concat($this.makeRedispatchPromises());
      $q.all(promises).then(
        (saveAndExit ? this.exitOnSave : this.createStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.editRedispatchedStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Updating Current Store Instance ' + $routeParams.storeId +
        ' and Previous Store Instance ' + $scope.prevStoreInstanceId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('end-instance', 'redispatch');
      $q.all(promises.updateInstancePromises).then(function() {
          $this.invokeStoreInstanceStatusPromises(promises.updateInstanceStatusPromises, saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.editDispatchedStoreInstance = function(saveAndExit) {
      this.displayLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('dispatch');
      $q.all(promises.updateInstancePromises).then(function() {
          $this.invokeStoreInstanceStatusPromises(promises.updateInstanceStatusPromises, saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.redispatchConditions = function(saveAndExit) {
      if ($scope.stepOneFromStepTwo) {
        $this.editRedispatchedStoreInstance(saveAndExit);
        return;
      }
      if (!$scope.stepOneFromStepTwo) {
        $this.redispatchStoreInstance(saveAndExit);
        return;
      }
    };

    this.submitFormConditions = function(saveAndExit) {
      if ($this.isActionState('end-instance')) {
        $this.endStoreInstance(saveAndExit);
        return;
      }
      if ($this.isActionState('replenish') && $scope.formData.replenishStoreInstanceId) {
        $this.updateStoreInstance(saveAndExit);
        return;
      }
      if ($this.isActionState('redispatch')) {
        return $this.redispatchConditions(saveAndExit);
      }
      if ($this.isActionState('dispatch') && $routeParams.storeId) {
        $this.editDispatchedStoreInstance(saveAndExit);
        return;
      }
      $this.createStoreInstance(saveAndExit);
    };

    $scope.submitForm = function(saveAndExit) {
      $scope.createStoreInstance.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.submitFormConditions(saveAndExit);
      }
      return false;
    };

    $scope.omitSelectedMenus = function(menu) {
      var selectedMenu = $scope.formData.menus.filter(function(existingMenu) {
        return (existingMenu.id === menu.id);
      });
      return (selectedMenu.length === 0);
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
      return $this.isActionState(action);
    };

    $scope.isEndInstanceOrRedispatch = function() {
      return $this.isEndInstanceOrRedispatch();
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
      $scope.scheduleNumbers = angular.copy(apiData.schedules);
    };

    this.getScheduleNumbers = function() {
      var datesForApi = $this.getFormattedDatesPayload();
      schedulesService.getSchedulesInDateRange(companyId, datesForApi.startDate, datesForApi.endDate)
        .then(this.setScheduleNumbers);
    };

    this.updateInstanceDependenciesSuccess = function() {
      $this.filterMenusList();
    };

    this.updateInstanceDependencies = function() {
      var updatePromises = [
        $this.getScheduleNumbers(),
      ];
      if ($this.isDispatchOrRedispatch()) {
        updatePromises.push(
          $this.getMenuMasterList(),
          $this.getMenuCatererList()
        );
      }
      if ($this.isActionState('dispatch')) {
        updatePromises.push($this.getStoresList());
      }
      $q.all(updatePromises).then(function() {
        $this.updateInstanceDependenciesSuccess();
      });
    };

    this.registerScopeWatchers = function() {
      $scope.$watch('formData.scheduleDate', function(newDate, oldDate) {
        if (newDate && newDate !== oldDate) {
          $this.updateInstanceDependencies();
        }
      });
      if ($this.isActionState('dispatch')) {
        $scope.$watch('formData.cateringStationId', function(newId, oldId) {
          if (angular.isUndefined(oldId) || newId && newId !== oldId) {
            $this.updateInstanceDependencies();
          }
        });
      }
      if ($this.isActionState('redispatch')) {
        $scope.$watch('formData.cateringStationId', function(newId, oldId) {
          if (newId && newId !== oldId) {
            $this.updateInstanceDependencies();
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
        $this.getInstancesOnFloor()
      ];
      if ($routeParams.storeId) {
        promises.push($this.getStoreDetails());
      }
      return promises;
    };

    this.initSuccessHandler = function() {
      $scope.minDate = $this.determineMinDate();
      $this.filterMenusList();
      if ($routeParams.storeId) {
        $this.setStoreInstanceMenus();
      }
      $this.setWizardSteps();
      if ($routeParams.action === 'redispatch') {
        $this.setPrevInstanceWizardSteps();
      }
      $this.setUIReady();
      $this.registerScopeWatchers();

    };

    this.init = function() {
      var loadingText = 'Hang tight, we are loading some data for you';
      if ($routeParams.storeId) {
        loadingText = 'We are loading Store Instance ' + $routeParams.storeId;
      }
      this.showLoadingModal(loadingText);
      if ($routeParams.storeId) {
        $this.getStoreInstance();
        return;
      }
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };
    this.init();
  });
