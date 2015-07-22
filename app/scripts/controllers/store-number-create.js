'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreNumberCreateCtrl
 * @description
 * # StoreNumberCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreNumberCreateCtrl', function ($scope, $location, $filter, $anchorScroll, companyStoresService, GlobalMenuService, ngToast, dateUtility) {

    // private controller vars
    var _companyId = null,
      _companyDefault = {
        storeNumber: null,
        startDate: null,
        endDate: null
      };

    // private controller functions
    function getStoreNumbers(response){
      if(!response.meta.count){
        return;
      }
      hideLoadingModal();
      angular.forEach(response.response, function(store){
        this.push(formatForForm(store));
      }, $scope.storeNumbersList);
    }

    function getCurrentStoreNumber(_id){
      if(!_id){
        hideLoadingModal();
        return;
      }
      // Lets not hit the API again if it exists in our current list
      var store = $filter('filter')($scope.storeNumbersList, {id: _id}, true);
      if(store.length){
        setCurrentStore(store[0]);
        return;
      }
      companyStoresService.getStore(_id).then(getStoreResolution,showApiErrors);
    }

    function formatForForm(store){
      store.startDate = dateUtility.formatDateForApp(store.startDate);
      store.endDate = dateUtility.formatDateForApp(store.endDate);
      return store;
    }

    function getStoreResolution(response){
      var store = formatForForm(response);
      setCurrentStore(store);
    }

    function setCurrentStore(store){
      $scope.viewName = 'Edit Store Number';
      $scope.editing = store.id;
      $scope.formData = store;
      hideLoadingModal();
      $anchorScroll(0);
    }

    function submitFormSuccess(){
      init();
      showMessage('created!', 'success');
    }

    function showApiErrors(response){
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
      $scope.viewName = 'Create Store Number';
      $scope.formData = angular.copy(_companyDefault);
      $scope.displayError = false;
      $scope.editing = false;
      $scope.storeNumbersList = [];
      displayLoadingModal();
      companyStoresService.getStores(_companyId).then(getStoreNumbers,showApiErrors);
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
        showMessage('deleted!', 'success');
        init();
      }, showApiErrors);
    };

    $scope.canEdit = function(store){
      return dateUtility.isAfterToday(store.endDate);
    };

    $scope.fieldDisabled = function(store){
      return $scope.canEdit(store) && dateUtility.isTodayOrEarlier(store.startDate);
    };

    $scope.editStoreNumber = function(store){
      if(!$scope.canEdit(store)){
        return false;
      }
      displayLoadingModal();
      getCurrentStoreNumber(store.id);
    };
  });
