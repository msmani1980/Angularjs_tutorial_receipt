'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceStep1Ctrl
 * @description
 * # StoreInstanceStep1Ctrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceStep1Ctrl', function ($scope, storeInstanceFactory, ngToast, dateUtility) {

    $scope.cateringStationList = [];
    $scope.menuMasterList = [];
    $scope.formData = {
     scheduleDate: dateUtility.nowFormatted(),
     menus: []
   };

   var $this = this;

    this.init = function() {
      this.getCatererStationList();
      this.getMenuMasterList();
    };

    this.getCatererStationList = function() {
      // TODO: Use store instance factory
      storeInstanceFactory.getCatererStationList().then(this.setCatererStationList);
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getMenuMasterList = function() {
      // TODO: Use store instance factory
      storeInstanceFactory.getMenuMasterList().then(this.setMenuMasterList);
    };

    this.setMenuMasterList = function(dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
    };

    this.createStoreInstance = function() {
      this.resetErrors();
      this.displayLoadingModal('Creating a store instance');
      var payload = this.formatPayload();
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
