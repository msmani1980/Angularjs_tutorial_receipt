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
    $scope.promotion.promotionCode = 'ABC1234';
    $scope.promotion.promotionName = 'Test Name';
    $scope.promotion.promotionDescription = 'Test Decription';
    $scope.promotion.effectiveDateFrom = '09/22/2015';
    $scope.promotion.effectiveDateTo = '10/22/2015';
    $scope.promotion.qualifier = {};
    $scope.promotion.qualifier.type = {id:1, name:'Product Purchase'};
    $scope.promotion.qualifier.productPurchase = {};
    $scope.promotion.qualifier.productPurchase.promotionCategories = [
      {
        promotionCategory: {
          companyId: 403,
          endDate: "2018-12-31",
          id: 63,
          promotionCategoryName: "PromoCategory1",
          promotionCount: "28",
          selectedItems: "28",
          startDate: "2015-05-13",
        },
        qty: 123
      },
      {
        promotionCategory: {
          companyId: 403,
          endDate: "2050-12-31",
          id: 65,
          promotionCategoryName: "Soft Drinks",
          promotionCount: "15",
          selectedItems: "15",
          startDate: "2015-05-15",
        },
        qty: 432
      }
    ];
    $scope.promotion.qualifier.productPurchase.retailItems = [
      {
        salesCategory: {
          childCategoryCount: null,
          children: null,
          companyId: 403,
          countTotalSubcategories: null,
          description: 'Rental Items',
          id: 206,
          itemCount: '15',
          name: 'Rentals',
          nextCategoryId: 221,
          parentId: null,
          salesCategoryPath: 'Rentals'
        },
        retailItem: {
          companyId: 403,
          createdBy: null,
          createdOn: '2015-06-26 20:16:21.079879',
          id: 93,
          itemCode: '1234567max',
          itemName: '1234567max',
          onBoardName: null,
          updatedBy: null,
          updatedOn: null
        },
        qty: 432
      },
      {
        salesCategory: {
          childCategoryCount: null,
          children: null,
          companyId: 403,
          countTotalSubcategories: null,
          description: 'Softer drinks',
          id: 205,
          itemCount: '28',
          name: 'Softer drinks',
          nextCategoryId: 207,
          parentId: null,
          salesCategoryPath: 'Softer drinks'
        },
        retailItem: {
          companyId: 403,
          createdBy: null,
          createdOn: '2015-07-24 19:40:15.030182',
          id: 185,
          itemCode: '3184623874',
          itemName: '3184623874',
          onBoardName: '3184623874',
          updatedBy: null,
          updatedOn: '2015-07-24 19:41:12.928064',
        },
        qty: 567
      }
    ];
    $scope.promotion.qualifier.spendLimit = {};
    $scope.promotion.qualifier.spendLimit.promotionCategory = {
      companyId: 403,
      endDate: "2018-12-31",
      id: 63,
      promotionCategoryName: "PromoCategory1",
      promotionCount: "28",
      selectedItems: "28",
      startDate: "2015-05-13",
    };
    $scope.promotion.inclusionFilter = [{}];
    $scope.promotion.qualifier.spendLimit.value = [];
    $scope.promotion.qualifier.spendLimit.value['GBP'] = 432.1234;
    $scope.promotion.qualifier.spendLimit.value['EUR'] = 456.1264;

    $scope.promotion.benefits = {};
    $scope.promotion.benefits.type = {id:1, name:'Discount'};
    $scope.promotion.benefits.discount = {id:2, name:'Amount'};

    // UI Select options
    $scope.promotionTypes = [
      {id:1, name:'Product Purchase'},
      {id:2, name:'Spend Limit'}
    ];
    $scope.benefitTypes = [
      {id:1, name:'Discount'},
      {id:2, name:'Coupon'},
      {id:3, name:'Voucher'}
    ];
    $scope.discountTypes = [
      {id:1, name:'Percentage'},
      {id:2, name:'Amount'}
    ];
    $scope.promotionCategories = [
      {
        companyId: 403,
        endDate: "2018-12-31",
        id: 63,
        promotionCategoryName: "PromoCategory1",
        promotionCount: "28",
        selectedItems: "28",
        startDate: "2015-05-13",
      },
      {
        companyId: 403,
        endDate: "2015-05-30",
        id: 64,
        promotionCategoryName: "name test",
        promotionCount: "0",
        selectedItems: "1",
        startDate: "2015-05-14",
      },
      {
        companyId: 403,
        endDate: "2050-12-31",
        id: 65,
        promotionCategoryName: "Soft Drinks",
        promotionCount: "15",
        selectedItems: "15",
        startDate: "2015-05-15",
      },
      {
        companyId: 403,
        endDate: "2050-12-31",
        id: 66,
        promotionCategoryName: "Technology",
        promotionCount: "8",
        selectedItems: "8",
        startDate: "2015-05-15",
      },
      {
        companyId: 403,
        endDate: "2015-07-31",
        id: 67,
        promotionCategoryName: "newCat",
        promotionCount: "0",
        selectedItems: "1",
        startDate: "2015-07-09"
      }
    ];
    $scope.salesCategories = [
      {
        childCategoryCount: null,
        children: null,
        companyId: 403,
        countTotalSubcategories: null,
        description: 'Softer drinks',
        id: 205,
        itemCount: '28',
        name: 'Softer drinks',
        nextCategoryId: 207,
        parentId: null,
        salesCategoryPath: 'Softer drinks'
      },
      {
        childCategoryCount: null,
        children: null,
        companyId: 403,
        countTotalSubcategories: null,
        description: 'Rental Items',
        id: 206,
        itemCount: '15',
        name: 'Rentals',
        nextCategoryId: 221,
        parentId: null,
        salesCategoryPath: 'Rentals'
      }
    ];
    // TODO - get master items WITHOUT VERSIONS!
    $scope.masterItems = [
      {
        companyId: 403,
        createdBy: null,
        createdOn: '2015-06-26 20:16:21.079879',
        id: 93,
        itemCode: '1234567max',
        itemName: '1234567max',
        onBoardName: null,
        updatedBy: null,
        updatedOn: null
      },
      {
        companyId: 403,
        createdBy: null,
        createdOn: '2015-07-24 19:40:15.030182',
        id: 185,
        itemCode: '3184623874',
        itemName: '3184623874',
        onBoardName: '3184623874',
        updatedBy: null,
        updatedOn: '2015-07-24 19:41:12.928064',
      }
    ];

    $scope.showSpendLimitFields = true;
    $scope.companyCurrencyGlobals = [
      {
        code: 'GBP',
        companyId: 403,
        id: 8,
        name: 'British Pound'
      },
      {
        code: 'EUR',
        companyId: 403,
        id: 9,
        name: 'Euro'
      }
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
