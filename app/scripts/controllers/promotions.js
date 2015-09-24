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

    // Scope models
    $scope.promotionCode = null;
    $scope.promotionName = null;
    $scope.promotionDescription = null;
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.promotionQualifierType = {id:null};
    $scope.promotionCategories = [];
    $scope.items = [];
    $scope.spendLimitCategory = {id:null};
    $scope.spendLimitAmounts = [];
    $scope.benefitType = {id:null};
    $scope.discountType = {id:null};
    $scope.benefitDiscountApply = {id:null};
    $scope.discountItem = {id:null};
    $scope.giftWithPurchase = false;
    $scope.discountCategory = {id:null};
    $scope.companyCoupon = {id:null};
    $scope.companyVoucher = {id:null};
    $scope.discountPercentage = null;
    $scope.lowestPricedArticle = false;
    $scope.benefitAmounts = [];
    $scope.filters = [];

    // private controller vars
    var _companyId = promotionsFactory.getCompanyId();
    var _initPromises = [];
    var _payload = null;

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

    function payloadGenerateQualifierTypeProductPurchase(){
      _payload.promotionCategories = $scope.promotionCategories.map(function(prodCat){
        return {
          companyPromotionCategoryId: prodCat.id,
          categoryQty:prodCat.qty
        };
      });
      _payload.items = $scope.items.map(function(retailItemData){
        return {
          itemQty:retailItemData.qty,
          itemId:retailItemData.retailItem.id
        };
      });
    }

    function payloadGenerateQualifierTypeSpendLimit(){
      _payload.spendLimitAmounts = $scope.spendLimitAmounts.map(function(spendLimit){
        return {
          amount: spendLimit.value,
          companyCurrencyId: spendLimit.id
        };
      });
      _payload.spendLimitCategoryId = $scope.spendLimitCategory.id;
    }

    function payloadGenerateDiscountRateTypePercentage(){
      _payload.discountPercentage = $scope.discountPercentage;
      _payload.lowestPricedArticle = $scope.lowestPricedArticle;
    }

    function payloadGenerateDiscountRateTypeAmount(){
      _payload.benefitAmounts = $scope.benefitAmounts.map(function(currency){
        return {
          amount: currency.value,
          companyCurrencyId: currency.id
        };
      });
    }

    function payloadGenerateBenefitTypeDiscount(){
      /* Discount Rate Types */
      // Discount Rate Type - Percentage
      _payload.discountTypeId = $scope.discountType.id;
      if($scope.discountType.id === 1){
        payloadGenerateDiscountRateTypePercentage();
      }
      // Discount Rate Type - Amount
      if($scope.discountType.id === 2){
        payloadGenerateDiscountRateTypeAmount();
      }

      // Set apply to type
      /* Apply Tos */
      // Apply to - Promotion Category
      _payload.benefitDiscountApplyId = $scope.benefitDiscountApply.id;
      if($scope.benefitDiscountApply.id === 3 ){
        _payload.discountCategoryId = $scope.discountCategory.id;
      }
      // Apply to - Retail Item
      if($scope.benefitDiscountApply.id === 4 ){
        _payload.discountItemId = $scope.discountItem.id;
        _payload.giftWithPurchase = $scope.giftWithPurchase;
      }
    }

    function payloadGenerateFilters(){
      _payload.filters = $scope.filters.map(function(stations){
        return {
          departureStationId: stations.departureStation.id,
          arrivalStationId: stations.arrivalStation.id
        };
      });
    }

    function payloadGenerateBenefitTypes(){
      _payload.benefitTypeId = $scope.benefitType.id;
      // Benefit Type = Discount
      if($scope.benefitType.id === 1) {
        payloadGenerateBenefitTypeDiscount();
      }

      // Benefit Type = Coupon
      if($scope.benefitType.id === 2){
        _payload.companyCouponId = $scope.companyCoupon.id;
      }
      // Benefit Type = Voucher
      if($scope.benefitType.id === 3){
        _payload.companyVoucherId = $scope.companyVoucher.id;
      }
    }

    function payloadGenerate(){
      _payload = {
        promotionCode: $scope.promotionCode,
        promotionName: $scope.promotionName,
        description: $scope.promotionDescription,
        startDate: dateUtility.formatDateForAPI($scope.startDate),
        endDate: dateUtility.formatDateForAPI($scope.endDate)
      };

      /* Qualifier Types */
      // Qualifier Type = Product Purchase
      _payload.promotionTypeId = $scope.promotionQualifierType.id;
      if($scope.promotionQualifierType.id === 1){
        payloadGenerateQualifierTypeProductPurchase();
      }
      // Qualifier Type = Spend Limit
      if($scope.promotionQualifierType.id === 2){
        payloadGenerateQualifierTypeSpendLimit();
      }

      /* Benefit Types */
      payloadGenerateBenefitTypes();

      // Promotion Inclusion Filter
      payloadGenerateFilters();

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
        $scope.spendLimitAmounts.push(currencyModel);
        $scope.benefitAmounts.push(currencyModel);
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

    var states = {};
    states.createInit = function(){
      getPromotionMetaData();
    };
    function init(){
      $scope.displayError = false;
      $scope.formErrors = [];
      var initState = $routeParams.state + 'Init';
      if (states[initState]) {
        states[initState]();
      } else {
        throwError('routeParams.action');
      }
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
      payloadGenerate();
      // console.log(_payload);
      // TODO switch on state, and hit API
    };

  });
