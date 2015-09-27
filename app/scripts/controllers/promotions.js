'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionsCtrl', function ($scope, $routeParams, $q, $filter, $location, $timeout, promotionsFactory, ngToast, dateUtility) {

    $scope.readOnly = true;
    $scope.editing = false;
    $scope.viewName = 'Create Promotion';
    $scope.saveButtonText = 'Create';
    $scope.activeBtn = 'promotion-information';
    $scope.selectOptions = {};

    // Scope models
    $scope.promotion = {};
    $scope.promotion.promotionCode = null;
    $scope.promotion.promotionName = null;
    $scope.promotion.description = null;
    $scope.promotion.startDate = null;
    $scope.promotion.endDate = null;
    $scope.promotion.promotionType = {id:null};
    $scope.promotion.promotionCategories = [];
    $scope.promotion.items = [];
    $scope.promotion.spendLimitCategory = {id:null};
    $scope.spendLimitAmountsUi = [];
    $scope.promotion.benefitType = {id:null};
    $scope.promotion.discountType = {id:null};
    $scope.promotion.benefitDiscountApply = {id:null};
    $scope.promotion.discountItem = {id:null};
    $scope.promotion.giftWithPurchase = false;
    $scope.promotion.discountCategory = {id:null};
    $scope.promotion.companyCoupon = {id:null};
    $scope.promotion.companyVoucher = {id:null};
    $scope.promotion.discountPercentage = null;
    $scope.promotion.lowestPricedArticle = false;
    $scope.benefitAmountsUi = [];
    $scope.promotion.filters = [];

    // private controller vars
    var _companyId = promotionsFactory.getCompanyId();
    var _initPromises = [];
    var _payload = null;
    var _promotionFromAPI = null;

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
      _payload.promotionCategories = mapPromotionCategories($scope.promotion.promotionCategories);
      _payload.items = mapItems($scope.promotion.items);
    }

    function payloadGenerateQualifierTypeSpendLimit(){
      _payload.spendLimitAmounts = $scope.spendLimitAmountsUi.map(function(spendLimitData){
        var spendLimit = {};
        spendLimit.amount = spendLimitData.amount;
        spendLimit.companyCurrencyId = spendLimitData.companyCurrencyId;
        if(angular.isDefined(spendLimitData.id)){
          spendLimit.id = spendLimitData.id;
        }
        if(angular.isDefined(spendLimitData.companyPromotionId)){
          spendLimit.companyPromotionId = spendLimitData.companyPromotionId;
        }
        return spendLimit;
      });
      _payload.spendLimitCategoryId = $scope.promotion.spendLimitCategory.id;
    }

    function payloadGenerateDiscountRateTypePercentage(){
      _payload.discountPercentage = $scope.promotion.discountPercentage;
      _payload.lowestPricedArticle = $scope.promotion.lowestPricedArticle;
    }

    function payloadGenerateDiscountRateTypeAmount(){
      _payload.benefitAmounts = $scope.benefitAmountsUi.map(function(benefitsAmountData){
        var benefitsAmount = {};
        benefitsAmount.amount = benefitsAmountData.amount;
        benefitsAmount.companyCurrencyId = benefitsAmountData.companyCurrencyId;
        if(angular.isDefined(benefitsAmountData.id)){
          benefitsAmount.id = benefitsAmountData.id;
        }
        if(angular.isDefined(benefitsAmountData.companyPromotionId)){
          benefitsAmount.companyPromotionId = benefitsAmountData.companyPromotionId;
        }
        return benefitsAmount;
      });
    }

    function payloadGenerateBenefitTypeDiscount(){
      /* Discount Rate Types */
      // Discount Rate Type - Percentage
      _payload.discountTypeId = $scope.promotion.discountType.id;
      if(_payload.discountTypeId === 1){
        payloadGenerateDiscountRateTypePercentage();
      }
      // Discount Rate Type - Amount
      if(_payload.discountTypeId === 2){
        payloadGenerateDiscountRateTypeAmount();
      }
      // Set apply to type
      /* Apply Tos */
      // Apply to - Promotion Category
      _payload.benefitDiscountApplyId = $scope.promotion.benefitDiscountApply.id;
      if(_payload.benefitDiscountApplyId === 3 ){
        _payload.discountCategoryId = $scope.promotion.discountCategory.id;
      }
      // Apply to - Retail Item
      if(_payload.benefitDiscountApplyId === 4 ){
        _payload.discountItemId = $scope.promotion.discountItem.id;
        _payload.giftWithPurchase = $scope.promotion.giftWithPurchase;
      }
    }

    function payloadGenerateFilters(){
      _payload.filters = mapFilters($scope.promotion.filters);
    }

    function payloadGenerateBenefitTypes(){
      _payload.benefitTypeId = $scope.promotion.benefitType.id;
      // Benefit Type = Discount
      if(_payload.benefitTypeId === 1) {
        payloadGenerateBenefitTypeDiscount();
      }

      // Benefit Type = Coupon
      if(_payload.benefitTypeId === 2){
        _payload.companyCouponId = $scope.promotion.companyCoupon.id;
      }
      // Benefit Type = Voucher
      if(_payload.benefitTypeId === 3){
        _payload.companyVoucherId = $scope.promotion.companyVoucher.id;
      }
    }

    function payloadGenerate(){
      _payload = {
        companyId: _companyId,
        promotionCode: $scope.promotion.promotionCode,
        promotionName: $scope.promotion.promotionName,
        description: $scope.promotion.description,
        startDate: dateUtility.formatDateForAPI($scope.promotion.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotion.endDate),
        // set null for defaults
        benefitTypeId: null,
        promotionCategories: null,
        items: null,
        spendLimitAmounts: null,
        spendLimitCategoryId: null,
        companyCouponId: null,
        companyVoucherId: null,
        discountTypeId: null,
        benefitDiscountApplyId: null,
        discountCategoryId: null,
        discountItemId: null,
        giftWithPurchase: null,
        discountPercentage: null,
        lowestPricedArticle: null,
        benefitAmounts: null,
        filters: null
      };

      /* Qualifier Types */
      // Qualifier Type = Product Purchase
      _payload.promotionTypeId = $scope.promotion.promotionType.id;
      if(_payload.promotionTypeId === 1){
        payloadGenerateQualifierTypeProductPurchase();
      }
      // Qualifier Type = Spend Limit
      if(_payload.promotionTypeId === 2){
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

    // get complicated here, need to have this data always set for API calls
    function setCurrencyGlobals(dataFromAPI){
      $scope.companyCurrencyGlobals = angular.copy(dataFromAPI.response);
      angular.forEach(dataFromAPI.response, function(currency){
        $scope.spendLimitAmountsUi.push({
          companyCurrencyId: currency.id,
          code: currency.code,
          amount: null
        });
        $scope.benefitAmountsUi.push({
          companyCurrencyId: currency.id,
          code: currency.code,
          amount: null
        });
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

    function getObjectByIdFromSelectOptions(_arrayName, _obj){
      var _array = $scope.selectOptions[_arrayName];
      var object = $filter('filter')(_array, _obj, true);
      if(!object || !object.length){
        return {id:null};
      }
      return object[0];
    }

    function getRetailItemId(retailItemData){
      if(angular.isDefined(retailItemData.itemId)){
        return retailItemData.itemId;
      }
      if(angular.isDefined(retailItemData.retailItem) && angular.isDefined(retailItemData.retailItem.id)){
        return retailItemData.retailItem.id;
      }
      return null;
    }

    function mapItems(_array, bindWholeObjectForView){
      return _array.map(function(retailItemData){
        var retailItem = {};
        if(angular.isDefined(retailItemData.id)){
          retailItem = angular.copy(retailItemData);
        }
        retailItem.itemQty = parseInt(retailItemData.itemQty, 10);
        retailItem.itemId = getRetailItemId(retailItemData);
        if(bindWholeObjectForView){
          retailItem.retailItem =  getObjectByIdFromSelectOptions('masterItems', {id:retailItem.itemId});
        }
        else if(angular.isDefined(retailItem.retailItem)){
          delete retailItem.retailItem;
        }
        return retailItem;
      });
    }

    function getCompanyPromotionCategoryId(promotionCategoryData){
      if(angular.isDefined(promotionCategoryData.companyPromotionCategoryId)){
        return promotionCategoryData.companyPromotionCategoryId;
      }
      if(angular.isDefined(promotionCategoryData.promotionCategory) && angular.isDefined(promotionCategoryData.promotionCategory.id)){
        return promotionCategoryData.promotionCategory.id;
      }
      return null;
    }

    function mapPromotionCategories(_array, bindWholeObjectForView){
      return _array.map(function(promotionCategoryData){
        var promotionCategory = {};
        if(angular.isDefined(promotionCategoryData.id)){
          promotionCategory = angular.copy(promotionCategoryData);
        }
        promotionCategory.companyPromotionCategoryId = getCompanyPromotionCategoryId(promotionCategoryData);
        promotionCategory.categoryQty = parseInt(promotionCategoryData.categoryQty, 10);
        if(bindWholeObjectForView){
          promotionCategory.promotionCategory =  getObjectByIdFromSelectOptions('promotionCategories', {id:promotionCategory.companyPromotionCategoryId});
        }
        else if(angular.isDefined(promotionCategory.promotionCategory)){
          delete promotionCategory.promotionCategory;
        }
        return promotionCategory;
      });
    }

    function getArrivalStationId(stationData){
      if(angular.isDefined(stationData.arrivalStationId)){
        return stationData.arrivalStationId;
      }
      if(angular.isDefined(stationData.arrivalStation) && angular.isDefined(stationData.arrivalStation.id)){
        return stationData.arrivalStation.id;
      }
      return null;
    }

    function getDepartureStationId(stationData){
      if(angular.isDefined(stationData.departureStationId)){
        return stationData.departureStationId;
      }
      if(angular.isDefined(stationData.departureStation) && angular.isDefined(stationData.departureStation.id)){
        return stationData.departureStation.id;
      }
      return null;
    }

    function mapFilters(_array, bindWholeObjectForView){
      return _array.map(function(stationData){
        var stationFilters = {};
        if(angular.isDefined(stationData.id)){
          stationFilters = angular.copy(stationData);
        }
        stationFilters.arrivalStationId = getArrivalStationId(stationData);
        stationFilters.departureStationId = getDepartureStationId(stationData);
        if(bindWholeObjectForView){
          stationFilters.arrivalStation = getObjectByIdFromSelectOptions('companyStationGlobals', {id:stationData.arrivalStationId});
          stationFilters.departureStation = getObjectByIdFromSelectOptions('companyStationGlobals', {id:stationData.departureStationId});
        }
        else if(angular.isDefined(stationFilters.arrivalStation)){
          delete stationFilters.arrivalStation;
          delete stationFilters.departureStation;
        }
        return stationFilters;
      });
    }

    function getCurrencyCodeFromCurrencyId(_companyCurrencyId){
      var currency = $filter('filter')($scope.companyCurrencyGlobals, {id:_companyCurrencyId}, true);
      if(!currency || !currency.length){
        return null;
      }
      return currency[0].code;
    }

    function addCurrencyCodeToArrayItems(orinArray, apiArray){
      if(!apiArray || !apiArray.length){
        return orinArray;
      }
      return apiArray.map(function(item){
        item.code = getCurrencyCodeFromCurrencyId(item.companyCurrencyId);
        return item;
      });
    }

    function setScopePromotionForViewFromAPIdata(){
      $scope.promotion = _promotionFromAPI;
      $scope.promotion.startDate = dateUtility.formatDateForApp(_promotionFromAPI.startDate);
      $scope.promotion.endDate = dateUtility.formatDateForApp(_promotionFromAPI.endDate);
      $scope.promotion.spendLimitCategory = getObjectByIdFromSelectOptions('promotionCategories', {id:_promotionFromAPI.spendLimitCategoryId});
      $scope.promotion.promotionType = getObjectByIdFromSelectOptions('promotionTypes', {id:_promotionFromAPI.promotionTypeId});
      $scope.promotion.benefitDiscountApply = getObjectByIdFromSelectOptions('discountApplyTypes', {id:_promotionFromAPI.benefitDiscountApplyId});
      $scope.promotion.companyVoucher = getObjectByIdFromSelectOptions('companyDiscountsVoucher', {id:_promotionFromAPI.companyVoucherId});
      $scope.promotion.companyCoupon = getObjectByIdFromSelectOptions('companyDiscountsCoupon', {id:_promotionFromAPI.companyCouponId});
      $scope.promotion.benefitType = getObjectByIdFromSelectOptions('benefitTypes', {id:_promotionFromAPI.benefitTypeId});
      $scope.promotion.discountType = getObjectByIdFromSelectOptions('discountTypes', {id:_promotionFromAPI.discountTypeId});
      $scope.promotion.giftWithPurchase = (_promotionFromAPI.giftWithPurchase === 'true');
      $scope.promotion.lowestPricedArticle = (_promotionFromAPI.lowestPricedArticle === 'true');
      $scope.promotion.promotionCategories = mapPromotionCategories(_promotionFromAPI.promotionCategories, true);
      $scope.promotion.items = mapItems(_promotionFromAPI.items, true);
      $scope.promotion.filters = mapFilters(_promotionFromAPI.filters, true);
      $scope.promotion.discountCategory = getObjectByIdFromSelectOptions('promotionCategories', {id:parseInt(_promotionFromAPI.discountCategoryId, 10)});
      $scope.promotion.discountItem = getObjectByIdFromSelectOptions('masterItems', {id:_promotionFromAPI.discountItemId});
      $scope.spendLimitAmountsUi = addCurrencyCodeToArrayItems($scope.spendLimitAmountsUi, _promotionFromAPI.spendLimitAmounts);
      $scope.benefitAmountsUi = addCurrencyCodeToArrayItems($scope.benefitAmountsUi, _promotionFromAPI.benefitAmounts);
    }


    function initPromisesResolved(){
      hideLoadingModal();
      showMessage('Promotion loaded');
      $scope.readOnly = ($routeParams.state === 'view');
      if(_promotionFromAPI){
        setScopePromotionForViewFromAPIdata();
      }
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

    function redirectToEmberListing(){
        window.location.href = '/ember/#/promotions';
    }

    function waitThenRedirectToEmberListing(promotionId){
      displayLoadingModal('Success! Promotion id: '+promotionId+' saved. Redirecting to listing...');
      $timeout(redirectToEmberListing, 5000);
    }

    function resolveCreatePromotion(response){
      hideLoadingModal();
      waitThenRedirectToEmberListing(response.id);
    }

    function createPromotion(){
      displayLoadingModal('Creating promotion');
      promotionsFactory.createPromotion(_payload).then(resolveCreatePromotion, showResponseErrors);
    }

    function resolveSavePromotion(response){
      hideLoadingModal();
      waitThenRedirectToEmberListing(response.id);

    }

    function savePromotion(){
      displayLoadingModal('Saving promotion');
      promotionsFactory.savePromotion($routeParams.id, _payload).then(resolveSavePromotion, showResponseErrors);
    }

    function resolveGetPromotion(dataFromAPI){
      _promotionFromAPI = angular.copy(dataFromAPI);
      getPromotionMetaData();
    }

    function getPromotion(){
      displayLoadingModal('Getting promotion');
      promotionsFactory.getPromotion($routeParams.id).then(resolveGetPromotion, showResponseErrors);
    }

    var states = {};
    states.createInit = function(){
      getPromotionMetaData();
    };
    states.editInit = function(){
      $scope.editing = true;
      $scope.viewName = 'Edit Promotion';
      $scope.saveButtonText = 'Save';
      getPromotion();
    };
    states.viewInit = function(){
      getPromotion();
    };
    states.createSave = function(){
      createPromotion();
    };
    states.editSave = function(){
      savePromotion();
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
      return angular.isDefined(retailItemData.retailItem) || angular.isDefined(retailItemData.itemId);
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
        scrollTop: elm.offset().top - (navBar + topBar)
      }, 'fast');
    };

    $scope.save = function(){ // TODO test
      if($scope.readOnly){
        return;
      }
      payloadGenerate();
      var initState = $routeParams.state + 'Save';
      if (states[initState]) {
        states[initState]();
      }
    };

    $scope.cancel = function(){ // TODO test
      redirectToEmberListing();
    };

  });
