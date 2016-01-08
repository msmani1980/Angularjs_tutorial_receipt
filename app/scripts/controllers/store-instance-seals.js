'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function($scope, $routeParams, $q, storeInstanceWizardConfig,
    storeInstanceFactory, sealTypesService, sealColorsService, ngToast, $location, storeInstanceAssignSealsFactory,
    dateUtility, lodash) {

    var HANDOVER = 'Hand Over';
    var OUTBOUND = 'Outbound';
    var INBOUND = 'Inbound';
    var HIGH_SECURITY = 'High Security';

    var $this = this;

    $scope.formData = [];
    $scope.readOnly = true;
    $scope.saveButtonName = 'Exit';

    this.setSealColors = function(dataFromAPI) {
      if (angular.isDefined(dataFromAPI)) {
        $scope.sealColorsList = dataFromAPI.response;
      }

      if (angular.isUndefined(dataFromAPI)) {
        $scope.errorCustom = [{
          field: 'Seal Colors',
          value: '- Our server did not return the data, please contact your systems administrator.'
        }];
        $scope.displayError = true;
      }
    };

    this.canReplenish = function() {
      return angular.isDefined($scope.storeDetails.replenishStoreInstanceId) &&
        angular.isDefined($scope.storeDetails.parentStoreInstance);
    };

    this.getCurrentStepName = function() {
      if (angular.isUndefined($scope.storeDetails)) {
        return false;
      }

      return parseInt($scope.storeDetails.currentStatus.name);
    };

    this.isActionState = function(actionState) {
      return ($routeParams.action === actionState);
    };

    this.isInboundDuringEndInstance = function() {
      return (this.getCurrentStepName() === 6 && $routeParams.action === 'end-instance');
    };

    this.isInboundDuringRedispatch = function() {
      return (this.getCurrentStepName() === 1 && $routeParams.action === 'redispatch');
    };

    this.setAsEdit = function() {
      $scope.readOnly = false;
      $scope.saveButtonName = 'Save & Exit';
    };

    this.storeInstanceIsInvalid = function() {
      if (this.getCurrentStepName() !== 2 || $routeParams.action === 'replenish' && !this.canReplenish()) {
        $scope.errorCustom = [{
          field: 'Store Instance Invalid Status',
          value: '- This Store Instance is not in the correct status'
        }];
        $scope.displayError = true;
        return true;
      }

      return false;
    };

    this.isInstanceReadOnly = function() {
      if (this.isInboundDuringEndInstance() || this.isInboundDuringRedispatch()) {
        this.setAsEdit();
        return;
      }

      if (this.storeInstanceIsInvalid()) {
        return;
      }

      $scope.readOnly = false;
      $scope.saveButtonName = 'Save & Exit';
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      $this.getSealTypesDependencies();
      $this.setWizardSteps();
      $this.isInstanceReadOnly();
      $scope.formData.note = $scope.storeDetails.note;
      $scope.formData.tampered = $scope.storeDetails.tampered;
      if ($this.isActionState('end-instance')) {
        $scope.storeDetails.displayLMPStation = $scope.storeDetails.inboundLMPStation;
      }
    };

    this.setPrevStoreDetails = function(prevStoreDetailsJSON) {
      $scope.prevStoreDetails = prevStoreDetailsJSON;
      $scope.formData.note = $scope.prevStoreDetails.note;
      $scope.formData.tampered = $scope.prevStoreDetails.tampered;
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.setStoreInstanceSeals = function(dataFromAPI) {
      $scope.existingSeals = dataFromAPI.response;
    };

    this.setWizardSteps = function() {
      var controllerName = 'Seals';
      if ($this.isInboundDuringRedispatch()) {
        controllerName = 'InboundSeals';
      }

      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: controllerName
      });
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
      $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);
      if ($this.isInboundDuringRedispatch()) {
        $this.prevInstanceNextStep = angular.copy(Math.abs(parseInt($scope.wizardSteps[currentStepIndex].storeOne.stepName) +
          1).toString());
      }
    };

    this.getSealColors = function() {
      return sealColorsService.getSealColors().then($this.setSealColors);
    };

    this.getStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getPrevStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($scope.storeDetails.prevStoreInstanceId).then($this.setPrevStoreDetails);
    };

    this.getSealTypes = function() {
      return sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.getStoreInstanceSeals = function() {
      var storeInstanceId = this.determineInstanceToUpdate();
      return storeInstanceAssignSealsFactory.getStoreInstanceSeals(storeInstanceId).then($this.setStoreInstanceSeals);
    };

    this.makePromises = function() {
      var promises = [
        this.getSealColors(),
        this.getSealTypes(),
        this.getStoreInstanceSeals()
      ];
      if ($this.isInboundDuringRedispatch() || $this.isInboundDuringEndInstance()) {
        promises.push(this.getPrevStoreDetails());
      }

      return promises;
    };

    this.createHandoverActions = function() {
      if ($routeParams.action !== 'end-instance') {
        return [{
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals(OUTBOUND, HANDOVER);
          }
        }];
      }
    };

    this.createInboundActions = function() {
      if ($this.isInboundDuringEndInstance() || $this.isInboundDuringRedispatch()) {
        return [];
      }

      var actions = [{
        label: 'Copy From Handover',
        trigger: function() {
          return $scope.copySeals(HANDOVER, INBOUND);
        }
      }, {
        label: 'Copy From Outbound',
        trigger: function() {
          return $scope.copySeals(OUTBOUND, INBOUND);
        }
      }];
      if ($routeParams.action === 'replenish') {
        actions.splice(0, 1);
      }

      return actions;
    };

    this.addSealTypeActions = function(sealTypeObject) {
      if ($scope.readOnly) {
        return;
      }

      if (sealTypeObject.name === HANDOVER) {
        return $this.createHandoverActions();
      }

      if (sealTypeObject.name === INBOUND) {
        return this.createInboundActions();
      }
    };

    this.isSealTypeRequired = function(sealTypeObject) {
      if (sealTypeObject.name === OUTBOUND || sealTypeObject.name === INBOUND) {
        return true;
      }

      return false;
    };

    this.getSealColor = function(typeId) {
      if (angular.isDefined($scope.sealColorsList) && angular.isDefined(typeId)) {
        return $scope.sealColorsList.filter(function(sealColor) {
          return sealColor.type === typeId;
        })[0];
      }
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
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

    this.getSealTypeObjectByName = function(name) {
      return $scope.sealTypesList.filter(function(sealTypeObject) {
        return sealTypeObject.name === name;
      })[0];
    };

    this.getExistingSealByNumber = function(sealNumber, sealType) {
      return $scope.existingSeals.filter(function(existingSeal) {
        return (existingSeal.sealNumbers[0] === sealNumber && existingSeal.type === parseInt(sealType));
      })[0];
    };

    this.sealTypeListOrder = function(sealType) {
      switch (sealType.name) {
        case OUTBOUND:
          return 1;
        case HANDOVER:
          return 2;
        case INBOUND:
          return 3;
        case HIGH_SECURITY:
          return 4;
      }
    };

    this.generateSealTypeObject = function(sealType) {
      var sealColor = $this.getSealColor(sealType.id);
      if (angular.isDefined(sealColor)) {
        return {
          id: sealType.id,
          name: sealType.name,
          color: sealColor.color,
          seals: {
            numbers: $this.getExistingSeals(sealType.id)
          },
          actions: $this.addSealTypeActions(sealType),
          required: $this.isSealTypeRequired(sealType),
          order: $this.sealTypeListOrder(sealType)
        };
      }
    };

    this.removeHandoverSealType = function() {
      if (angular.isDefined($scope.sealTypes)) {
        var handover = $scope.sealTypes.filter(function(sealType) {
          return sealType.name === HANDOVER;
        })[0];

        var index = $scope.sealTypes.indexOf(handover);
        delete $scope.sealTypes[index];
      }
    };

    this.generateSealTypesList = function() {
      $scope.sealTypesList = [];
      if ($routeParams.action === 'replenish') {
        $this.removeHandoverSealType();
      }

      angular.forEach($scope.sealTypes, function(sealType) {
        var sealTypeObject = $this.generateSealTypeObject(sealType);
        $scope.sealTypesList.push(sealTypeObject);
      });

      $this.hideLoadingModal();
    };

    this.getSealTypesDependencies = function() {
      var promises = this.makePromises();
      $q.all(promises).then($this.generateSealTypesList);
    };

    this.showMessage = function(type, message) {
      ngToast.create({
        className: type,
        dismissButton: true,
        content: message
      });
    };

    this.resetErrors = function() {
      $scope.displayError = false;
      $scope.errorResponse = null;
    };

    this.validateForm = function() {
      this.resetErrors();
      for (var key in $scope.sealTypesList) {
        var sealTypeObject = $scope.sealTypesList[key];
        $scope.validateSeals(sealTypeObject);
      }

      $scope.displayError = $scope.assignSealsForm.$invalid;
      return $scope.assignSealsForm.$valid;
    };

    this.exitOnSave = function() {
      $this.hideLoadingModal();
      $this.showMessage('success', 'Seals Assigned');
      $location.url('/store-instance-dashboard');
    };

    this.getExistingSealsByType = function(typeId) {
      if (!$scope.existingSeals) {
        return;
      }

      var existingSealTypeObjects = $scope.existingSeals.filter(function(sealTypeObject) {
        return sealTypeObject.type === typeId;
      });

      var existingSeals = [];
      existingSealTypeObjects.forEach(function(sealTypeObject) {
        existingSeals.push(sealTypeObject.sealNumbers[0]);
      });

      return existingSeals;
    };

    this.diffExistingSeals = function(listToCheck, filter) {
      return lodash.difference(listToCheck, filter);
    };

    this.determineSealsToCreate = function(sealTypeObject) {
      var existingSeals = this.getExistingSealsByType(sealTypeObject.id);
      var diff = this.diffExistingSeals(sealTypeObject.seals.numbers, existingSeals);
      var newSeals = [];
      for (var key in diff) {
        var newSealNumber = diff[key];
        newSeals.push(newSealNumber);
      }

      return newSeals;
    };

    this.determineSealsToDelete = function(sealTypeObject) {
      var existingSeals = this.getExistingSealsByType(sealTypeObject.id);
      var diff = this.diffExistingSeals(existingSeals, sealTypeObject.seals.numbers);
      var sealsToDelete = [];
      for (var key in diff) {
        var sealNumber = diff[key];
        sealsToDelete.push(sealNumber);
      }

      return sealsToDelete;
    };

    this.formatPayload = function(sealTypeObject, seals) {
      return {
        type: sealTypeObject.id,
        color: sealTypeObject.color,
        sealNumbers: seals
      };
    };

    this.determineInstanceToUpdate = function() {
      var storeInstanceId = $routeParams.storeId;
      if ($this.isInboundDuringRedispatch()) {
        storeInstanceId = $scope.storeDetails.prevStoreInstanceId;
      }

      return storeInstanceId;
    };

    this.makeCreatePromise = function(sealTypeObject) {
      var sealsToCreate = $this.determineSealsToCreate(sealTypeObject);
      if (sealsToCreate.length === 0) {
        return;
      }

      var storeInstanceId = $this.determineInstanceToUpdate();
      var payload = $this.formatPayload(sealTypeObject, sealsToCreate);
      return storeInstanceAssignSealsFactory.createStoreInstanceSeal(
        storeInstanceId,
        payload
      );
    };

    this.makeDeletePromise = function(sealTypeObject) {
      var sealsToDelete = $this.determineSealsToDelete(sealTypeObject);
      if (sealsToDelete.length === 0) {
        return;
      }

      var storeInstanceId = $this.determineInstanceToUpdate();
      var deletePromises = [];
      for (var key in sealsToDelete) {
        var sealNumber = sealsToDelete[key];
        var existingSeal = this.getExistingSealByNumber(sealNumber, sealTypeObject.id);
        deletePromises.push(storeInstanceAssignSealsFactory.deleteStoreInstanceSeal(
          existingSeal.id,
          storeInstanceId
        ));
      }

      return deletePromises;
    };

    this.makeDeleteSealsPromises = function() {
      var promises = [];
      angular.forEach($scope.sealTypesList, function(sealTypeObject) {
        var deletePromises = $this.makeDeletePromise(sealTypeObject);
        if (deletePromises) {
          promises = promises.concat(deletePromises);
        }
      });

      return promises;
    };

    this.makeCreateSealsPromises = function() {
      var promises = [];
      angular.forEach($scope.sealTypesList, function(sealTypeObject) {
        var createPromise = $this.makeCreatePromise(sealTypeObject);
        if (createPromise) {
          promises.push(createPromise);
        }
      });

      return promises;
    };

    this.findStatusObject = function(stepObject) {
      if (stepObject) {
        return lodash.findWhere($scope.storeDetails.statusList, {
          name: stepObject.stepName
        });
      }
    };

    this.statusUpdateSuccessHandler = function(stepObject) {
      $this.hideLoadingModal();
      $location.path(stepObject.uri);
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

    this.storeInstanceIdForTamperedSeals = function() {
      if ($scope.storeDetails.prevStoreInstanceId && $routeParams.action === 'redispatch') {
        return $scope.storeDetails.prevStoreInstanceId;
      }

      return $routeParams.storeId;
    };

    this.makeNotePayload = function() {
      if ($scope.formData.tampered && $scope.formData.note) {
        return $scope.formData.note.replace(/'/g, '');
      }

      return '';
    };

    this.updateStoreInstanceTampered = function() {
      var payload = {
        cateringStationId: $scope.storeDetails.cateringStationId,
        scheduleNumber: $scope.storeDetails.scheduleNumber,
        scheduleDate: dateUtility.formatDateForAPI($scope.storeDetails.scheduleDate),
        storeId: $scope.storeDetails.storeId,
        menus: $this.formatMenus($scope.storeDetails.menuList),
        tampered: $scope.formData.tampered,
        note: $this.makeNotePayload()
      };
      return payload;
    };

    this.makeSealsPromises = function(stepObject) {
      this.displayLoadingModal('Updating Status');
      var promises = [];
      if ($routeParams.action === 'redispatch') {
        var prevInstanceStep = stepObject.storeOne.stepName;
        promises.push(storeInstanceFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId,
          prevInstanceStep));
      }

      promises.push(storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, stepObject.stepName));
      $q.all(promises).then(function() {
        $this.statusUpdateSuccessHandler(stepObject);
      }, $this.assignSealsErrorHandler);
    };

    this.updateStatusToStep = function(stepObject) {
      if (angular.isUndefined(stepObject.stepName)) {
        $this.statusUpdateSuccessHandler(stepObject);
        return;
      }

      $this.makeSealsPromises(stepObject);
    };

    this.assignSealsSuccessHandler = function() {
      if ($this.exitAfterSave) {
        $this.exitOnSave();
        return;
      }

      $this.updateStatusToStep($this.nextStep);
      $this.showMessage('success', 'Seals Assigned!');
    };

    this.assignSealsErrorHandler = function(response) {
      $this.getStoreInstanceSeals();
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = response;
      return false;
    };

    this.assignSeals = function() {
      this.displayLoadingModal('Assigning seals to Store Instance');
      var deletePromises = this.makeDeleteSealsPromises();
      var createPromises = this.makeCreateSealsPromises();
      var tamperedPromises = [];
      if ($this.isInboundDuringRedispatch() || $this.isInboundDuringEndInstance()) {
        var payload = $this.updateStoreInstanceTampered();
        tamperedPromises.push(storeInstanceFactory.updateStoreInstance(this.storeInstanceIdForTamperedSeals(),
          payload));
      }

      $q.all(deletePromises).then(
        $q.all(tamperedPromises).then(
          $q.all(createPromises).then(
            $this.assignSealsSuccessHandler,
            $this.assignSealsErrorHandler
          ), $this.assignSealsErrorHandler
        ), $this.assignSealsErrorHandler
      );
    };

    this.init = function() {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      this.displayLoadingModal('Loading Seals for Store Instance');
      this.getStoreDetails();
    };

    this.init();

    $scope.copySeals = function(copyFrom, copyTo) {
      var sealTypeFrom = $this.getSealTypeObjectByName(copyFrom);
      var sealTypeTo = $this.getSealTypeObjectByName(copyTo);
      sealTypeTo.seals.numbers = angular.copy(sealTypeFrom.seals.numbers);
    };

    $scope.submitForm = function() {
      $scope.assignSealsForm.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.assignSeals();
      }

      return false;
    };

    $scope.goToPacking = function() {
      return $scope.prevTrigger();
    };

    $scope.prevTrigger = function() {
      var prevStep = $scope.wizardSteps[$scope.wizardStepToIndex] || $this.prevStep;
      $this.updateStatusToStep(prevStep);
    };

    $scope.validateSeals = function(sealTypeObject) {
      var model = $scope.assignSealsForm[sealTypeObject.name];
      if (angular.isUndefined(model) || model.$pristine && !$scope.assignSealsForm.$submitted) {
        return '';
      }

      if (sealTypeObject.required && sealTypeObject.seals.numbers.length === 0) {
        model.$setValidity('required', false);
        return 'has-error';
      }

      model.$setValidity('required', true);
      return 'has-success';
    };

    $scope.saveAndExit = function() {
      if ($scope.readOnly) {
        $location.url('/store-instance-dashboard');
        return;
      }

      $this.exitAfterSave = true;
      return $scope.submitForm();
    };

    $scope.isActionState = function(action) {
      return $this.isActionState(action);
    };

    $scope.hideSealType = function(type) {
      if ($this.isInboundDuringEndInstance() || $this.isInboundDuringRedispatch()) {
        return (type === OUTBOUND || type === HANDOVER);
      }

      return false;
    };

    $scope.showTamperedSeals = function() {
      return ($this.isInboundDuringEndInstance() || $this.isInboundDuringRedispatch());
    };

  });
