'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryCtrl
 * @description
 * # PromotionCategoryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryCtrl', function ($scope, $routeParams, promotionCategoryFactory, $q, lodash, messageService, dateUtility) {

    $scope.itemList = [];
    $scope.promotionCategory = {};

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors() {

    }

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

    function completeInit(responseCollection) {
      $scope.categoryList = angular.copy(responseCollection[0].salesCategories);

      if (responseCollection[1]) {
        formatPromotionCategoryForApp(responseCollection[1], responseCollection[2]);
      }

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
