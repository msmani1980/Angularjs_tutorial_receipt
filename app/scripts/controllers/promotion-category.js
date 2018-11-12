'use strict';
/*jshint maxcomplexity:7 */
/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryCtrl
 * @description
 * # PromotionCategoryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryCtrl', function ($scope, $routeParams, promotionCategoryFactory, globalMenuService, $q, lodash, messageService, dateUtility, $location, $filter) {

    $scope.itemList = [];
    $scope.promotionCategory = {};
    $scope.minDate = dateUtility.dateNumDaysAfterTodayFormattedDatePicker(1);
    $scope.startMinDate = $routeParams.action === 'create' ? $scope.minDate : '';
    $scope.isCopy = false;
    $scope.masterItemsListFilterText = '';
    $scope.allCheckboxesSelected = false;
    var $this = this;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }

    function completeSave() {
      hideLoadingModal();
      var action = $routeParams.action === 'edit' ? 'updated' : 'created';
      messageService.display('success', 'Record successfully ' + action, 'Save Promotion Category');
      $location.path('promotion-category-list');
    }

    function formatItemPayload(item) {
      if (!item.selectedItem) {
        return null;
      }

      var newItem = {};
      newItem.itemId = item.selectedItem.id;

      if ($routeParams.id && item.recordId) {
        newItem.id = item.recordId;
      }

      if ($routeParams.id) {
        newItem.companyPromotionCategoryId = parseInt($routeParams.id);
      }

      if (item.selectedCategory) {
        newItem.salesCategoryId = item.selectedCategory.id;
      }

      return newItem;
    }

    function formatPayload() {
      var payload = {};
      payload.startDate = dateUtility.formatDateForAPI($scope.promotionCategory.startDate);
      payload.endDate = dateUtility.formatDateForAPI($scope.promotionCategory.endDate);
      payload.promotionCategoryName = $scope.promotionCategory.promotionCategoryName;
      payload.companyId = promotionCategoryFactory.getCompanyId();

      if ($routeParams.id && $routeParams.action !== 'copy') {
        payload.id = parseInt($routeParams.id);
      }

      payload.companyPromotionCategoryItems = [];
      angular.forEach($scope.itemList, function (item) {
        var newItem = formatItemPayload(item);
        if (newItem !== null) {
          if ($routeParams.action === 'copy') {
            if (angular.isDefined(newItem.id)) {
              delete newItem.id;
            }

            if (angular.isDefined(newItem.companyPromotionCategoryId)) {
              delete newItem.companyPromotionCategoryId;
            }
          }

          payload.companyPromotionCategoryItems.push(newItem);
        }
      });

      return payload;
    }

    function checkIfItemListIsValid() {
      var isValid = true;
      var isStartDateValid = dateUtility.isAfterToday($scope.promotionCategory.startDate);
      var isEndDateValid = dateUtility.isAfterOrEqualDatePicker($scope.promotionCategory.endDate, $scope.promotionCategory.startDate);
      $scope.errorCustom = [];
      if (!isStartDateValid && $routeParams.action === 'copy') {
        isValid = false;
        $scope.errorCustom.push({
          field: 'Start date',
          value: 'Start date must be greater than today'
        });
      }

      if (!isEndDateValid) {
        isValid = false;
        $scope.errorCustom.push({
          field: 'End date',
          value: 'End date must be greater than Start date'
        });
      }

      var isListValid = false;
      var hasExpiredItem = false;

      angular.forEach($scope.itemList, function (item) {
        isListValid = !!item.selectedItem || isListValid;
        if (item.isExpired && $routeParams.action === 'copy') {
          hasExpiredItem = true;
        }
      });

      if (hasExpiredItem) {
        isValid = false;
        $scope.errorCustom.push({
          field: 'Retail Items',
          value: 'At least one item is expired'
        });
      }

      if ($scope.itemList.length <= 0 || !isListValid) {
        isValid = false;
        $scope.errorCustom.push({
          field: 'Retail Items',
          value: 'At least one item must be selected'
        });
      }

      if (!isValid) {
        showErrors();
        return false;
      }

      return true;
    }

    $scope.save = function () {
      $scope.promotionCategoryForm.$setSubmitted(true);
    
      if ($scope.promotionCategoryForm.$submitted && !$scope.promotionCategoryForm.$valid) {
        $scope.displayError = true;
      } else {
        $scope.displayError = false;
      }

      if (!$scope.promotionCategoryForm.$valid) {
        return false;
      }

      var isListValid = checkIfItemListIsValid();
      if (!isListValid) {
        $scope.displayError = true;
        return false;
      } else {
        $scope.displayError = false;
      }

      showLoadingModal('Saving Record');
      var payload = formatPayload();
      if ($routeParams.id && $routeParams.action !== 'copy') {
        promotionCategoryFactory.updatePromotionCategory($routeParams.id, payload).then(completeSave, showErrors);
      } else {
        promotionCategoryFactory.createPromotionCategory(payload).then(completeSave, showErrors);
      }
    };

    $scope.addItem = function () {
      if (!$scope.promotionCategory.startDate && !$scope.promotionCategory.endDate) {
        messageService.display('warning', 'Please select a date range first', 'Add Promotion Category Item');
        return;
      }

      var newIndex = $scope.itemList.length;
      $scope.itemList.push({
        itemIndex: newIndex,
        masterItemList: angular.copy($scope.masterItemList)
      });
    };

    $scope.removeItem = function (item) {
      var itemIndex = lodash.indexOf($scope.itemList, item);
      if (angular.isDefined(itemIndex)) {
        $scope.itemList.splice(itemIndex, 1);
      }
    };

    $scope.shouldDisableItemDropDown = function (item) {
      if ($routeParams.action === 'copy') {
        return false; 
      }

      return angular.isDefined(item.masterItemList) ? item.masterItemList.length <= 0 : true;
    };

    $scope.onChangeItem = function (item) {
      item.isExpired = false;
    };

    function setFilteredItemList(dataFromAPI, item) {
      item.masterItemList = angular.copy(dataFromAPI.masterItems);
      var oldItemId = !!item.selectedItem ? item.selectedItem.id : null;
      var oldItemMatch = lodash.findWhere(item.masterItemList, { id: oldItemId });
      if (!oldItemMatch) {
        item.selectedItem = null;
      }

      if (angular.isDefined(item.selectedItem) && item.selectedItem !== null) {
        item.isExpired = isExpiredItem(item);
      }
    }

    function isExpiredItem (item) {
      if (!item.selectedItem) {
        return false;
      }

      var itemMaster = lodash.find(item.masterItemList, { id: item.selectedItem.id });
      var isExpired = false;
      
      if ($scope.promotionCategory && $scope.promotionCategory.startDate && $scope.promotionCategory.endDate) {
        var isCategoryDatesValid = dateUtility.isAfterOrEqualDatePicker($scope.promotionCategory.endDate, $scope.promotionCategory.startDate);
        isExpired = isCategoryDatesValid ? true : false;

        if (isCategoryDatesValid && angular.isDefined(itemMaster) && angular.isDefined(itemMaster.versions)) {
          angular.forEach(itemMaster.versions, function (version) {
            if (angular.isDefined(version.startDate) && angular.isDefined(version.endDate)) {
              var itemStartDate = dateUtility.formatDateForApp(version.startDate);	
              var itemEndDate = dateUtility.formatDateForApp(version.endDate);	
              var isStartValid = dateUtility.isAfterOrEqualDatePicker($scope.promotionCategory.endDate, itemStartDate);
              var isEndValid = dateUtility.isAfterOrEqualDatePicker(itemEndDate, $scope.promotionCategory.startDate);
              if (isStartValid && isEndValid) {    
                isExpired = false;
              }
            }
          });
        }
      }  

      return isExpired;
    } 

    $scope.filterItemListFromCategory = function (item) {
      if (!item.selectedCategory) {
        item.masterItemList = angular.copy($scope.masterItemList);

        item.isExpired = isExpiredItem(item);
        return;
      }

      var category = item.selectedCategory;
      var itemPayload = {
        categoryId: category.id,
        startDate: dateUtility.formatDateForAPI($scope.promotionCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCategory.endDate),
        ignoreDryStrore: true
      };

      promotionCategoryFactory.getMasterItemList(itemPayload).then(function (response) {
        setFilteredItemList(response, item);
      }, showErrors);

    };

    function setMasterItemList(dataFromAPI) {
      $scope.masterItemList = angular.copy(dataFromAPI.masterItems);

      angular.forEach($scope.itemList, function (item) {
        $scope.filterItemListFromCategory(item);
      });

      hideLoadingModal();
    }

    function getMasterItemList() {
      showLoadingModal();
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.promotionCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCategory.endDate),
        ignoreDryStrore: true
      };

      promotionCategoryFactory.getMasterItemList(payload).then(setMasterItemList, showErrors);
    }

    function formatItemListForApp(promotionCategory, itemList) {
      angular.forEach(promotionCategory.companyPromotionCategoryItems, function (item) {
        var newItem = {};
        var categoryMatch = lodash.findWhere($scope.categoryList, { id: item.salesCategoryId });
        var itemMatch = lodash.findWhere(itemList, { id: item.itemId });
        newItem.selectedCategory = categoryMatch || null;
        newItem.selectedItem = itemMatch || null;
        newItem.masterItemList = [];
        newItem.recordId = item.id;
        $scope.itemList.push(newItem);
      });
    }

    function formatPromotionCategoryForApp(promotionCategoryFromAPI, itemListFromAPI) {
      var promotionCategory = angular.copy(promotionCategoryFromAPI);
      promotionCategory.startDate = dateUtility.formatDateForApp(promotionCategory.startDate);
      promotionCategory.endDate = dateUtility.formatDateForApp(promotionCategory.endDate);
      formatItemListForApp(promotionCategory, angular.copy(itemListFromAPI.masterItems));

      $scope.promotionCategory = promotionCategory;
    }

    this.setViewVariables = function () {
      var canEdit = false;

      if ($routeParams.action === 'edit' && $scope.promotionCategory) {
        var isInFuture = dateUtility.isAfterTodayDatePicker($scope.promotionCategory.startDate) && dateUtility.isAfterTodayDatePicker($scope.promotionCategory.endDate);
        var isInPast = dateUtility.isYesterdayOrEarlierDatePicker($scope.promotionCategory.endDate);
        canEdit = isInFuture;
        $scope.isViewOnly = isInPast;
      } else if ($routeParams.action === 'copy') {
        canEdit = true;
        $scope.isCopy = true;
      } else {
        $scope.isViewOnly = $routeParams.action === 'view';
        canEdit = $routeParams.action === 'create';
      }

      $scope.displayError = false;
      $scope.disableEditField = !canEdit || $scope.isViewOnly;
    };

    function completeInit(responseCollection) {
      $scope.categoryList = angular.copy(responseCollection[0].salesCategories);

      if (responseCollection[1]) {
        formatPromotionCategoryForApp(responseCollection[1], responseCollection[2]);
      }

      $this.setViewVariables();      
      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Data');
      var initPromises = [
        promotionCategoryFactory.getCategoryList()
      ];

      if ($routeParams.id) {
        initPromises.push(promotionCategoryFactory.getPromotionCategory($routeParams.id));
        initPromises.push(promotionCategoryFactory.getMasterItemList({}));
      }

      $q.all(initPromises).then(completeInit, showErrors);
    }

    init();

    $scope.$watchGroup(['promotionCategory.startDate', 'promotionCategory.endDate'], function () {
      if ($scope.promotionCategory && $scope.promotionCategory.startDate && $scope.promotionCategory.endDate) {
        if (dateUtility.isAfterOrEqualDatePicker($scope.promotionCategory.endDate, $scope.promotionCategory.startDate)) {
          getMasterItemList();
        }
      }
    });
    
    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };

    $scope.populateAllSelectedItems = function() {
      var isFirst = true;
      var newIndex = $scope.indexToPutNewPromotionCategories;

      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        if (masterItem.isItemSelected) {
          newIndex = isFirst ? newIndex : ++newIndex;

          $scope.itemList.splice(newIndex, isFirst ? 1 : 0, {
            itemIndex: newIndex,
            selectedItem: masterItem,
            masterItemList: angular.copy($scope.masterItemList)
          });

          isFirst = false;
        }
      });

      hideMasterItemsDialog();
    };

    $scope.modalItemAlreadySelected = function (item) {
      return !lodash.find($scope.itemList, { id: item.id });
    };

    $scope.filterMasterItemsList = function () {
      $scope.masterItemsListSearch = angular.copy($scope.masterItemsListFilterText);
      $scope.filteredMasterItemList = $filter('filter')($scope.modalMasterItemList, { itemName: $scope.masterItemsListSearch });

      $scope.deselectFilteredOutItems();

      if ($scope.areAllItemsSelected()) {
        $scope.allCheckboxesSelected = true;
      } else {
        $scope.allCheckboxesSelected = false;
      }
    };

    $scope.deselectFilteredOutItems = function () {
      var filteredOutItems = $scope.modalMasterItemList.filter(function (masterItem) {
        return $scope.filteredMasterItemList.indexOf(masterItem) === -1;
      });

      filteredOutItems.forEach(function (masterItem) {
        masterItem.isItemSelected = false;
      });
    };

    $scope.areAllItemsSelected = function () {
      if ($scope.filteredMasterItemList.length === 0) {
        return false;
      }

      var selectedCount = 0;

      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        if (masterItem.isItemSelected) {
          selectedCount = selectedCount + 1;
        }
      });

      return selectedCount === $scope.filteredMasterItemList.length;
    };

    $scope.selectAllItems = function () {
      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        masterItem.isItemSelected = true;
      });
    };

    $scope.toggleAllCheckboxes = function() {
      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        masterItem.isItemSelected = $scope.allCheckboxesSelected;
      });
    };

    $scope.toggleSelectAll = function() {
      var toggleAll = false;
      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        if (!masterItem.isItemSelected) {
          toggleAll = true;
        }
      });

      $scope.allCheckboxesSelected = !toggleAll;
    };

    $scope.clearModalCheckboxes = function () {
      $scope.allCheckboxesSelected = false;

      angular.forEach($scope.filteredMasterItemList, function(masterItem) {
        masterItem.isItemSelected = false;
      });
    };

    $scope.resetModalState = function () {
      $scope.masterItemsListFilterText = '';
      $scope.masterItemsListSearch = undefined;

      $scope.clearModalCheckboxes();
    };

    $scope.showMasterItemsModal = function (item, index) {
      $scope.resetModalState();

      $scope.indexToPutNewPromotionCategories = index;

      var selectedItemIds = $scope.itemList.filter(function (item) {
          return item.selectedItem;
        }).map(function (item) {
          return item.selectedItem.id;
        });

      $scope.modalMasterItemList = lodash.filter(item.masterItemList, function (masterItem) {
        var itemNotAddedYet = selectedItemIds.indexOf(masterItem.id) === -1;

        return itemNotAddedYet;
      });

      $scope.filteredMasterItemList = $scope.modalMasterItemList;

      showMasterItemsDialog();
    };

    $scope.isAnyItemExpired = function () {
      return lodash.find($scope.itemList, { isExpired: true });
    };

    function showMasterItemsDialog() {
      angular.element('#master-items').modal('show');
    }

    function hideMasterItemsDialog() {
      angular.element('#master-items').modal('hide');
    }

  }
)
;
