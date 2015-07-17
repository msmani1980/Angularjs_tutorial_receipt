'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreNumberCreateCtrl
 * @description
 * # StoreNumberCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreNumberCreateCtrl', function ($scope, companyStoresService, GlobalMenuService, ngToast, dateUtility) {

    // scope vars
    $scope.viewName = 'Create Store Number';

    // private controller vars
    var _companyId = null,
      _companyDefault = {
        storeNumber: null,
        startDate: null,
        endDate: null
      };

    // private controller functions
    function setCompany(response){
      if(!response.meta.count){
        return;
      }
      angular.forEach(response.response, function(store){
        store.startDate = dateUtility.formatDateForApp(store.startDate);
        store.endDate = dateUtility.formatDateForApp(store.endDate);
        this.push(store);
      }, $scope.storeNumbersList);
    }

    function submitFormSuccess(){
      init();
      showMessage('created!', 'success');
    }

    function showApiErrors(response){
      hideLoadingModal();
      showMessage('failed!', 'warning');
      $scope.displayError = true;
      if ('data' in response) {
        $scope.formErrors = response.data;
      }
    }

    function showMessage(message, messageType) {
      hideLoadingModal();
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Store Number</strong>: ' + message });
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function init(){
      _companyId = GlobalMenuService.company.get();
      $scope.formData = angular.copy(_companyDefault);
      $scope.displayError = false;
      $scope.storeNumbersList = [];
      companyStoresService.getStores(_companyId).then(setCompany,showApiErrors);
    }
    init();

    // scope functions
    $scope.submitForm = function(){
      displayLoadingModal('Saving');
      var payload = angular.copy($scope.formData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      companyStoresService.createStore(payload).then(submitFormSuccess, showApiErrors);
    };

    $scope.formDefault = function(){
      return angular.equals($scope.formData,_companyDefault);
    };

    $scope.canDelete = function(store){
      return dateUtility.isAfterToday(store.startDate);
    };

    $scope.removeRecord = function(store) {
      if(!$scope.canDelete(store)){
        return false;
      }
      displayLoadingModal('Removing Item');
      companyStoresService.deleteStore(store.id).then(function() {
        hideLoadingModal();
        showMessage('deleted!', 'success');
        init();
      }, showApiErrors);
    };
  });
