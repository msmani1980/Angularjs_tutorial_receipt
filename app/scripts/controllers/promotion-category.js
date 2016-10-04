'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryCtrl
 * @description
 * # PromotionCategoryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryCtrl', function ($scope, $routeParams, promotionCategoryFactory, globalMenuService, $q, lodash, messageService, dateUtility, $location) {

    $scope.itemList = [];
    $scope.promotionCategory = {};
    $scope.minDate = dateUtility.dateNumDaysAfterTodayFormatted(1);
    $scope.startMinDate = $routeParams.action === 'create' ? $scope.minDate : '';
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

      if ($routeParams.id) {
        payload.id = parseInt($routeParams.id);
      }

      payload.companyPromotionCategoryItems = [];
      angular.forEach($scope.itemList, function (item) {
        var newItem = formatItemPayload(item);
        if (newItem !== null) {
          payload.companyPromotionCategoryItems.push(newItem);
        }
      });

      return payload;
    }

    $scope.save = function () {
      if (!$scope.promotionCategoryForm.$valid) {
        return false;
      }

      showLoadingModal('Saving Record');
      var payload = formatPayload();

      if ($routeParams.id) {
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
      return angular.isDefined(item.masterItemList) ? item.masterItemList.length <= 0 : true;
    };

    function setFilteredItemList(dataFromAPI, item) {
      item.masterItemList = angular.copy(dataFromAPI.masterItems);
      var oldItemId = !!item.selectedItem ? item.selectedItem.id : null;
      var oldItemMatch = lodash.findWhere(item.masterItemList, { id: oldItemId });
      if (!oldItemMatch) {
        item.selectedItem = null;
      }
    }

    $scope.filterItemListFromCategory = function (item) {
      if (!item.selectedCategory) {
        item.masterItemList = angular.copy($scope.masterItemList);
        return;
      }

      var category = item.selectedCategory;
      var itemPayload = {
        categoryId: category.id,
        startDate: dateUtility.formatDateForAPI($scope.promotionCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCategory.endDate)
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
        endDate: dateUtility.formatDateForAPI($scope.promotionCategory.endDate)
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
      console.log(promotionCategory.endDate, promotionCategory.startDate);
      formatItemListForApp(promotionCategory, angular.copy(itemListFromAPI.masterItems));

      $scope.promotionCategory = promotionCategory;
    }

    this.setViewVariables = function () {
      var canEdit = false;

      if ($routeParams.action === 'edit' && $scope.promotionCategory) {
        var isInFuture = dateUtility.isAfterToday($scope.promotionCategory.startDate) && dateUtility.isAfterToday($scope.promotionCategory.endDate);
        var isInPast = dateUtility.isYesterdayOrEarlier($scope.promotionCategory.endDate);
        canEdit = isInFuture;
        $scope.isViewOnly = isInPast;
      } else {
        $scope.isViewOnly = $routeParams.action === 'view';
        canEdit = $routeParams.action === 'create';
      }

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
        getMasterItemList();
      }
    });

  }
)
;
