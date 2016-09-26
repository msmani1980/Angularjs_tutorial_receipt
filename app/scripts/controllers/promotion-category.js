'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryCtrl
 * @description
 * # PromotionCategoryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryCtrl', function ($scope, $routeParams, promotionCategoryFactory, $q, lodash) {

    $scope.itemList = [];
    $scope.promotionCategory = {};

    function showErrors() {

    }

    $scope.addItem = function () {
      var newIndex = $scope.itemList.length;
      $scope.itemList.push({ itemIndex: newIndex });
    };

    $scope.removeItem = function (item) {
      var itemIndex = lodash.indexOf($scope.itemList, item);
      if (angular.isDefined(itemIndex)) {
        $scope.itemList.splice(itemIndex, 1);
      }
    };

    $scope.filterItemListFromCategory = function (item) {
      var category = item.selectedCategory;
      var itemPayload = { categoryId: category.id };

      promotionCategoryFactory.getMasterItemList(itemPayload).then(function (response) {
        item.masterItemList = angular.copy(response.masterItems);
      }, showErrors());

    };

    function completeInit(responseCollection) {
      $scope.categoryList = angular.copy(responseCollection[0].salesCategories);

      if (responseCollection[1]) {
        $scope.promotionCategory = angular.copy(responseCollection[1]);
      }

    }

    function getDependencies() {
      var initPromises = [
        promotionCategoryFactory.getCategoryList()
      ];

      if ($routeParams.id) {
        initPromises.push(promotionCategoryFactory.getPromotionCategory($routeParams.id));
      }

      $q.all(initPromises).then(completeInit, showErrors);
    }

    function init() {
      getDependencies();
    }

    init();

  }
)
;
