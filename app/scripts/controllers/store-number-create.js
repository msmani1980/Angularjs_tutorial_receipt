'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreNumberCreateCtrl
 * @description
 * # StoreNumberCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreNumberCreateCtrl', function ($scope, $location, $filter, $anchorScroll, companyStoresService, GlobalMenuService, ngToast, dateUtility, lodash) {

    var $this = this;
    this.meta = {
      limit: 100,
      offset: 0
    };

    // private controller vars
    var _companyId = null,
      _companyDefault = {
        storeNumber: null,
        startDate: null,
        endDate: null
      };

    function showMessage(className, type, message) {
      ngToast.create({className: className, dismissButton: true, content: '<strong>'+type+'</strong>: '+message});
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function showApiErrors(response){
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(response);
    }

    function formatForForm(store){
      store.startDate = dateUtility.formatDateForApp(store.startDate);
      store.endDate = dateUtility.formatDateForApp(store.endDate);
      return store;
    }

    // private controller functions
    function getStoreNumbers(response){
      $this.meta.count = $this.meta.count || response.meta.count;
      hideLoadingBar();
      $scope.storeNumbersList = $scope.storeNumbersList.concat(
        lodash.map(response.response, function(store) {
          return formatForForm(store);
        })
      );
    }

    function setCurrentStore(store){
      $scope.viewName = 'Edit Store Number';
      $scope.submitText = 'Save';
      $scope.editing = store.id;
      $scope.formData = store;
      hideLoadingModal();
      $anchorScroll(0);
    }

    function getStoreResolution(response){
      var store = formatForForm(response);
      setCurrentStore(store);
    }

    function getCurrentStoreNumber(_id){
      // Lets not hit the API again if it exists in our current list
      var store = $filter('filter')($scope.storeNumbersList, {id: _id}, true);
      if(store.length){
        setCurrentStore(store[0]);
        return;
      }
      companyStoresService.getStore(_id).then(getStoreResolution,showApiErrors);
    }

    function init(){
      _companyId = GlobalMenuService.company.get();
      $scope.viewName = 'Create Store Number';
      $scope.submitText = 'Create';
      $scope.formData = angular.copy(_companyDefault);
      $scope.displayError = false;
      $scope.editing = false;
      $scope.storeNumbersList = [];
    }

    $scope.getStoreList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      var payload = {
        companyId: GlobalMenuService.company.get(),
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };

      showLoadingBar();
      companyStoresService.getStoreList(payload).then(getStoreNumbers,showApiErrors);
      $this.meta.offset += $this.meta.limit;
    };

    function submitFormSuccess(){
      init();
      hideLoadingModal();
      showMessage('success', 'Store Number', 'saved!');
    }

    init();

    // scope functions
    $scope.submitForm = function(){
      displayLoadingModal('Saving');
      var payload = angular.copy($scope.formData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      // If store has an ID, is editing
      if(payload.id){
        companyStoresService.saveStore(payload).then(submitFormSuccess, showApiErrors);
      }
      // Otherwise, creating
      else {
        companyStoresService.createStore(payload).then(submitFormSuccess, showApiErrors);
      }
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
        init();
        hideLoadingModal();
        showMessage('success', 'Store Number', 'deleted!');
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
