'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function($scope, $routeParams, $q, storeInstanceDispatchWizardConfig,
    storeInstanceFactory, sealTypesService, sealColorsService, ngToast, $location, storeInstanceAssignSealsFactory,
    lodash) {

    // TODO: Allow a user to edit existing seals in each seal type

    var $this = this;
    this.nextStep = {
      stepName: '3',
      URL: '/store-instance-review/' + $routeParams.storeId + '/dispatch'
    };
    this.prevStep = {
      stepName: '2',
      URL: '/store-instance-packing/' + $routeParams.storeId
    };

    $scope.formData = [];

    this.setSealColors = function(dataFromAPI) {
      $scope.sealColorsList = dataFromAPI.response;
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.setWizardSteps = function() {
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);
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

    this.makePromises = function() {
      return [
        this.getStoreDetails(),
        this.getSealColors(),
        this.getSealTypes()
      ];
    };

    this.createHandoverActions = function() {
      return [{
        label: 'Copy From Outbound',
        trigger: function() {
          return $scope.copySeals('Outbound', 'Hand Over');
        }
      }];
    };

    this.createInboundActions = function() {
      return [{
        label: 'Copy From Handover',
        trigger: function() {
          return $scope.copySeals('Hand Over', 'Inbound');
        }
      }, {
        label: 'Copy From Outbound',
        trigger: function() {
          return $scope.copySeals('Outbound', 'Inbound');
        }
      }];
    };

    this.addSealTypeActions = function(sealTypeObject) {
      if (sealTypeObject.name === 'Hand Over') {
        return $this.createHandoverActions();
      }
      if (sealTypeObject.name === 'Inbound') {
        return this.createInboundActions();
      }
    };

    this.isSealTypeRequired = function(sealTypeObject) {
      if (sealTypeObject.name === 'Outbound' || sealTypeObject.name === 'Inbound') {
        return true;
      }
      return false;
    };

    this.getSealColor = function(typeId) {
      return $scope.sealColorsList.filter(function(sealColor) {
        return sealColor.type === typeId;
      })[0];
    };

    this.generateSealTypeObject = function(sealType, sealColor) {
      return {
        id: sealType.id,
        name: sealType.name,
        color: sealColor.color,
        seals: {
          numbers: []
        },
        actions: $this.addSealTypeActions(sealType),
        required: $this.isSealTypeRequired(sealType)
      };
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.generateSealTypesList = function() {
      $scope.sealTypesList = [];
      angular.forEach($scope.sealTypes, function(sealType) {
        var sealColor = $this.getSealColor(sealType.id);
        var sealTypeObject = $this.generateSealTypeObject(sealType, sealColor);
        $scope.sealTypesList.push(sealTypeObject);
      });
      $this.hideLoadingModal();
    };

    this.getSealTypesDependencies = function() {
      this.displayLoadingModal('Loading the Store Instance');
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

    this.formatPayload = function(sealTypeObject) {
      return {
        type: sealTypeObject.id,
        color: sealTypeObject.color,
        sealNumbers: sealTypeObject.seals.numbers
      };
    };

    this.makeAssignSealsPromises = function() {
      var promises = [];
      angular.forEach($scope.sealTypesList, function(sealTypeObject) {
        var payload = $this.formatPayload(sealTypeObject);
        var promise = storeInstanceAssignSealsFactory.createStoreInstanceSeal(
          $routeParams.storeId,
          payload
        );
        promises.push(promise);
      });
      return promises;
    };

    this.findStatusObject = function(stepObject) {
      return lodash.findWhere($scope.storeDetails.statusList, {
        name: stepObject.stepName
      });
    };

    this.statusUpdateSuccessHandler = function() {
      $this.hideLoadingModal();
      $location.path($this.nextStep.URL);
    };

    this.updateStatusToStep = function(stepObject) {
      var statusObject = this.findStatusObject(stepObject);
      if (!statusObject) {
        return;
      }
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusObject.id).then(
        $this.statusUpdateSuccessHandler,
        $this.assignSealsErrorHandler
      );
    };

    this.assignSealsSuccessHandler = function() {
      $this.updateStatusToStep($this.nextStep);
      $this.showMessage('success', 'Seals Assigned!');
    };

    this.assignSealsErrorHandler = function(response) {
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
      this.getSealTypesDependencies();
      this.setWizardSteps();
    };

    this.getSealTypeObjectByName = function(name) {
      return $scope.sealTypesList.filter(function(sealTypeObject) {
        return sealTypeObject.name === name;
      })[0];
    };

    this.init();

    $scope.copySeals = function(copyFrom, copyTo) {
      var sealTypeFrom = $this.getSealTypeObjectByName(copyFrom);
      var sealTypeTo = $this.getSealTypeObjectByName(copyTo);
      sealTypeTo.seals.numbers = angular.copy(sealTypeFrom.seals.numbers);
    };

    $scope.submitForm = function(saveAndExit) {
      $scope.assignSealsForm.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.assignSeals(saveAndExit);
      }
      return false;
    };

    $scope.goToPacking = function() {
      $location.path($this.prevStep.URL);
    };

    $scope.prevTrigger = function() {
      return true;
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
      return $scope.submitForm(true);
    };

  });
