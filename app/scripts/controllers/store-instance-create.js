'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceCreateCtrl
 * @description
 * # StoreInstanceCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceCreateCtrl', function ($scope, storeInstanceFactory, ngToast,
                                                   dateUtility,GlobalMenuService,
                                                   storeInstanceDispatchWizardConfig,
                                                    $location) {

    $scope.cateringStationList = [];
    $scope.menuMasterList = [];
    $scope.carrierNumbers = [];
    $scope.storesList = [];
    $scope.formData = {
     scheduleDate: dateUtility.nowFormatted(),
     menus: []
    };
    $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps();

   // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
   var companyId = GlobalMenuService.company.get();
   var $this = this;

    this.init = function() {
      this.getCatererStationList();
      this.getMenuMasterList();
      this.getCarrierNumbers();
      this.getStoresList();
    };

    this.generateQuery = function() {
      return {
        startDate:dateUtility.formatDateForAPI($scope.formData.scheduleDate)
      };
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getCatererStationList = function() {
      storeInstanceFactory.getCatererStationList().then(this.setCatererStationList);
    };

    this.setMenuMasterList = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
    };

    this.getMenuMasterList = function() {
      var query = this.generateQuery();
      storeInstanceFactory.getMenuMasterList(query).then(this.setMenuMasterList);
    };

    this.setCarrierNumbers = function(dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getCarrierNumbers = function() {
      storeInstanceFactory.getAllCarrierNumbers(companyId).then(this.setCarrierNumbers);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.getStoresList = function() {
      var query = this.generateQuery();
      query.readyToUse = true;
      storeInstanceFactory.getStoresList(query).then(this.setStoresList);
    };

    this.saveThenExit = function(response){
      $this.hideLoadingModal();
      $this.showMessage('success','Store Instance created id: ' + response.id);
      // TODO: Set this to actual URL when dashboard becomes available
      $location.url('/store-instance-list');
    };

    this.createStoreInstanceSuccessHandler = function(response){
      $this.hideLoadingModal();
      if(response.id){
        $this.showMessage('success','Store Instance created id: ' + response.id);
        if($scope.wizardStepToIndex) {
          $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps(response.id);
          var uri = $scope.wizardSteps[$scope.wizardStepToIndex].uri;
          $location.url(uri);
        }
      }
    };

    this.createStoreInstanceErrorHandler = function(response){
      $this.hideLoadingModal();
      $scope.displayError = true;
      if(response.data) {
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

    this.formatPayload = function(){
      var payload = angular.copy($scope.formData);
      payload.menus = this.formatMenus(payload.menus);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      return payload;
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

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showMessage = function (type, message) {
      ngToast.create({
        className: type,
        dismissButton: true,
        content: message
      });
    };

    this.validateForm = function() {
      this.resetErrors();
      if($scope.createStoreInstance.$valid && $scope.formData.menus.length > 0) {
        return true;
      }
      $scope.displayError = true;
      return false;
    };

    this.createStoreInstance = function(exitOnSave) {
      this.displayLoadingModal('Creating a store instance');
      var payload = this.formatPayload();
      if(!payload) {
        return false;
      }
      storeInstanceFactory.createStoreInstance(payload).then(
        ( exitOnSave ? this.saveThenExit : this.createStoreInstanceSuccessHandler ),
        this.createStoreInstanceErrorHandler
      );
    };

    this.init();

    $scope.submitForm = function(exitOnSave) {
      $scope.createStoreInstance.$setSubmitted(true);
      if($this.validateForm()) {
        $this.createStoreInstance(exitOnSave);
      }
      return false;
    };

    $scope.nextTrigger = function(){
      $this.createStoreInstance();
      return false;
    };

    $scope.validateInput = function(fieldName) {
      if($scope.createStoreInstance[fieldName].$pristine) {
        return '';
      }
      if($scope.createStoreInstance[fieldName].$invalid ||
        angular.isDefined($scope.createStoreInstance[fieldName].$error.required) ) {
        return 'has-error';
      }
      return 'has-success';
    };

    $scope.validateMenus = function() {
      if(angular.isUndefined($scope.createStoreInstance.Menus) ||
      $scope.createStoreInstance.Menus.$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }
      if($scope.formData.menus.length === 0) {
        $scope.createStoreInstance.Menus.$setValidity('required', false);
        return 'has-error';
      }
      $scope.createStoreInstance.Menus.$setValidity('required', true);
      return 'has-success';
    };

    $scope.$watch('formData.scheduleDate', function(newDate,oldDate) {
      if(newDate && newDate !== oldDate){
        $this.getMenuMasterList();
        $this.getStoresList();
      }
    });

    $scope.saveAndExit = function() {
      return $scope.submitForm(true);
    };

  });
