'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceCreateCtrl
 * @description
 * # StoreInstanceCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceCreateCtrl',
  function($scope, $routeParams, $q, storeInstanceFactory, sealTypesService, storeInstanceAssignSealsFactory, ngToast,
    dateUtility, GlobalMenuService, storeInstanceWizardConfig, $location, schedulesService,
    menuCatererStationsService, lodash, $route, $filter) {

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

    // TODO: Refactor so the company object is returned, right now it's returning a number so ember will play nice
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

    this.isEditingDispatch = function() {
      return this.isActionState('dispatch') && angular.isDefined($routeParams.storeId);
    };

    this.isEditingRedispatch = function() {
      return this.isActionState('redispatch') && angular.isDefined($routeParams.storeId);
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
        $scope.formData.replenishStoreInstanceId = storeDetailsJSON.replenishStoreInstanceId;
        $scope.formData.cateringStationId = storeDetailsJSON.cateringStationId.toString();
        $scope.formData.menus = storeDetailsJSON.parentStoreInstance.menus;
        return;
      }
      if (!$scope.isStepOneFromStepTwo) {
        delete $scope.formData.scheduleNumber;
      }
    };

    this.formatCurrentStoreForStoreList = function(store) {
      var currentStore = {
        companyId: store.companyId,
        endDate: null,
        id: $scope.storeDetails.storeId,
        readyToUse: true,
        startDate: $scope.storeDetails.scheduleDate,
        storeNumber: $scope.storeDetails.storeNumber
      };
      return currentStore;
    };

    this.addCurrentStoreToStoreList = function() {
      if ($scope.storesList && $scope.storeDetails) {
        var currentStoreArray = [];
        var filteredStore;
        angular.forEach($scope.storesList, function(store) {
          if (store.id !== $scope.storeDetails.storeId) {
            var currentStore = $this.formatCurrentStoreForStoreList(store);
            currentStoreArray.push(currentStore);
            filteredStore = $filter('unique')(currentStoreArray, 'storeNumber');
          }
        });
        if (angular.isDefined(filteredStore)) {
          $scope.storesList.push(filteredStore[0]);
        }
      }
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = angular.copy(storeDetailsJSON);
      if ($this.isActionState('replenish')) {
        $this.setReplenishInstance(storeDetailsJSON);
      }
      if ($this.isActionState('redispatch')) {
        $this.getPrevStoreDetails();
      }
      if ($this.isEditingDispatch()) {
        $this.addCurrentStoreToStoreList();
      }
    };

    this.setPrevStoreDetails = function(storeDetailsJSON) {
      $scope.prevStoreDetails = storeDetailsJSON;
    };

    this.getStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getPrevStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($scope.storeDetails.prevStoreInstanceId).then($this.setPrevStoreDetails);
    };

    this.getFormattedDatesPayload = function() {
      return {
        startDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate)
      };
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = angular.copy(dataFromAPI.response);
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
      $scope.carrierNumbers = angular.copy(dataFromAPI.response);
    };

    this.getCarrierNumbers = function() {
      return storeInstanceFactory.getAllCarrierNumbers(companyId).then($this.setCarrierNumbers);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = angular.copy(dataFromAPI.response);
    };

    this.determineReadyToUse = function() {
      return !this.isActionState('replenish');
    };

    this.getStoresList = function() {
      var query = this.getFormattedDatesPayload();
      query.readyToUse = this.determineReadyToUse();
      return storeInstanceFactory.getStoresList(query).then($this.setStoresList);
    };

    this.getItemsSuccessHandler = function(dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      $scope.itemsToDelete = [];
      angular.forEach(menuItems, function(item) {
        $scope.itemsToDelete.push(item);
      });
    };

    this.getPrevStoreItemsSuccessHandler = function(dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      $scope.prevStoreItemsToDelete = [];
      angular.forEach(menuItems, function(item) {
        $scope.prevStoreItemsToDelete.push(item);
      });
    };

    this.getStoreInstanceItems = function(storeInstanceId) {
      storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then($this.getItemsSuccessHandler);
    };

    this.getPrevStoreInstanceItems = function(storeInstanceId) {
      storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then($this.getPrevStoreItemsSuccessHandler);
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
      payload.cateringStationId = angular.copy(payload.dispatchedCateringStationId);
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
      if ($scope.existingSeals && $scope.userConfirmedDataLoss) {
        payload.note = '';
        payload.tampered = false;
      }
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
      if (apiData && apiData.prevStoreInstanceId) {
        return (angular.isNumber(apiData.prevStoreInstanceId));
      }
    };

    this.setCateringStationId = function(apiData) {
      if (apiData && apiData.cateringStationId) {
        return apiData.cateringStationId.toString();
      }
      return null;
    };

    this.setScheduleDate = function(apiData) {
      if (apiData && apiData.scheduleDate) {
        return dateUtility.formatDate(apiData.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
      }
      return null;
    };

    this.setScheduleNumber = function(apiData) {
      var scheduleNumber = {};
      if (apiData && apiData.scheduleNumber) {
        scheduleNumber = {
          scheduleNumber: apiData.scheduleNumber
        };
        return scheduleNumber;
      }
      return undefined;
    };

    this.setStoreNumber = function(apiData) {
      if (apiData && apiData.storeNumber) {
        return apiData.storeNumber.toString();
      }
      return null;
    };

    this.setStoreId = function(apiData) {
      if (apiData && apiData.storeId) {
        return apiData.storeId.toString();
      }
      return null;
    };

    this.setCarrierId = function(apiData) {
      if (apiData && apiData.carrierId) {
        return apiData.carrierId.toString();
      }
      return null;
    };

    this.setMenus = function(apiData) {
      if (apiData && apiData.menus) {
        return apiData.menus;
      }
      return null;
    };

    this.setPrevStoreInstanceId = function(apiData) {
      if (apiData && apiData.prevStoreInstanceId) {
        return apiData.prevStoreInstanceId;
      }
      return null;
    };

    this.setStoreInstance = function(apiData) {
      if (angular.isObject(apiData)) {
        var data = angular.copy(apiData);
        $scope.formData = {
          dispatchedCateringStationId: $this.setCateringStationId(data),
          scheduleDate: $this.setScheduleDate(data),
          scheduleNumber: $this.setScheduleNumber(data),
          storeId: $this.setStoreId(data),
          carrierId: $this.setCarrierId(data),
          menus: $this.setMenus(data),
          cateringStationId: $this.setCateringStationId(data),
          storeNumber: $this.setStoreNumber(data)
        };
        if ($this.isStepOneFromStepTwo(data)) {
          $scope.stepOneFromStepTwo = true;
          $scope.prevStoreInstanceId = $this.setPrevStoreInstanceId(data);
        }
      }
      var promises = $this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.getStoreInstance = function() {
      storeInstanceFactory.getStoreInstance($routeParams.storeId).then($this.setStoreInstance);
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.getSealTypes = function() {
      return sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.setStoreInstanceSeals = function(dataFromAPI) {
      $scope.currentStoreExistingSeals = angular.copy(dataFromAPI.response);
    };

    this.setPrevStoreInstanceSeals = function(dataFromAPI) {
      $scope.prevStoreExistingSeals = angular.copy(dataFromAPI.response);
    };

    this.getStoreInstanceSeals = function(storeInstanceId) {
      if (storeInstanceId === $routeParams.storeId) {
        return storeInstanceAssignSealsFactory.getStoreInstanceSeals(storeInstanceId).then($this.setStoreInstanceSeals);
      }
      if (storeInstanceId === $scope.prevStoreInstanceId) {
        return storeInstanceAssignSealsFactory.getStoreInstanceSeals(storeInstanceId).then($this.setPrevStoreInstanceSeals);
      }
    };

    this.setExistingSeals = function() {
      var existingSeals = [];
      if ($scope.currentStoreExistingSeals) {
        angular.forEach($scope.currentStoreExistingSeals, function(seal) {
          existingSeals.push(seal);
        });
      }
      if ($scope.prevStoreExistingSeals) {
        angular.forEach($scope.prevStoreExistingSeals, function(seal) {
          existingSeals.push(seal);
        });
      }
      $scope.existingSeals = existingSeals;
    };

    this.formatExistingSeals = function(sealsList) {
      var formattedSeals = [];
      for (var key in sealsList) {
        var seal = sealsList[key];
        formattedSeals.push(seal.sealNumbers[0]);
      }
      return formattedSeals;
    };

    this.getExistingSeals = function(typeId) {
      if (!$scope.existingSeals) {
        return [];
      }
      var sealsList = $scope.existingSeals.filter(function(sealType) {
        return sealType.type === typeId;
      });
      return this.formatExistingSeals(sealsList);
    };

    this.generateSealTypeObject = function(sealType) {
      return {
        id: sealType.id,
        name: sealType.name,
        seals: {
          numbers: $this.getExistingSeals(sealType.id)
        }
      };
    };

    this.generateSealTypesList = function() {
      $scope.sealTypesList = [];
      angular.forEach($scope.sealTypes, function(sealType) {
        var sealTypeObject = $this.generateSealTypeObject(sealType);
        $scope.sealTypesList.push(sealTypeObject);
      });
    };

    this.getExistingSealsByType = function(typeId, storeId) {
      if (!$scope.existingSeals) {
        return;
      }
      var existingSealTypeObjects = $scope.existingSeals.filter(function(sealTypeObject) {
        return sealTypeObject.type === typeId && sealTypeObject.storeInstanceId === storeId;
      });
      var existingSeals = [];
      existingSealTypeObjects.forEach(function(sealTypeObject) {
        existingSeals.push(sealTypeObject.sealNumbers[0]);
      });
      return existingSeals;
    };

    this.determineSealsToDelete = function(sealTypeObject, storeId) {
      var existingSeals = this.getExistingSealsByType(sealTypeObject.id, storeId);
      var sealsToDelete = [];
      for (var key in existingSeals) {
        var sealNumber = existingSeals[key];
        sealsToDelete.push(sealNumber);
      }
      return sealsToDelete;
    };

    this.getExistingSealByNumber = function(sealNumber, sealType, storeId) {
      return $scope.existingSeals.filter(function(existingSeal) {
        return (existingSeal.sealNumbers[0] === sealNumber && existingSeal.type === parseInt(sealType) &&
          existingSeal.storeInstanceId === storeId);
      })[0];
    };

    this.makeDeleteSealsPromise = function(sealTypeObject, storeId) {
      var sealsToDelete = $this.determineSealsToDelete(sealTypeObject, storeId);
      if (sealsToDelete.length === 0) {
        return;
      }
      var deletePromises = [];
      for (var key in sealsToDelete) {
        var sealNumber = sealsToDelete[key];
        var existingSeal = this.getExistingSealByNumber(sealNumber, sealTypeObject.id, storeId);
        deletePromises.push(storeInstanceAssignSealsFactory.deleteStoreInstanceSeal(
          existingSeal.id,
          existingSeal.storeInstanceId
        ));
      }
      return deletePromises;
    };

    this.makeDeleteSealsPromises = function(storeId) {
      var promises = [];
      angular.forEach($scope.sealTypesList, function(sealTypeObject) {
        var deletePromises = $this.makeDeleteSealsPromise(sealTypeObject, storeId);
        if (deletePromises) {
          promises = promises.concat(deletePromises);
        }
      });
      return promises;
    };

    this.createPromiseToDeletePrevStoreItems = function() {
      var deleteItemsPromiseArray = [];
      if ($scope.prevStoreItemsToDelete) {
        angular.forEach($scope.prevStoreItemsToDelete, function(item) {
          deleteItemsPromiseArray.push(storeInstanceFactory.deleteStoreInstanceItem(item.storeInstanceId,
            item.id));
        });
        return deleteItemsPromiseArray;
      }
    };

    this.createPromiseToDeleteItems = function() {
      var deleteItemsPromiseArray = [];
      angular.forEach($scope.itemsToDelete, function(item) {
        deleteItemsPromiseArray.push(storeInstanceFactory.deleteStoreInstanceItem(item.storeInstanceId, item.id));
      });
      return deleteItemsPromiseArray;
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
      $scope.displayError = false;
      $scope.errorResponse = null;
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
      if ($scope.showDataLossWarning) {
        return $this.showWarningModal();
      }
      if ($scope.createStoreInstance.$valid && $scope.formData.menus.length > 0) {
        return true;
      }
      $scope.displayError = true;
      return false;
    };

    this.exitToDashboard = function() {
      this.showLoadingModal('Loading Store Instance Dashboard');
      $location.url('/store-instance-dashboard/');
    };

    this.updateStoreInstance = function(saveAndExit) {
      this.showLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      var payload = this.formatPayload();
      return storeInstanceFactory.updateStoreInstance($routeParams.storeId, payload).then(
        (saveAndExit ? this.exitOnSave : this.updateStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.parsePrevInstanceStatus = function() {
      return Math.abs(parseInt($this.prevInstanceNextStep.storeOne.stepName) + 1).toString();
    };

    this.makeRedispatchPromises = function() {
      var prevInstanceStatus = this.parsePrevInstanceStatus();
      var payload = this.formatPayload('end-instance');
      return {
        updateInstancePromises: [{
          f: storeInstanceFactory.updateStoreInstance,
          obj: storeInstanceFactory,
          args: [$routeParams.storeId, payload]
        }],
        updateInstanceStatusPromises: [{
          f: storeInstanceFactory.updateStoreInstanceStatus,
          obj: storeInstanceFactory,
          args: [$routeParams.storeId, prevInstanceStatus]
        }]
      };
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
      this.showLoadingModal('Creating new Store Instance');
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

    this.startPromise = function(preparedPromises) {
      return lodash.map(preparedPromises, function(promise) {
        return promise.f.apply(promise.obj, promise.args);
      });
    };

    this.createEditPromises = function(actionPayloadObj) {
      var promises = {
        updateInstancePromises: [],
        updateInstanceStatusPromises: []
      };
      promises.updateInstancePromises.push({
        f: storeInstanceFactory.updateStoreInstance,
        obj: storeInstanceFactory,
        args: [$routeParams.storeId, actionPayloadObj.payload]
      });
      promises.updateInstanceStatusPromises.push({
        f: storeInstanceFactory.updateStoreInstanceStatus,
        obj: storeInstanceFactory,
        args: [$routeParams.storeId, $this.nextStep.stepName, $scope.formData.cateringStationId]
      });
      if ($scope.prevStoreInstanceId && actionPayloadObj.actionTwo) {
        promises.updateInstancePromises.push({
          f: storeInstanceFactory.updateStoreInstance,
          obj: storeInstanceFactory,
          args: [$scope.prevStoreInstanceId, actionPayloadObj.prevPayload]
        });
        promises.updateInstanceStatusPromises.push({
          f: storeInstanceFactory.updateStoreInstanceStatus,
          obj: storeInstanceFactory,
          args: [$scope.prevStoreInstanceId, $this.nextStep.storeOne.stepName]
        });
      }
      return promises;
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
      var actionPayloadObj = {
        actionOne: actionOne,
        actionTwo: actionTwo,
        payload: payload,
        prevPayload: prevPayload
      };
      return $this.createEditPromises(actionPayloadObj);
    };

    this.endStoreInstance = function(saveAndExit) {
      this.showLoadingModal('Starting the End Instance process');
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('end-instance');
      $q.all($this.startPromise(promises.updateInstancePromises)).then(function() {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.redispatchStoreInstance = function(saveAndExit) {
      this.showLoadingModal('Redispatching Store Instance ' + $routeParams.storeId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeCreatePromises();
      var redispatchPromises = $this.makeRedispatchPromises();
      $q.all($this.startPromise(redispatchPromises.updateInstancePromises)).then(function() {
          $this.invokeStoreInstanceStatusPromises(promises.concat($this.startPromise(redispatchPromises.updateInstanceStatusPromises)),
            saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.removeAllDataForInstances = function() {
      return ($scope.existingSeals || $scope.itemsToDelete) && $scope.userConfirmedDataLoss;
    };

    this.editRedispatchedStoreInstance = function(saveAndExit) {
      this.showLoadingModal('Updating Current Store Instance ' + $routeParams.storeId +
        ' and Previous Store Instance ' + $scope.prevStoreInstanceId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('end-instance', 'redispatch');
      var deletePromises = [];
      if ($this.removeAllDataForInstances()) {
        deletePromises.push($this.makeDeleteSealsPromises(parseInt($routeParams.storeId)));
        deletePromises.push($this.makeDeleteSealsPromises($scope.prevStoreInstanceId));
        deletePromises.push($this.createPromiseToDeleteItems());
        deletePromises.push($this.createPromiseToDeletePrevStoreItems());
      }
      $q.all(deletePromises.concat($this.startPromise(promises.updateInstancePromises))).then(function() {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
        },
        $this.createStoreInstanceErrorHandler
      );
    };

    this.editDispatchedStoreInstance = function(saveAndExit) {
      this.showLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }
      var promises = $this.makeEditPromises('dispatch');
      var deletePromises = [];
      if ($this.removeAllDataForInstances()) {
        deletePromises.push($this.makeDeleteSealsPromises(parseInt($routeParams.storeId)));
        deletePromises.push($this.createPromiseToDeleteItems());
      }
      $q.all(deletePromises.concat($this.startPromise(promises.updateInstancePromises))).then(function() {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
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
      if (angular.isUndefined($scope.createStoreInstance.menus) || $scope.createStoreInstance.menus
        .$pristine &&
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

    $scope.proceedToStepTwo = function() {
      $this.hideWarningModal();
      $scope.showDataLossWarning = false;
      $scope.userConfirmedDataLoss = true;
      $scope.submitForm();
    };

    $scope.reloadRoute = function() {
      $this.hideWarningModal();
      $route.reload();
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
      if ($this.isDispatchOrRedispatch() && angular.isDefined($scope.formData.cateringStationId)) {
        $this.removeInvalidMenus();
      }
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

    this.registerMenusScopeWatchers = function() {
      return ($this.isActionState('redispatch') && $scope.stepOneFromStepTwo) || ($this.isActionState('dispatch') &&
        $routeParams.storeId);
    };

    this.checkIfMenusHaveChanged = function(newMenus) {
      angular.forEach($scope.storeDetails.menuList, function(originalMenu) {
        var menu = newMenus.filter(function(menu) {
          return menu.id === originalMenu.id;
        })[0];
        if (angular.isUndefined(menu)) {
          $scope.showDataLossWarning = true;
        } else {
          $scope.showDataLossWarning = false;
        }
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
      if ($this.registerMenusScopeWatchers()) {
        $scope.$watch('formData.menus', function(newMenus, oldMenus) {
          if (newMenus && newMenus !== oldMenus) {
            $this.checkIfMenusHaveChanged(newMenus);
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

    this.showWarningModal = function() {
      angular.element('#warning').modal('show');
    };

    this.hideWarningModal = function() {
      angular.element('#warning').modal('hide');
    };

    this.setUIReady = function() {
      $scope.uiSelectTemplateReady = true;
      $this.hideLoadingModal();
    };

    this.createInitPromises = function() {
      var promises = [
        $this.getMenuMasterList(),
        $this.getMenuCatererList(),
        $this.getCatererStationList(),
        $this.getStoresList(),
        $this.getCarrierNumbers(),
        $this.getScheduleNumbers(),
        $this.getInstancesOnFloor()
      ];
      return promises;
    };

    this.createEditInitPromises = function() {
      var promises = [
        $this.getSealTypes(),
        $this.getStoreInstanceSeals($routeParams.storeId),
        $this.getStoreInstanceItems($routeParams.storeId)
      ];
      if ($scope.prevStoreInstanceId) {
        promises.push(
          $this.getStoreInstanceSeals($scope.prevStoreInstanceId),
          $this.getPrevStoreInstanceItems($scope.prevStoreInstanceId)
        );
      }
      return promises;
    };

    this.makeInitPromises = function() {
      var promises = $this.createInitPromises();
      if ($this.isActionState('replenish')) {
        promises.push($this.getStoreDetails());
      }
      if ($this.isEditingDispatch() || $this.isEditingRedispatch()) {
        promises.push($this.getStoreDetails());
        promises.concat($this.createEditInitPromises());
      }
      return promises;
    };

    this.initSuccessHandlerMethods = function() {
      $scope.minDate = $this.determineMinDate();
      $this.filterMenusList();
      $this.setWizardSteps();
      if ($routeParams.storeId) {

        $this.setStoreInstanceMenus();
      }
      if ($this.isActionState('redispatch')) {
        $this.setPrevInstanceWizardSteps();
      }
      if ($routeParams.storeId && ($this.isActionState('redispatch') || $this.isActionState('dispatch'))) {
        $this.setExistingSeals();
        $this.generateSealTypesList();
      }
    };

    this.initSuccessHandler = function() {
      $this.initSuccessHandlerMethods();
      $this.setUIReady();
      $this.registerScopeWatchers();
    };

    this.init = function() {
      if ($routeParams.storeId) {
        $this.showLoadingModal('We are loading Store Instance ' + $routeParams.storeId + '.');
        $this.getStoreInstance();
      }
      if (!$routeParams.storeId) {
        $this.showLoadingModal('Hang tight, we are loading some data for you.');
        var promises = this.makeInitPromises();
        $q.all(promises).then($this.initSuccessHandler);
      }
    };

    this.init();

  });
