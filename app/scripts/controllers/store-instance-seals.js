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
    lodash) {

    var HANDOVER = 'Hand Over';
    var OUTBOUND = 'Outbound';
    var INBOUND = 'Inbound';
    var HIGH_SECURITY = 'High Security';

    var $this = this;

    this.createUrl = function(name) {
      return '/store-instance-' + name + '/' + $routeParams.action + '/' + $routeParams.storeId;
    };

    this.determineSteps = function() {
      switch ($routeParams.action) {
        default: $this.nextStep = {
          stepName: '3',
          URL: $this.createUrl('review')
        };
        $this.prevStep = {
          stepName: '1',
          URL: $this.createUrl('packing')
        };
        break;
        case 'replenish':
            $this.nextStep = {
            stepName: '4',
            URL: $this.createUrl('review')
          };
          $this.prevStep = {
            stepName: '2',
            URL: $this.createUrl('packing')
          };
          break;
        case 'end-instance':
            $this.nextStep = {
            stepName: '3',
            URL: $this.createUrl('packing')
          };
          $this.prevStep = {
            stepName: '1',
            URL: $this.createUrl('create')
          };
          break;
      }
    };

    $scope.formData = [];
    $scope.readOnly = true;
    $scope.saveButtonName = 'Exit';

    this.setSealColors = function(dataFromAPI) {
      $scope.sealColorsList = dataFromAPI.response;
    };

    this.canReplenish = function() {
      return angular.isDefined($scope.storeDetails.replenishStoreInstanceId) &&
        angular.isDefined($scope.storeDetails.parentStoreInstance);
    };

    this.isInstanceReadOnly = function() {
      var currentStatus = parseInt($scope.storeDetails.currentStatus.name);
      if (currentStatus === 2 && $routeParams.action === 'end-instance') {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
        return;
      }
      if (currentStatus !== 2 || $routeParams.action === 'replenish' && !this.canReplenish()) {
        this.showMessage('warning', 'This store instance is not ready for seals');
      } else {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
      }
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      $this.isInstanceReadOnly();
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.setWizardSteps = function() {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
    };

    this.getSealColors = function() {
      return sealColorsService.getSealColors().then($this.setSealColors);
    };

    this.getStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getSealTypes = function() {
      return sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.setStoreInstanceSeals = function(dataFromAPI) {
      $scope.existingSeals = dataFromAPI.response;
    };

    this.getStoreInstanceSeals = function() {
      return storeInstanceAssignSealsFactory.getStoreInstanceSeals($routeParams.storeId).then($this.setStoreInstanceSeals);
    };

    this.makePromises = function() {
      return [
        this.getStoreDetails(),
        this.getSealColors(),
        this.getSealTypes(),
        this.getStoreInstanceSeals()
      ];
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
      if ($routeParams.action !== 'end-instance') {
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
      }
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
      return $scope.sealColorsList.filter(function(sealColor) {
        return sealColor.type === typeId;
      })[0];
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
    };

    this.removeHandoverSealType = function() {
      var handover = $scope.sealTypes.filter(function(sealType) {
        return sealType.name === HANDOVER;
      })[0];
      var index = $scope.sealTypes.indexOf(handover);
      delete $scope.sealTypes[index];
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
      this.displayLoadingModal('Loading Assign Seals');
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
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
      $scope.response500 = false;
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

    this.makeCreatePromise = function(sealTypeObject) {
      var sealsToCreate = $this.determineSealsToCreate(sealTypeObject);
      if (sealsToCreate.length === 0) {
        return;
      }
      var payload = $this.formatPayload(sealTypeObject, sealsToCreate);
      return storeInstanceAssignSealsFactory.createStoreInstanceSeal(
        $routeParams.storeId,
        payload
      );
    };

    this.makeDeletePromise = function(sealTypeObject) {
      var sealsToDelete = $this.determineSealsToDelete(sealTypeObject);
      if (sealsToDelete.length === 0) {
        return;
      }
      var deletePromises = [];
      for (var key in sealsToDelete) {
        var sealNumber = sealsToDelete[key];
        var existingSeal = this.getExistingSealByNumber(sealNumber, sealTypeObject.id);
        deletePromises.push(storeInstanceAssignSealsFactory.deleteStoreInstanceSeal(
          existingSeal.id,
          $routeParams.storeId
        ));
      }
      return deletePromises;
    };

    this.makeAssignSealsPromises = function() {
      var promises = [];
      angular.forEach($scope.sealTypesList, function(sealTypeObject) {
        var createPromise = $this.makeCreatePromise(sealTypeObject);
        if (createPromise) {
          promises.push(createPromise);
        }
        var deletePromises = $this.makeDeletePromise(sealTypeObject);
        if (deletePromises) {
          promises = promises.concat(deletePromises);
        }
      });
      return promises;
    };

    this.findStatusObject = function(stepObject) {
      return lodash.findWhere($scope.storeDetails.statusList, {
        name: stepObject.stepName
      });
    };

    this.statusUpdateSuccessHandler = function(stepObject) {
      $this.hideLoadingModal();
      $location.path(stepObject.URL);
    };

    this.updateStatusToStep = function(stepObject) {
      var statusObject = this.findStatusObject(stepObject);
      if (!statusObject) {
        return;
      }
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusObject.id).then(function() {
        $this.statusUpdateSuccessHandler(stepObject);
      }, $this.assignSealsErrorHandler);
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
      if (response.data) {
        $scope.formErrors = response.data;
        return false;
      }
      $scope.response500 = true;
      return false;
    };

    this.assignSeals = function() {
      this.displayLoadingModal('Assigning seals to Store Instance');
      var promises = this.makeAssignSealsPromises();
      $q.all(promises).then(
        $this.assignSealsSuccessHandler,
        $this.assignSealsErrorHandler
      );
    };

    this.init = function() {
      this.determineSteps();
      this.getSealTypesDependencies();
      this.setWizardSteps();
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
      $this.updateStatusToStep($this.prevStep);
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

    $scope.isEndInstance = function() {
      return $routeParams.action === 'end-instance';
    };

    $scope.isReplenish = function() {
      return $routeParams.action === 'replenish';
    };

    $scope.hideSealTypeIfEndInstance = function(type) {
      if ($scope.isEndInstance() && $scope.sealTypesList) {
        if (type === OUTBOUND) {
          return true;
        }
        if (type === HANDOVER) {
          return true;
        }
      }
    };

  });
