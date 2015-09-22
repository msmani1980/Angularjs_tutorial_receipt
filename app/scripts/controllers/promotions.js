'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionsCtrl', function ($scope) {
    $scope.readOnly = false;

    $scope.viewName = 'Create Promotion';
    $scope.showProductPurchaseFields = true;

    $scope.promotion = {};
    $scope.promotion.qualifier = {};
    $scope.promotion.qualifier.productPurchase = {};
    $scope.promotion.qualifier.productPurchase.promotionCategories = [{}];
    $scope.promotion.qualifier.productPurchase.retailItems = [{}];
    $scope.promotion.qualifier.spendLimit = {};
    $scope.promotion.inclusionFilter = [{}];

    $scope.salesCategories = [];
    $scope.masterItems = [];

    $scope.showSpendLimitFields = true;
    $scope.companyCurrencyGlobals = [
      {code:'GBP'},
      {code:'EUR'}
    ];
    $scope.spendLimitCurrenciesRequired = true;
    $scope.benefitTypeIsDiscount = true;
    $scope.benefitTypeIsCoupon = true;
    $scope.benefitTypeIsVoucher = true;

    $scope.promotionCategoryQtyRequired = function(promotionCategory){
      // TODO - logic
      promotionCategory = null;
      return true;
    };

    $scope.addPromotionCategory = function(){
      // TODO - logic
    };

    $scope.removePromotionCategoryByIndex = function($index){
      // TODO - logic
      $index = null;
    };

    $scope.addRetailItem = function(){
      // TODO - logic
    };

    $scope.removeRetailItemByIndex = function($index){
      // TODO - logic
      $index = null;
    };

    $scope.retailItemQtyRequired = function(retailItem){
      // TODO - logic
      retailItem = null;
    };

    $scope.removeinclusionFilterByIndex = function($index){
      // TODO - logic
      $index = null;
    };

  });
