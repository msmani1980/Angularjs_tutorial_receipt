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
      return item.masterItemList.length <= 0;
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
        item.masterItemList = [];
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

    function getMasterItemList() {
      showLoadingModal();
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.promotionCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCategory.endDate)
      };

      angular.forEach($scope.itemList, function (item) {
        $scope.filterItemListFromCategory(item);
      });

      promotionCategoryFactory.getMasterItemList(payload).then(function (response) {
        $scope.masterItemList = angular.copy(response.masterItems);
        hideLoadingModal();
      }, showErrors);
    }

    function completeInit(responseCollection) {
      $scope.categoryList = angular.copy(responseCollection[0].salesCategories);

      if (responseCollection[1]) {
        $scope.promotionCategory = angular.copy(responseCollection[1]);
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
