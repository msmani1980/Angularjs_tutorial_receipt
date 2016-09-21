'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryListCtrl
 * @description
 * # PromotionCategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryListCtrl', function ($scope) {
    $scope.viewName = 'Promotion Categories';
    $scope.promotionCategories = null;

  });
