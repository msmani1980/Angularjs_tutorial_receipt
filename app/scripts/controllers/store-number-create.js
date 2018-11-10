'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreNumberCreateCtrl
 * @description
 * # StoreNumberCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreNumberCreateCtrl', function($scope, $location, $filter, $anchorScroll, companyStoresService,
    globalMenuService, messageService, dateUtility, lodash) {

    var $this = this;
    this.meta = {
      limit: 1500,
      offset: 0
    };

    // private controller vars
    var companyId = null;
    var companyDefault = {
      storeNumber: null,
      startDate: null,
      endDate: null
    };

    function resetSearchMeta() {
      $this.meta = {
        limit: 1500,
        offset: 0,
        count: undefined
      };
    }

    function showMessage(className, type, message) {
      messageService.display(className, message, type);
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

    function showApiErrors(response) {
      $scope.errorCustom = null;
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(response);
    }

    function formatForForm(store) {
      store.startDate = dateUtility.formatDateForApp(store.startDate);
      store.endDate = dateUtility.formatDateForApp(store.endDate);
      return store;
    }

    // private controller functions
    function getStoreNumbers(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      hideLoadingBar();
      $scope.storeNumbersList = $scope.storeNumbersList.concat(
        lodash.map(response.response, function(store) {
          return formatForForm(store);
        })
      );
    }

    function setCurrentStore(store) {
      $scope.viewName = 'Edit Store Number';
      $scope.submitText = 'Save';
      $scope.editing = store.id;
      $scope.formData = angular.copy(store);
      hideLoadingModal();
      $anchorScroll(0);
    }

    function getStoreResolution(response) {
      var store = formatForForm(response);
      setCurrentStore(store);
    }

    function getCurrentStoreNumber(_id) {
      // Lets not hit the API again if it exists in our current list
      var store = $filter('filter')($scope.storeNumbersList, {
        id: _id
      }, true);
      if (store.length) {
        setCurrentStore(store[0]);
        return;
      }

      companyStoresService.getStore(_id).then(getStoreResolution, showApiErrors);
    }

    function init() {
      companyId = globalMenuService.company.get();
      $scope.viewName = 'Create Store Number';
      $scope.submitText = 'Create';
      $scope.formData = angular.copy(companyDefault);
      $scope.displayError = false;
      $scope.editing = false;
      $scope.storeNumbersList = [];
      $scope.minDate = dateUtility.dateNumDaysAfterTodayFormattedDatePicker(1);
      $scope.today = dateUtility.nowFormattedDatePicker();
      $scope.isEditing = false;
      $scope.formData.storeNumber = '';
      resetSearchMeta();
    }

    $scope.getStoreList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = {
        companyId: globalMenuService.company.get(),
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };

      showLoadingBar();
      companyStoresService.getStoreList(payload).then(getStoreNumbers, showApiErrors);
      $this.meta.offset += $this.meta.limit;
    };

    function submitFormSuccess() {
      init();
      $scope.getStoreList();
      hideLoadingModal();
      showMessage('success', 'Store Number', 'saved!');
    }

    init();

    // scope functions
    $scope.submitForm = function() {
      $scope.isSubmitting = true;
      $scope.storeNumberCreatForm.$setSubmitted(true);
      
      if ($scope.storeNumberCreatForm.$submitted && !$scope.storeNumberCreatForm.$valid) {
        $scope.displayError = true;
      } else {
        $scope.displayError = false;
      }

      if (!$scope.storeNumberCreatForm.$valid) {
        return;
      }
      
      displayLoadingModal('Saving');
      var payload = angular.copy($scope.formData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);

      // If store has an ID, is editing
      if (payload.id) {
        companyStoresService.saveStore(payload).then(submitFormSuccess, showApiErrors);
      }

      // Otherwise, creating
      else {
        companyStoresService.createStore(payload).then(submitFormSuccess, showApiErrors);
      }
    };

    $scope.formDefault = function() {
      return angular.equals($scope.formData, companyDefault);
    };

    $scope.canDelete = function(store) {
      return store.readyToUse;
    };

    function removeRecordError() {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorCustom = [{
        field: 'Delete Store Number',
        value: 'An existing store instance is using this store number'
      }];
    }

    function removeRecordSuccess() {
      init();
      $scope.getStoreList();
      hideLoadingModal();
      showMessage('success', 'Store Number', 'deleted!');
    }

    $scope.removeRecord = function(store) {
      $scope.isSubmitting = false;
      if (!$scope.canDelete(store)) {
        return false;
      }

      displayLoadingModal('Removing Item');
      companyStoresService.deleteStore(store.id).then(removeRecordSuccess, removeRecordError);
    };

    $scope.isEndingToday = function (store) {
      var originalStore = lodash.findWhere($scope.storeNumbersList, { id: store.id });
      if (!originalStore) {
        return false;
      }

      return dateUtility.isTodayDatePicker(originalStore.endDate);
    };

    $scope.canEdit = function(store) {
      return dateUtility.isTodayDatePicker(store.endDate) || dateUtility.isAfterTodayDatePicker(store.endDate);
    };

    $scope.fieldDisabled = function(store) {
      var originalStore = lodash.findWhere($scope.storeNumbersList, { id: store.id });
      if (!originalStore) {
        return false;
      }

      return $scope.canEdit(originalStore) && dateUtility.isTodayOrEarlierDatePicker(originalStore.startDate);
    };

    $scope.editStoreNumber = function(store) {
      if (!$scope.canEdit(store)) {
        return false;
      }

      $scope.isEditing = true;
      displayLoadingModal();
      getCurrentStoreNumber(store.id);
    };
    
    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };
    
    $scope.searchStoreNumber = function() {
      var searchStartDate = ($scope.formData.startDate === null || $scope.formData.startDate === '') ? dateUtility.nowFormattedDatePicker() : $scope.formData.startDate;
      var searchEndDate = $scope.formData.endDate; 
      $scope.displayError = false;
      $scope.editing = false;
      $scope.storeNumbersList = [];

      var payload = {
        companyId: globalMenuService.company.get(),
        storeNumber: $scope.formData.storeNumber,
        startDate: dateUtility.formatDateForAPI(searchStartDate),
        limit: 1500,
        offset: 0,
        count: undefined
      };
      if (searchEndDate !== null && searchEndDate !== '') {
        payload.endDate = dateUtility.formatDateForAPI(searchEndDate);
      } 
      
      showLoadingBar();
      companyStoresService.getStoreList(payload).then(getStoreNumbers, showApiErrors);
      $this.meta.offset += $this.meta.limit;
    };
    
  });
