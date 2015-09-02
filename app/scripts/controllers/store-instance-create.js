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
                                                   storeInstanceDispatchWizardConfig) {

    $scope.cateringStationList = [];
    $scope.menuMasterList = [];
    $scope.carrierNumbers = [];
    $scope.storesList = [];
    $scope.formData = {
     scheduleDate: dateUtility.nowFormatted(),
     menus: []
   };
    $scope.wizardSteps = storeInstanceDispatchWizardConfig.get();
    $scope.nextTrigger = function(message){
      console.log(message);
      // return false; // uncomment out if you prefer the wizard not step forward
    };
    $scope.nextTriggerMessage = 'trigger something before going to the next step';

   // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
   var companyId = GlobalMenuService.company.get();
   var $this = this;

    this.init = function() {
      this.getCatererStationList();
      this.getMenuMasterList();
      this.getCarrierNumbers();
      this.getStoresList();
    };

    this.getCatererStationList = function() {
      storeInstanceFactory.getCatererStationList().then(this.setCatererStationList);
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getMenuMasterList = function() {
      storeInstanceFactory.getMenuMasterList().then(this.setMenuMasterList);
    };

    this.setMenuMasterList = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
    };

    this.getCarrierNumbers = function() {
      storeInstanceFactory.getAllCarrierNumbers(companyId).then(this.setCarrierNumbers);
    };

    this.setCarrierNumbers = function(dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getStoresList = function() {
      storeInstanceFactory.getStoresList().then(this.setStoresList);
    };

    this.setStoresList = function(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.createStoreInstance = function() {
      this.resetErrors();
      this.displayLoadingModal('Creating a store instance');
      var payload = this.formatPayload();
      if(angular.isUndefined(payload)) {
        return false;
      }
      storeInstanceFactory.createStoreInstance(payload).then(
        this.createStoreInstanceSuccessHandler,
        this.createStoreInstanceErrorHandler
      );
    };

    this.createStoreInstanceSuccessHandler = function(response){
      $this.hideLoadingModal();
      if(response.id){
        $this.showMessage('success','Store Instance created id: ' + response.id);
        //TODO: Move user to packing step
      }
    };

    this.createStoreInstanceErrorHandler = function(response){
      $this.hideLoadingModal();
      $this.showMessage('failure','We couldn\'t create your Store Instance' );
      $scope.displayError = true;
      if(response.data) {
        $scope.formErrors = response.data;
        return false;
      }
      $scope.response500 = true;
      return false;
    };

    this.resetErrors = function() {
      $scope.displayError = false;
      $scope.formErrors = [];
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

    this.init();

    $scope.submitForm = function() {
      $this.createStoreInstance();
    };

  });
