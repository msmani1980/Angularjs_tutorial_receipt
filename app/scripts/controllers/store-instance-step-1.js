'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceStep1Ctrl
 * @description
 * # StoreInstanceStep1Ctrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceStep1Ctrl', function ($scope,catererStationService,
    menuService,storeInstanceService,ngToast, dateUtility) {

    $scope.cateringStationList = [];
    $scope.menuList = [];
    $scope.formData = {
     scheduleDate: dateUtility.nowFormatted(),
     menus: [
       {id:1}
     ]
   };

   var $this = this;

    this.init = function() {
      this.getCatererStationList();
      this.getMenuList();
    };

    this.getCatererStationList = function() {
      // TODO: Use store instance factory
      catererStationService.getCatererStationList().then(this.setCatererStationList);
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getMenuList = function() {
      // TODO: Use store instance factory
      menuService.getMenuList().then(this.setMenuList);
    };

    this.setMenuList = function(dataFromAPI) {
      $scope.menuList = dataFromAPI.menus;
    };

    this.createStoreInstance = function() {
      this.displayLoadingModal('Creating a store instance');
      var payload = this.formatPayload();
      storeInstanceService.createStoreInstance(payload).then(this.createStoreInstanceSuccessHandler);
    };

    this.createStoreInstanceSuccessHandler = function(response){
      $this.hideLoadingModal();
      if(response.id){
        $this.showSuccessMessage('Store Instance created id: ' + response.id);
        //TODO: Move user to packing step
      } else {
        $scope.displayError = true;
      }
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

    this.showSuccessMessage = function (message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: message
      });
    };

    this.init();

    $scope.submitForm = function() {
      $this.createStoreInstance();
    };

  });
