'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionsCtrl', function ($scope, $routeParams, $q, $filter, $location, promotionsFactory, ngToast, dateUtility) {

    $scope.readOnly = true;
    $scope.viewName = 'Create Promotion';
    $scope.activeBtn = 'promotion-information';
    $scope.selectOptions = {};

    // Promotion object
    $scope.promotion = {};
    $scope.promotion.qualifier = {};
    $scope.promotion.qualifier.productPurchase = {};
    $scope.promotion.qualifier.spendLimit = {};
    $scope.promotion.qualifier.spendLimit.values = [];
    $scope.promotion.benefits = {};
    $scope.promotion.benefits.discount = {};
    $scope.promotion.benefits.discount.applyTo = {};
    $scope.promotion.benefits.discount.applyTo.retailItem = {};
    $scope.promotion.benefits.discount.percentage = {};
    $scope.promotion.benefits.discount.amounts = [];
    $scope.promotion.inclusionFilters = [];

    /* TODO - Mock data, will remove once API hookedup */
    /*
    // Promotion general
    $scope.promotion.promotionCode = 'ABC1234';
    $scope.promotion.promotionName = 'Test Name';
    $scope.promotion.promotionDescription = 'Test Decription';
    $scope.promotion.effectiveDateFrom = '09/22/2015';
    $scope.promotion.effectiveDateTo = '10/22/2015';
    */
    /*
    // Qualifiers
    // $scope.promotion.qualifier = {};
    $scope.promotion.qualifier.type = {id:1, name:'Product Purchase'};
    // $scope.promotion.qualifier.productPurchase = {};
    $scope.promotion.qualifier.productPurchase.promotionCategories = [
      {
        promotionCategory: {
          companyId: 403,
          endDate: '2018-12-31',
          id: 63,
          promotionCategoryName: 'PromoCategory1',
          promotionCount: '28',
          selectedItems: '28',
          startDate: '2015-05-13',
        },
        qty: 123
      },
      {
        promotionCategory: {
          companyId: 403,
          endDate: '2050-12-31',
          id: 65,
          promotionCategoryName: 'Soft Drinks',
          promotionCount: '15',
          selectedItems: '15',
          startDate: '2015-05-15',
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
    // $scope.promotion.qualifier.spendLimit = {};
    $scope.promotion.qualifier.spendLimit.promotionCategory = {
      companyId: 403,
      endDate: '2018-12-31',
      id: 63,
      promotionCategoryName: 'PromoCategory1',
      promotionCount: '28',
      selectedItems: '28',
      startDate: '2015-05-13',
    };
    // $scope.promotion.qualifier.spendLimit.value = [];
    $scope.promotion.qualifier.spendLimit.value.push({GBP:432.1234});
    $scope.promotion.qualifier.spendLimit.value.push({EUR:456.1264});
    // Benefits
    // $scope.promotion.benefits = {};
    $scope.promotion.benefits.type = {id:1, name:'Discount'};
    // $scope.promotion.benefits.discount = {};
    $scope.promotion.benefits.discount.rateType = {id:2, name:'Amount'};
    // $scope.promotion.benefits.discount.applyTo = {};
    $scope.promotion.benefits.discount.applyTo.type = {id: 2, name: 'Promotion Qualifier'};
    $scope.promotion.benefits.discount.applyTo.promotionCategory = { // TODO test
      companyId: 403,
      endDate: '2018-12-31',
      id: 63,
      promotionCategoryName: 'PromoCategory1',
      promotionCount: '28',
      selectedItems: '28',
      startDate: '2015-05-13',
    };
    // $scope.promotion.benefits.discount.applyTo.retailItem = {};
    $scope.promotion.benefits.discount.applyTo.retailItem.retailItem = {
      companyId: 403,
      createdBy: null,
      createdOn: '2015-06-26 20:16:21.079879',
      id: 93,
      itemCode: '1234567max',
      itemName: '1234567max',
      onBoardName: null,
      updatedBy: null,
      updatedOn: null
    };
    $scope.promotion.benefits.discount.applyTo.retailItem.giftWithPurchase = true;
    // $scope.promotion.benefits.discount.percentage = {}; // TODO Unit test below when promotion.benefits.discount.rateType = 'Percent'
    $scope.promotion.benefits.discount.percentage.value = 50;
    $scope.promotion.benefits.discount.percentage.lowestPricedArticle = true;
    // $scope.promotion.benefits.discount.amount = [];
    $scope.promotion.benefits.discount.amount.push({GBP:234.43});
    $scope.promotion.benefits.discount.amount.push({EUR:432.12});
    $scope.promotion.benefits.coupon = {
      companyDiscountRestrictions: false,
      companyId: 403,
      discountTypeId: 1,
      discountTypeName: 'Coupon',
      endDate: '2050-12-31',
      id: 102,
      name: '10% off',
      rateTypeId: 1,
      rateTypeName: 'Percentage',
      startDate: '2015-05-09'
    };
    $scope.promotion.benefits.voucher = {
      companyDiscountRestrictions: false,
      companyId: 403,
      discountTypeId: 4,
      discountTypeName: 'Voucher',
      endDate: '2015-12-31',
      id: 109,
      name: 'Executive discount - Autumn edition',
      rateTypeId: 1,
      rateTypeName: 'Percentage'
    };
    // Inclusion Filter
    $scope.promotion.inclusionFilters = [];
    $scope.promotion.inclusionFilters = [
      {
        departureStation : {
          code: 'ORD',
          companyId: 403,
          id: 1,
          name: 'Chicago O-hare'
        },
        arrivalStation : {
          code: 'SAN',
          companyId: 403,
          id: 4,
          name: 'San Jose'
        }
      },
      {
        departureStation : {
          code: 'LON3',
          companyId: 403,
          id: 3,
          name: 'London'
        },
        arrivalStation : {
          code: 'SAN',
          companyId: 403,
          id: 4,
          name: 'San Jose'
        }
      }
    ];
    /**/

    /* TODO - Mock data, will remove after API calls are validated. *//*
    // Currency array
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

    // UI Select options

    $scope.selectOptions.promotionTypes = [
      {id:1, name:'Product Purchase'},
      {id:2, name:'Spend Limit'}
    ];
    $scope.selectOptions.benefitTypes = [
      {id:1, name:'Discount'},
      {id:2, name:'Coupon'},
      {id:3, name:'Voucher'}
    ];
    $scope.selectOptions.discountTypes = [
      {id:1, name:'Percentage'},
      {id:2, name:'Amount'}
    ];
    $scope.selectOptions.promotionCategories = [
      {
        companyId: 403,
        endDate: '2018-12-31',
        id: 63,
        promotionCategoryName: 'PromoCategory1',
        promotionCount: '28',
        selectedItems: '28',
        startDate: '2015-05-13',
      },
      {
        companyId: 403,
        endDate: '2015-05-30',
        id: 64,
        promotionCategoryName: 'name test',
        promotionCount: '0',
        selectedItems: '1',
        startDate: '2015-05-14',
      },
      {
        companyId: 403,
        endDate: '2050-12-31',
        id: 65,
        promotionCategoryName: 'Soft Drinks',
        promotionCount: '15',
        selectedItems: '15',
        startDate: '2015-05-15',
      },
      {
        companyId: 403,
        endDate: '2050-12-31',
        id: 66,
        promotionCategoryName: 'Technology',
        promotionCount: '8',
        selectedItems: '8',
        startDate: '2015-05-15',
      },
      {
        companyId: 403,
        endDate: '2015-07-31',
        id: 67,
        promotionCategoryName: 'newCat',
        promotionCount: '0',
        selectedItems: '1',
        startDate: '2015-07-09'
      }
    ];
    $scope.selectOptions.salesCategories = [
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
    $scope.selectOptions.masterItems = [
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
    $scope.selectOptions.discountApplyTypes = [
      {id: 1, name: 'Cart'},
      {id: 2, name: 'Promotion Qualifier'},
      {id: 3, name: 'Promotion Category'},
      {id: 4, name: 'Retail Item'}
    ];
    $scope.selectOptions.companyDiscountsCoupon = [ // API Call /api/company-discounts?discountTypeId=1&startDate=20150922
      {
        companyDiscountRestrictions: false,
        companyId: 403,
        discountTypeId: 1,
        discountTypeName: 'Coupon',
        endDate: '2050-12-31',
        id: 102,
        name: '10% off',
        rateTypeId: 1,
        rateTypeName: 'Percentage',
        startDate: '2015-05-09'
      }
    ];
    $scope.selectOptions.companyDiscountsVoucher = [ // API Call /api/company-discounts?discountTypeId=4&startDate=20150922
      {
        companyDiscountRestrictions: false,
        companyId: 403,
        discountTypeId: 4,
        discountTypeName: 'Voucher',
        endDate: '2015-12-31',
        id: 109,
        name: 'Executive discount - Autumn edition',
        rateTypeId: 1,
        rateTypeName: 'Percentage'
      }
    ];
    $scope.selectOptions.companyStationGlobals = [
      {
        code: 'ORD',
        companyId: 403,
        id: 1,
        name: 'Chicago O-hare'
      },
      {
        code: 'MDW',
        companyId: 403,
        id: 2,
        name: 'Chicago Midway'
      },
      {
        code: 'LON3',
        companyId: 403,
        id: 3,
        name: 'London'
      },
      {
        code: 'SAN',
        companyId: 403,
        id: 4,
        name: 'San Jose'
      }
    ];
    /**/

    // private controller vars
    var _companyId = promotionsFactory.getCompanyId();
    var _initPromises = [];
    var states = {};
    var _payload = null;
    states.createInit = function(){
      getPromotionMetaData();
    };
    // private controller functions
    function showMessage(message, messageType) {
      if(!messageType){
        messageType = 'info';
      }
      ngToast.create({className: messageType, dismissButton: true, content: '<strong>Promotion</strong>: ' + message});
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function payloadGenerate(){
      _payload = {
        promotionCode: $scope.promotion.promotionCode,
        promotionName: $scope.promotion.promotionName,
        description: $scope.promotion.promotionDescription,
        startDate: dateUtility.formatDateForAPI($scope.promotion.effectiveDateFrom),
        endDate: dateUtility.formatDateForAPI($scope.promotion.effectiveDateTo)
      };

      /* Qualifier Types */
      // Qualifier Type = Product Purchase
      _payload.promotionTypeId = $scope.promotion.qualifier.type.id;
      if($scope.promotion.qualifier.type.id === 1){
        /*
         $scope.promotion.qualifier.productPurchase.promotionCategories = [
         {
         promotionCategory: {
         companyId: 403,
         endDate: '2018-12-31',
         id: 63,
         promotionCategoryName: 'PromoCategory1',
         promotionCount: '28',
         selectedItems: '28',
         startDate: '2015-05-13',
         },
         qty: 123
         },
         {
         promotionCategory: {
         companyId: 403,
         endDate: '2050-12-31',
         id: 65,
         promotionCategoryName: 'Soft Drinks',
         promotionCount: '15',
         selectedItems: '15',
         startDate: '2015-05-15',
         },
         qty: 432
         }
         ];
         */
        /*
        _payload.promotionCategories = [ // TODO loop these
          {categoryQty:'12',companyPromotionCategoryId:'63'}
        ];
        */
        _payload.promotionCategories = $scope.promotion.qualifier.productPurchase.promotionCategories.map(function(prodCat){
          return {
            companyPromotionCategoryId: prodCat.id,
            categoryQty:prodCat.qty
          };
        });
        /*
        _payload.items = [ // TODO loops these
          {itemQty:'2',itemId:'9'},
          {itemQty:'1',itemId:'7'}
        ];
        */
        /*
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
         */
        _payload.items = $scope.promotion.qualifier.productPurchase.retailItems.map(function(retailItemData){
          return {
            itemQty:retailItemData.qty,
            itemId:retailItemData.retailItem.id
          };
        });
      }
      // Qualifier Type = Spend Limit
      if($scope.promotion.qualifier.type.id === 2){
        /*
        _payload.spendLimitAmounts = [ // TODO loop these
          {amount:12,companyCurrencyId:'8'},
          {amount:12,companyCurrencyId:'9'}
        ];
        */

        _payload.spendLimitAmounts = $scope.promotion.qualifier.spendLimit.value.map(function(amount, index){

        });
        _payload.spendLimitCategoryId = '65';
      }

      /* Benefit Types */
      _payload.benefitTypeId = $scope.promotion.benefits.type.id;
      // Benefit Type = Discount
      if($scope.promotion.benefits.type.id === 1){
        /* Discount Rate Types */
        // Discount Rate Type - Percentage
        _payload.discountTypeId = $scope.promotion.benefits.discount.rateType.id;
        if($scope.promotion.benefits.discount.rateType.id === 1){
          _payload.discountPercentage = '33'; // TODO get value
          _payload.lowestPricedArticle = 'true'; // TODO get value
        }
        // Discount Rate Type - Amount
        if($scope.promotion.benefits.discount.rateType.id === 2){
          _payload.benefitAmounts = [ // TODO loops these
            {amount: 432, companyCurrencyId: "8"},
            {amount: 543, companyCurrencyId: "9"}
          ];
        }

        // Set apply to type
        /* Apply Tos */
        // Apply to - Promotion Category
        _payload.benefitDiscountApplyId = $scope.promotion.benefits.discount.applyTo.type.id;
        if($scope.promotion.benefits.discount.applyTo.type.id === 3 ){
          _payload.discountCategoryId = '66';
        }
        // Apply to - Retail Item
        if($scope.promotion.benefits.discount.applyTo.type.id === 4 ){
          _payload.discountItemId = 187; // TODO get value
          _payload.giftWithPurchase = "true"; // TODO get value
        }
      }
      // Benefit Type = Coupon
      if($scope.promotion.benefits.type.id === 2){
        _payload.companyCouponId = '102'; // TODO Get value
      }
      // Benefit Type = Voucher
      if($scope.promotion.benefits.type.id === 3){
        _payload.companyVoucherId = '109'; // TODO get value
      }

      // Promotion Inclusion Filter
      _payload.filters = [ // TODO loops this
        {departureStationId:'8',arrivalStationId:'6'}
      ];

    }

    function showResponseErrors(response) {
      if ('data' in response) {
        angular.forEach(response.data, function (error) {
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function throwError(field, message){
      if(!message){
        message = 'Action not allowed';
      }
      var error = {
        data: [{
          field: field,
          value: message
        }]
      };
      showResponseErrors(error);
    }

    function setBenefitTypes(dataFromAPI){
      $scope.selectOptions.benefitTypes = dataFromAPI;
    }

    function getBenefitTypes(){
      _initPromises.push(
        promotionsFactory.getBenefitTypes().then(setBenefitTypes)
      );
    }

    function setDiscountTypes(dataFromAPI){
      $scope.selectOptions.discountTypes = dataFromAPI;
    }

    function getDiscountTypes(){
      _initPromises.push(
        promotionsFactory.getDiscountTypes().then(setDiscountTypes)
      );
    }

    function setPromotionTypes(dataFromAPI){
      $scope.selectOptions.promotionTypes = dataFromAPI;
    }

    function getPromotionTypes(){
      _initPromises.push(
        promotionsFactory.getPromotionTypes().then(setPromotionTypes)
      );
    }

    function setCompanyDiscountsCoupon(dataFromAPI){
      $scope.selectOptions.companyDiscountsCoupon = dataFromAPI.companyDiscounts;
    }

    function getCompanyDiscountsCoupon(){
      _initPromises.push(
        promotionsFactory.getCompanyDiscountsCoupon().then(setCompanyDiscountsCoupon)
      );
    }

    function setCompanyDiscountsVoucher(dataFromAPI){
      $scope.selectOptions.companyDiscountsVoucher = dataFromAPI.companyDiscounts;
    }

    function getCompanyDiscountsVoucher(){
      _initPromises.push(
        promotionsFactory.getCompanyDiscountsVoucher().then(setCompanyDiscountsVoucher)
      );
    }

    function setSalesCategories(dataFromAPI){
      $scope.selectOptions.salesCategories = dataFromAPI.salesCategories;
    }

    function getSalesCategories(){
      _initPromises.push(
        promotionsFactory.getSalesCategories().then(setSalesCategories)
      );
    }

    function setDiscountApplyTypes(dataFromAPI){
      $scope.selectOptions.discountApplyTypes = dataFromAPI;
    }

    function getDiscountApplyTypes(){
      _initPromises.push(
        promotionsFactory.getDiscountApplyTypes().then(setDiscountApplyTypes)
      );
    }

    function setPromotionCategories(dataFromAPI){
      $scope.selectOptions.promotionCategories = dataFromAPI.companyPromotionCategories;
    }

    function getPromotionCategories(){
      _initPromises.push(
        promotionsFactory.getPromotionCategories().then(setPromotionCategories)
      );
    }

    function setStationGlobals(dataFromAPI){
      $scope.selectOptions.companyStationGlobals = dataFromAPI.response;
    }

    function getStationGlobals(){
      _initPromises.push(
        promotionsFactory.getStationGlobals().then(setStationGlobals)
      );
    }

    function setCurrencyGlobals(dataFromAPI){
      $scope.companyCurrencyGlobals = dataFromAPI.response;
      angular.forEach(dataFromAPI.response, function(currency){
        var currencyModel = {
          id: angular.copy(currency.id),
          code: angular.copy(currency.code),
          value: null
        };
        $scope.promotion.qualifier.spendLimit.values.push(currencyModel);
        $scope.promotion.benefits.discount.amounts.push(currencyModel)
      });
    }

    function getCurrencyGlobals(){
      _initPromises.push(
        promotionsFactory.getCurrencyGlobals({isOperatedCurrency:true}).then(setCurrencyGlobals)
      );
    }

    function setMasterItems(dataFromAPI){
      $scope.selectOptions.masterItems = dataFromAPI.masterItems;
    }

    function getMasterItems(){
      _initPromises.push(
        promotionsFactory.getMasterItems({companyId:_companyId}).then(setMasterItems)
      );
    }

    function initPromisesResolved(){
      hideLoadingModal();
      var today = dateUtility.nowFormatted('YYYYMMDD');
      showMessage('Background APIs loaded, ' + today);
      $scope.readOnly = ($routeParams.state === 'view');
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function getPromotionMetaData(){
      displayLoadingModal();
      getBenefitTypes();
      getDiscountTypes();
      getPromotionTypes();
      getCompanyDiscountsCoupon();
      getCompanyDiscountsVoucher();
      getSalesCategories();
      getDiscountApplyTypes();
      getPromotionCategories();
      getStationGlobals();
      getCurrencyGlobals();
      getMasterItems();
      resolveInitPromises();
    }

    function init(){

      $scope.displayError = false;
      $scope.formErrors = [];

      var initState = $routeParams.state + 'Init';
      if (states[initState]) {
        states[initState]();
      } else {
        throwError('routeParams.action');
      }

      //

    }
    init();

    // Scope functions
    $scope.addBlankObjectToArray = function(_array){
      if($scope.readOnly){
        return;
      }
      _array.push({});
    };

    $scope.removeFromArrayByIndex = function(_array, $index){
      if($scope.readOnly){
        return;
      }
      _array.splice($index, 1);
    };

    $scope.promotionCategoryQtyRequired = function(promotionCategoryData){
      return angular.isDefined(promotionCategoryData.promotionCategory);
    };

    $scope.retailItemQtyRequired = function(retailItemData){
      return angular.isDefined(retailItemData.retailItem);
    };

    $scope.scrollToAnchor = function(id){
      $scope.activeBtn = id;
      var elm = angular.element('#' + id);
      if(!elm || !elm.length){
        return;
      }
      var body = angular.element('body');
      var navBar = angular.element('.navbar-header').height();
      var topBar = angular.element('.top-header').height();
      body.animate({
        scrollTop: elm.offset().top - (navBar + topBar + 20)
      }, 'slow');
    };

    $scope.save = function(){ // TODO test
      console.log($scope.promotion.qualifier.spendLimit.values);
      console.log($scope.promotion.benefits.discount.amounts);
    };

  });
