'use strict';
/*jshint maxcomplexity:6 */
/**
 * @ngdoc function
 * @name ts5App.controller:PromotionsCtrl
 * @description
 * # PromotionsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionsCtrl', function ($scope, $location, $routeParams, $q, $filter, promotionsFactory, dateUtility, $timeout, lodash) {

    $scope.readOnly = true;
    $scope.editing = false;
    $scope.cloning = false;
    $scope.viewName = 'Create Promotion';
    $scope.saveButtonText = 'Create';
    $scope.activeBtn = 'promotion-information';
    
    $scope.selectOptions = {
      promotionCategories: [],
      activePromotionCategories: []
    };
    $scope.itemCategorySelects = [];
    $scope.repeatableItemListSelectOptions = [];
    $scope.repeatableProductPurchaseItemIds = [];
    $scope.repeatableProductPurchasePromotionCategoryIds = [];
    $scope.repeatableStations = {
      arrivalHas: [],
      departureHas: []
    };

    $scope.promotion = {};
    $scope.promotion.promotionCode = null;
    $scope.promotion.promotionName = null;
    $scope.promotion.description = null;
    $scope.promotion.startDate = null;
    $scope.promotion.endDate = null;
    $scope.promotion.promotionType = {
      id: null
    };
    $scope.promotion.promotionCategories = [];
    $scope.promotion.items = [];
    $scope.promotion.spendLimitCategory = {
      id: null
    };
    $scope.spendLimitAmountsUi = [];
    $scope.promotion.benefitType = {
      id: null
    };
    $scope.promotion.discountType = {
      id: null
    };
    $scope.promotion.benefitDiscountApply = {
      id: null
    };
    $scope.promotion.discountItem = {
      id: null
    };
    $scope.promotion.giftWithPurchase = false;
    $scope.promotion.discountCategory = {
      id: null
    };
    $scope.promotion.companyCoupon = {
      id: null
    };
    $scope.promotion.companyVoucher = {
      id: null
    };
    $scope.promotion.discountPercentage = null;
    $scope.promotion.lowestPricedArticle = false;
    $scope.benefitAmountsUi = [];
    $scope.promotion.filters = [];

    // private controller vars

    var companyId = promotionsFactory.getCompanyId();
    var initPromises = [];
    var payload = null;
    var cachedRetailItemsByCatId = [];

    // private controller functions

    function getObjectByIdFromSelectOptions(arrayName, objectById) {
      var resultList = $scope.selectOptions[arrayName];
      var objectToReturn = $filter('filter')(resultList, objectById, true);
      if (!objectToReturn || !objectToReturn.length) {
        return {
          id: null
        };
      }

      return objectToReturn[0];
    }

    function getRetailItemId(retailItemData) {
      if (angular.isDefined(retailItemData.retailItem) && angular.isDefined(retailItemData.retailItem.id)) {
        return retailItemData.retailItem.id;
      }

      if (angular.isDefined(retailItemData.itemId)) {
        return retailItemData.itemId;
      }

      return null;
    }

    function mapItems(itemList, bindWholeObjectForView) {
      return itemList.map(function (retailItemData) {
        var retailItem = {};
        if (angular.isDefined(retailItemData.id)) {
          retailItem = angular.copy(retailItemData);
        }

        retailItem.itemQty = parseInt(retailItemData.itemQty, 10);
        retailItem.itemId = getRetailItemId(retailItemData);
        if (bindWholeObjectForView) {
          retailItem.retailItem = getObjectByIdFromSelectOptions('masterItems', {
            id: retailItem.itemId
          });
        } else if (angular.isDefined(retailItem.retailItem)) {
          delete retailItem.retailItem;
        }

        if ($scope.isCopy()) {
          delete retailItem.id;
        }

        return retailItem;
      });
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      $timeout(function() {
        angular.element('#loading').modal('hide');
      }, 3000);
    }

    function getCompanyPromotionCategoryId(promotionCategoryData) {
      if (angular.isDefined(promotionCategoryData.promotionCategory) && angular.isDefined(promotionCategoryData.promotionCategory.id)) {
        return promotionCategoryData.promotionCategory.id;
      }

      if (angular.isDefined(promotionCategoryData.companyPromotionCategoryId)) {
        return promotionCategoryData.companyPromotionCategoryId;
      }

      return null;
    }

    function mapPromotionCategories(categoriesList, bindWholeObjectForView) {
      return categoriesList.map(function (promotionCategoryData) {
        var promotionCategory = {};
        if (angular.isDefined(promotionCategoryData.id)) {
          promotionCategory = angular.copy(promotionCategoryData);
        }

        promotionCategory.companyPromotionCategoryId = getCompanyPromotionCategoryId(promotionCategoryData);
        promotionCategory.categoryQty = parseInt(promotionCategoryData.categoryQty, 10);
        if (bindWholeObjectForView) {
          promotionCategory.promotionCategory = getObjectByIdFromSelectOptions('promotionCategories', {
            id: promotionCategory.companyPromotionCategoryId
          });
        } else if (angular.isDefined(promotionCategory.promotionCategory)) {
          delete promotionCategory.promotionCategory;
        }

        if ($scope.isCopy()) {
          delete promotionCategory.id;
        }

        return promotionCategory;
      });
    }

    function payloadGenerateQualifierTypeProductPurchase() {
      payload.promotionCategories = mapPromotionCategories($scope.promotion.promotionCategories);
      payload.items = mapItems($scope.promotion.items);
    }

    function payloadGenerateQualifierTypeSpendLimit() {
      payload.spendLimitAmounts = $scope.spendLimitAmountsUi.map(function (spendLimitData) {
        var spendLimit = {};
        spendLimit.amount = spendLimitData.amount;
        spendLimit.companyCurrencyId = spendLimitData.companyCurrencyId;
        if (angular.isDefined(spendLimitData.id) && !$scope.isCopy()) {
          spendLimit.id = spendLimitData.id;
        }

        if (angular.isDefined(spendLimitData.companyPromotionId)) {
          spendLimit.companyPromotionId = spendLimitData.companyPromotionId;
        }

        return spendLimit;
      });

      if ($scope.promotion.spendLimitCategory) {
        payload.spendLimitCategoryId = $scope.promotion.spendLimitCategory.id;
      }
    }

    function payloadGenerateDiscountRateTypePercentage() {
      payload.discountPercentage = $scope.promotion.discountPercentage;
      payload.lowestPricedArticle = $scope.promotion.lowestPricedArticle;
    }

    function payloadGenerateDiscountRateTypeAmount() {
      payload.benefitAmounts = $scope.benefitAmountsUi.map(function (benefitsAmountData) {
        var benefitsAmount = {};
        benefitsAmount.amount = benefitsAmountData.amount;
        benefitsAmount.companyCurrencyId = benefitsAmountData.companyCurrencyId;
        if (angular.isDefined(benefitsAmountData.id) && !$scope.isCopy()) {
          benefitsAmount.id = benefitsAmountData.id;
        }

        if (angular.isDefined(benefitsAmountData.companyPromotionId)) {
          benefitsAmount.companyPromotionId = benefitsAmountData.companyPromotionId;
        }

        //TSVPORTAL-10458 Setup miles/points per promotion
        if ($scope.promotion.milesPoints) {
          payload.milesPoints = $scope.promotion.milesPoints;
        }

        return benefitsAmount;
      });
    }

    function payloadGenerateBenefitTypeDiscount() {
      /*jshint maxcomplexity:8 */
      
      // Discount Rate Types
      // Discount Rate Type - Percentage
      payload.discountTypeId = $scope.promotion.discountType.id;
      if (payload.discountTypeId === 1) {
        payloadGenerateDiscountRateTypePercentage();
      }

      // Discount Rate Type - Amount
      if (payload.discountTypeId === 2 || payload.discountTypeId === 3) {
        payloadGenerateDiscountRateTypeAmount();
      }

      // Set apply to type
      // Apply Tos
      // Apply to - Promotion Category
      payload.benefitDiscountApplyId = $scope.promotion.benefitDiscountApply.id;
      if (payload.benefitDiscountApplyId === 3) {
        payload.discountCategoryId = $scope.promotion.discountCategory.id;
      }

      // Apply to - Retail Item
      if (payload.benefitDiscountApplyId === 4) {
        payload.discountItemId = $scope.promotion.discountItem.id;
        payload.giftWithPurchase = $scope.promotion.giftWithPurchase;
      }
    }

    function getArrivalStationId(stationData) {
      if (angular.isDefined(stationData.arrivalStation) && angular.isDefined(stationData.arrivalStation.id)) {
        return stationData.arrivalStation.id;
      }

      if (angular.isDefined(stationData.arrivalStationId)) {
        return stationData.arrivalStationId;
      }

      return null;
    }

    function getDepartureStationId(stationData) {
      if (angular.isDefined(stationData.departureStation) && angular.isDefined(stationData.departureStation.id)) {
        return stationData.departureStation.id;
      }

      if (angular.isDefined(stationData.departureStationId)) {
        return stationData.departureStationId;
      }

      return null;
    }

    function mapFilters(arrayToMap, bindWholeObjectForView) {
      return arrayToMap.map(function (stationData) {
        var stationFilters = {};
        if (angular.isDefined(stationData.id)) {
          stationFilters = angular.copy(stationData);
        }

        stationFilters.arrivalStationId = getArrivalStationId(stationData);
        stationFilters.departureStationId = getDepartureStationId(stationData);
        if (bindWholeObjectForView) {
          stationFilters.arrivalStation = getObjectByIdFromSelectOptions('companyStationGlobals', {
            id: stationData.arrivalStationId
          });
          stationFilters.departureStation = getObjectByIdFromSelectOptions('companyStationGlobals', {
            id: stationData.departureStationId
          });
        } else if (angular.isDefined(stationFilters.arrivalStation)) {
          delete stationFilters.arrivalStation;
          delete stationFilters.departureStation;
        }

        return stationFilters;
      });
    }

    function payloadGenerateFilters() {
      payload.filters = mapFilters($scope.promotion.filters);
    }

    function payloadGenerateBenefitTypes() {
      payload.benefitTypeId = $scope.promotion.benefitType.id;

      // Benefit Type = Discount
      if (payload.benefitTypeId === 1) {
        payloadGenerateBenefitTypeDiscount();
      }

      // Benefit Type = Coupon
      if (payload.benefitTypeId === 2) {
        payload.companyCouponId = $scope.promotion.companyCoupon.id;
      }

      // Benefit Type = Voucher
      if (payload.benefitTypeId === 3) {
        payload.companyVoucherId = $scope.promotion.companyVoucher.id;
      }
    }

    function payloadGenerate() {
      payload = {
        companyId: companyId,
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
        filters: null,
        milesPoints: null
      };

      // Qualifier Types
      // Qualifier Type = Product Purchase
      payload.promotionTypeId = $scope.promotion.promotionType.id;
      if (payload.promotionTypeId === 1) {
        payloadGenerateQualifierTypeProductPurchase();
      }

      // Qualifier Type = Spend Limit
      if (payload.promotionTypeId === 2) {
        payloadGenerateQualifierTypeSpendLimit();
      }

      // Benefit Types
      payloadGenerateBenefitTypes();

      // Promotion Inclusion Filter
      payloadGenerateFilters();
    }

    function showResponseErrors(response) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = response;
    }

    function throwError(field, message) {
      if (!message) {
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

    function setBenefitTypes(dataFromAPI) {
      $scope.selectOptions.benefitTypes = dataFromAPI;
    }

    function getBenefitTypes() {
      initPromises.push(
        promotionsFactory.getBenefitTypes().then(setBenefitTypes)
      );
    }

    function setDiscountTypes(dataFromAPI) {
      $scope.selectOptions.discountTypes = dataFromAPI;
    }

    function getDiscountTypes() {
      initPromises.push(
        promotionsFactory.getDiscountTypes().then(setDiscountTypes)
      );
    }

    function setPromotionTypes(dataFromAPI) {
      $scope.selectOptions.promotionTypes = dataFromAPI;
    }

    function getPromotionTypes() {
      initPromises.push(
        promotionsFactory.getPromotionTypes().then(setPromotionTypes)
      );
    }

    function setCompanyDiscountsCoupon(dataFromAPI) {
      $scope.selectOptions.companyDiscountsCoupon = dataFromAPI.companyDiscounts;

      // Check if coupon expired for provided start/end dates
      if ($scope.promotion.companyCoupon && $scope.promotion.companyCoupon.id !== null) {
        $scope.promotion.companyCoupon.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.companyDiscountsCoupon, { id: $scope.promotion.companyCoupon.id }));
      }
    }

    function getCompanyDiscountsCoupon(payload) {
      payload = payload || {
          startDate: dateUtility.nowFormattedDatePicker('YYYYMMDD')
        };
      initPromises.push(
        promotionsFactory.getCompanyDiscountsCoupon(payload).then(setCompanyDiscountsCoupon)
      );
    }

    function setCompanyDiscountsVoucher(dataFromAPI) {
      $scope.selectOptions.companyDiscountsVoucher = dataFromAPI.companyDiscounts;

      // Check if coupon expired for provided start/end dates
      if ($scope.promotion.companyVoucher && $scope.promotion.companyVoucher.id !== null) {
        $scope.promotion.companyVoucher.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.companyDiscountsVoucher, { id: $scope.promotion.companyVoucher.id }));
      }
    }

    function getCompanyDiscountsVoucher(payload) {
      payload = payload || {
          startDate: dateUtility.nowFormattedDatePicker('YYYYMMDD')
        };
      initPromises.push(
        promotionsFactory.getCompanyDiscountsVoucher(payload).then(setCompanyDiscountsVoucher)
      );
    }

    function setSalesCategories(dataFromAPI) {
      $scope.selectOptions.salesCategories = dataFromAPI.salesCategories;
    }

    function getSalesCategories() {
      initPromises.push(
        promotionsFactory.getSalesCategories().then(setSalesCategories)
      );
    }

    function setDiscountApplyTypes(dataFromAPI) {
      $scope.selectOptions.discountApplyTypes = dataFromAPI;
    }

    function getDiscountApplyTypes() {
      initPromises.push(
        promotionsFactory.getDiscountApplyTypes().then(setDiscountApplyTypes)
      );
    }

    function setPromotionCategories(dataFromAPI) {
      $scope.selectOptions.promotionCategories = dataFromAPI.companyPromotionCategories;
    }

    function getPromotionCategories() {
      initPromises.push(
        promotionsFactory.getPromotionCategories().then(setPromotionCategories)
      );
    }

    function setActivePromotionCategories(dataFromAPI) {
      $scope.selectOptions.activePromotionCategories = dataFromAPI.companyPromotionCategories;

      // Check if promotion category expired for provided start/end dates
      $scope.promotion.promotionCategories = $scope.promotion.promotionCategories.map(function (promotionCategory) {
        if (promotionCategory.promotionCategory) {
          promotionCategory.promotionCategory.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.activePromotionCategories, { id: promotionCategory.promotionCategory.id }));
        }

        return promotionCategory;
      });

      if ($scope.promotion.spendLimitCategory && $scope.promotion.spendLimitCategory.id !== null) {
        $scope.promotion.spendLimitCategory.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.activePromotionCategories, { id: $scope.promotion.spendLimitCategory.id }));
      }

      if ($scope.promotion.discountCategory && $scope.promotion.discountCategory.id !== null) {
        $scope.promotion.discountCategory.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.activePromotionCategories, { id: $scope.promotion.discountCategory.id }));
      }

    }

    function getActivePromotionCategories() {
      var today = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var payload = {
        startDate: today,
        endDate: today
      };

      initPromises.push(
        promotionsFactory.getActivePromotionCategories(payload).then(setActivePromotionCategories)
      );
    }

    function setStationGlobals(dataFromAPI) {
      $scope.selectOptions.companyStationGlobals = dataFromAPI.response;
    }

    function getStationGlobals() {
      initPromises.push(
        promotionsFactory.getStationGlobals().then(setStationGlobals)
      );
    }

    function setCurrencyGlobals(dataFromAPI) {
      $scope.companyCurrencyGlobals = dataFromAPI.response;
      angular.forEach(dataFromAPI.response, function (currency) {
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

    function getCurrencyGlobals() {
      var payload = {
        isOperatedCurrency: true,
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      initPromises.push(
        promotionsFactory.getCurrencyGlobals(payload).then(setCurrencyGlobals)
      );
    }

    function setMasterItems(dataFromAPI) {
      $scope.selectOptions.masterItems = dataFromAPI.masterItems;

      // Check if retail items expired for provided start/end dates
      $scope.promotion.items.forEach(function (value, index) {
        if ($scope.itemCategorySelects[index]) {
          return;
        }

        $scope.repeatableItemListSelectOptions[index] = dataFromAPI.masterItems;

        if (!value.retailItem) {
          return;
        }

        if (!lodash.find($scope.repeatableItemListSelectOptions[index], { id: value.retailItem.id })) {
          value.retailItem.isExpired = true;
        } else {
          value.retailItem.isExpired = false;
        }
      });

      if ($scope.promotion.discountItem && $scope.promotion.discountItem.id !== null) {
        $scope.promotion.discountItem.isExpired = !angular.isDefined(lodash.find($scope.selectOptions.masterItems, { id: $scope.promotion.discountItem.id }));
      }

    }

    function getMasterItems() {
      var startDate = dateUtility.formatDateForAPI($scope.promotion.startDate);
      var endDate =  dateUtility.formatDateForAPI($scope.promotion.endDate);

      var payload = {
        companyId: companyId,
        startDate: startDate,
        endDate: endDate,
        ignoreDryStrore: true
      };

      return promotionsFactory.getMasterItems(payload).then(setMasterItems);
    }

    function getCurrencyCodeFromCurrencyId(companyCurrencyId) {
      var currency = $filter('filter')($scope.companyCurrencyGlobals, {
        id: companyCurrencyId
      }, true);
      if (!currency || !currency.length) {
        return null;
      }

      return currency[0].code;
    }

    function addCurrencyCodeToArrayItems(orinArray, apiArray) {
      if (!apiArray || !apiArray.length) {
        return orinArray;
      }

      return apiArray.map(function (item) {
        item.code = getCurrencyCodeFromCurrencyId(item.companyCurrencyId);
        return item;
      });
    }

    function setScopePromotionForViewFromAPIdata(promotionFromAPI) {
      $scope.promotion.startDate = dateUtility.formatDateForApp(angular.copy(promotionFromAPI.startDate));
      $scope.promotion.endDate = dateUtility.formatDateForApp(angular.copy(promotionFromAPI.endDate));

      $scope.promotion.spendLimitCategory = getObjectByIdFromSelectOptions('promotionCategories', {
        id: promotionFromAPI.spendLimitCategoryId
      });
      $scope.promotion.promotionType = getObjectByIdFromSelectOptions('promotionTypes', {
        id: promotionFromAPI.promotionTypeId
      });
      $scope.promotion.benefitDiscountApply = getObjectByIdFromSelectOptions('discountApplyTypes', {
        id: promotionFromAPI.benefitDiscountApplyId
      });
      $scope.promotion.companyVoucher = getObjectByIdFromSelectOptions('companyDiscountsVoucher', {
        id: promotionFromAPI.companyVoucherId
      });
      $scope.promotion.companyCoupon = getObjectByIdFromSelectOptions('companyDiscountsCoupon', {
        id: promotionFromAPI.companyCouponId
      });
      $scope.promotion.benefitType = getObjectByIdFromSelectOptions('benefitTypes', {
        id: promotionFromAPI.benefitTypeId
      });
      $scope.promotion.discountType = getObjectByIdFromSelectOptions('discountTypes', {
        id: promotionFromAPI.discountTypeId
      });
      $scope.promotion.promotionCategories = mapPromotionCategories(promotionFromAPI.promotionCategories, true);
      $scope.promotion.items = mapItems(promotionFromAPI.items, true);

      $scope.itemsSnapshot = angular.copy($scope.promotion.items);

      $scope.promotion.filters = mapFilters(promotionFromAPI.filters, true);
      $scope.promotion.discountCategory = getObjectByIdFromSelectOptions('promotionCategories', {
        id: parseInt(promotionFromAPI.discountCategoryId, 10)
      });
      $scope.promotion.discountItem = getObjectByIdFromSelectOptions('masterItems', {
        id: promotionFromAPI.discountItemId
      });
      $scope.spendLimitAmountsUi = addCurrencyCodeToArrayItems($scope.spendLimitAmountsUi, promotionFromAPI.spendLimitAmounts);
      $scope.benefitAmountsUi = addCurrencyCodeToArrayItems($scope.benefitAmountsUi, promotionFromAPI.benefitAmounts);
      $scope.shouldDisableStartDate = !(dateUtility.isAfterTodayDatePicker($scope.promotion.startDate));
    }

    $scope.$watchGroup(['promotion.startDate', 'promotion.endDate'], function (newData) {
      if ($scope.promotion.startDate && $scope.promotion.endDate && dateUtility.isAfterOrEqualDatePicker($scope.promotion.endDate, $scope.promotion.startDate)) {
        var payload = {
          startDate: dateUtility.formatDateForAPI(newData[0]),
          endDate: dateUtility.formatDateForAPI(newData[1])
        };

        getCompanyDiscountsCoupon(payload);
        getCompanyDiscountsVoucher(payload);
        getActivePromotionCategoriesByDates($scope.promotion);
        refreshRetailItemsByDates();
      }
    });

    function refreshRetailItemsByDates() {
      if ($scope.readOnly || $scope.isDisabled) {
        return;
      }

      getMasterItems();

      cachedRetailItemsByCatId = [];
      $scope.repeatableProductPurchaseItemIds = [];
      angular.forEach($scope.promotion.items, function (item, key) {
        $scope.itemCategoryChanged(key);
      });
    }

    function setCrudFlags(startDate) {
      $scope.readOnly = ($routeParams.state === 'view');
      if (angular.isDefined(startDate)) {
        $scope.isDisabled = ($routeParams.state === 'edit' && !dateUtility.isAfterTodayDatePicker(startDate));
      }
    }

    function handlePromiseSuccessHandler(promotionDataFromAPI) {
      setCrudFlags();
      if (promotionDataFromAPI) {
        $scope.promotion = angular.copy(promotionDataFromAPI);
        $scope.promotion.startDate = dateUtility.formatDateForApp(angular.copy(promotionDataFromAPI.startDate));
        $scope.promotion.endDate = dateUtility.formatDateForApp(angular.copy(promotionDataFromAPI.endDate));

        setCrudFlags($scope.promotion.startDate);
        getMasterItems().then(function() {
          setScopePromotionForViewFromAPIdata(angular.copy(promotionDataFromAPI));
        });
      }

      hideLoadingModal();
    }

    function getPromotionMetaData(promotionDataFromAPI) {
      displayLoadingModal();
      getBenefitTypes();
      getDiscountTypes();
      getCompanyDiscountsVoucher();
      getCompanyDiscountsCoupon();
      getPromotionTypes();
      getSalesCategories();
      getDiscountApplyTypes();
      getPromotionCategories();
      getStationGlobals();
      getCurrencyGlobals();
      getActivePromotionCategories();

      $q.all(initPromises).then(function () {
        handlePromiseSuccessHandler(promotionDataFromAPI);
      }, showResponseErrors);
    }

    function resolveCreatePromotion() {
      hideLoadingModal();
      $location.path('/promotions');
    }

    function createPromotion() {
      displayLoadingModal('Creating promotion');
      promotionsFactory.createPromotion(payload).then(resolveCreatePromotion, showResponseErrors);
    }

    function resolveSavePromotion() {
      hideLoadingModal();
      resolveCreatePromotion();

    }

    function resetErrors() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    }

    function uiSelectRequiredFieldsValid() {
      /*jshint maxcomplexity:16 */
      /*jshint maxdepth:5 */
      if (!$scope.promotionsForm.QualifierType.$modelValue.id) {
        $scope.promotionsForm.QualifierType.$setValidity('required', false);
      } else {
        if ($scope.promotion.promotionType.name === 'Spend Limit') { 
          if (!$scope.promotionsForm.QualifiersPromotionCategory.$modelValue.id) {
            $scope.promotionsForm.QualifiersPromotionCategory.$setValidity('required', false);
          }
        }
      }

      if (!$scope.promotionsForm.BenefitType.$modelValue.id) {
        $scope.promotionsForm.BenefitType.$setValidity('required', false);
      } else {
        if ($scope.promotion.benefitType.name === 'Discount') { 
          if (!$scope.promotionsForm.ApplyTo.$modelValue.id) {
            $scope.promotionsForm.ApplyTo.$setValidity('required', false);
          } else {
            if ($scope.promotion.benefitDiscountApply.name === 'Promotion Category') {
              if (!$scope.promotionsForm.BenefitsPromotionCategory.$modelValue.id) {
                $scope.promotionsForm.BenefitsPromotionCategory.$setValidity('required', false);
              }
            }

            if ($scope.promotion.benefitDiscountApply.name === 'Retail Item') {
              if (!$scope.promotionsForm.BenefitsRetailItem.$modelValue.id) {
                $scope.promotionsForm.BenefitsRetailItem.$setValidity('required', false);
              }
            }
          }

          if (!$scope.promotionsForm.DiscountRateType.$modelValue.id) {
            $scope.promotionsForm.DiscountRateType.$setValidity('required', false);
          }
        }

        if ($scope.promotion.benefitType.name === 'Coupon') { 
          if (!$scope.promotionsForm.Coupon.$modelValue.id) {
            $scope.promotionsForm.Coupon.$setValidity('required', false);
          }
        }

        if ($scope.promotion.benefitType.name === 'Voucher') { 
          if (!$scope.promotionsForm.Voucher.$modelValue.id) {
            $scope.promotionsForm.Voucher.$setValidity('required', false);
          }
        }
      }
    }

    function formValid() {
      resetErrors();
      uiSelectRequiredFieldsValid();
      return $scope.promotionsForm.$valid;
    }

    function savePromotion(endDate) {
      if (endDate) {
        payload = endDate;
      }

      displayLoadingModal('Saving promotion');
      promotionsFactory.savePromotion($routeParams.id, payload).then(resolveSavePromotion, showResponseErrors);
    }

    function getPromotion() {
      displayLoadingModal('Getting promotion');
      promotionsFactory.getPromotion($routeParams.id).then(getPromotionMetaData, showResponseErrors);
    }

    function removeDepartureFromHasArrival(arrivalId, departureId) {
      var departureIndex = -1;
      if ($scope.repeatableStations.arrivalHas[arrivalId]) {
        departureIndex = $scope.repeatableStations.arrivalHas[arrivalId].indexOf(departureId);
      }

      if (departureIndex !== -1) {
        $scope.repeatableStations.arrivalHas[arrivalId].splice(departureIndex, 1);
      }
    }

    function removeArrivalFromHasDeparture(arrivalId, departureId) {
      var arrivalIndex = -1;
      if ($scope.repeatableStations.departureHas[departureId]) {
        arrivalIndex = $scope.repeatableStations.departureHas[departureId].indexOf(arrivalId);
      }

      if (arrivalIndex !== -1) {
        $scope.repeatableStations.departureHas[departureId].splice(arrivalIndex, 1);
      }
    }

    var states = {};
    states.createInit = function () {
      getPromotionMetaData();
    };

    states.copyInit = function () {
      $scope.cloning = true;
      $scope.viewName = 'Clone Promotion';

      getPromotion();
    };

    states.editInit = function () {
      $scope.editing = true;
      $scope.viewName = 'Edit Promotion';
      $scope.saveButtonText = 'Save';
      getPromotion();
    };

    states.viewInit = function () {
      $scope.viewName = 'View Promotion';
      getPromotion();
    };

    states.createSave = function () {
      createPromotion();
    };

    states.copySave = function () {
      createPromotion();
    };

    states.editSave = function () {
      savePromotion();
    };

    $scope.isCopy = function () {
      return $routeParams.state === 'copy';
    };

    $scope.isCreate = function () {
      return $routeParams.state === 'create';
    };

    function init() {
      $scope.displayError = false;
      $scope.formErrors = [];
      var initState = $routeParams.state + 'Init';
      if (!states[initState]) {
        throwError('routeParams.action');
        return;
      }

      states[initState]();
    }

    init();

    // Scope functions

    $scope.addBlankObjectToArray = function (_array) {
      if ($scope.readOnly || $scope.isDisabled) {
        return false;
      }

      _array.push({});
    };

    $scope.addBlankPromotionToArray = function (_array, promotion) {
      if ($scope.readOnly || $scope.isDisabled) {
        return false;
      }

      getActivePromotionCategoriesByDates(promotion);
      _array.push({});

    };

    function getActivePromotionCategoriesByDates(promotion) {
      var today = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var startDate = angular.isDefined(promotion.startDate) && promotion.startDate !== '' ? dateUtility.formatDateForAPI(promotion.startDate) : today;
      var endDate = angular.isDefined(promotion.endDate) && promotion.endDate !== '' ? dateUtility.formatDateForAPI(promotion.endDate) : today;
      var payload = {
        startDate: startDate,
        endDate: endDate
      };

      initPromises.push(
        promotionsFactory.getActivePromotionCategories(payload).then(setActivePromotionCategories)
      );
    }

    $scope.promotionCategoryQtyRequired = function (promotionCategoryData) {
      return angular.isDefined(promotionCategoryData.promotionCategory);
    };

    $scope.spendLimitCategoryRequired = function (promotion) {
      return angular.isDefined(promotion.spendLimitCategory);
    };

    $scope.retailItemQtyRequired = function (retailItemData) {
      return angular.isDefined(retailItemData.retailItem) || angular.isDefined(retailItemData.itemId);
    };

    $scope.cancel = function () {
      resolveCreatePromotion();
    };

    $scope.promotionCategorySelectChanged = function ($index) {
      $scope.repeatableProductPurchasePromotionCategoryIds[$index] = $scope.promotion.promotionCategories[$index].promotionCategory
        .id;
    };

    $scope.disabledPromotionCategory = function (promotionCategory) {
      return $scope.repeatableProductPurchasePromotionCategoryIds.indexOf(promotionCategory.id) !== -1;
    };

    $scope.removeFromPromotionCategoryByIndex = function ($index) {
      $scope.promotion.promotionCategories.splice($index, 1);
      $scope.repeatableProductPurchasePromotionCategoryIds.splice($index, 1);
    };

    $scope.itemSelectInit = function ($index) {
      $scope.repeatableItemListSelectOptions[$index] = $scope.selectOptions.masterItems;
    };

    $scope.itemSelectChanged = function ($index) {
      $scope.repeatableProductPurchaseItemIds[$index] = $scope.promotion.items[$index].retailItem.id;

      var itemFromSnapshot = lodash.find($scope.itemsSnapshot, { itemId: $scope.promotion.items[$index].retailItem.id });

      if (itemFromSnapshot) {
        $scope.promotion.items[$index] = itemFromSnapshot;
      }
    };

    $scope.isAnyRetailItemExpired = function () {
      var foundExpiredRetailItems = lodash.find($scope.promotion.items, { retailItem: { isExpired: true } }) ? true : false;
      var foundExpiredBenefitRetailItem = $scope.promotion.discountItem && $scope.promotion.discountItem.isExpired ? true : false;

      return foundExpiredRetailItems || foundExpiredBenefitRetailItem;
    };

    $scope.isAnyPromotionCategoryExpired = function () {
      var foundExpiredPromotionCategories = lodash.find($scope.promotion.promotionCategories, { promotionCategory: { isExpired: true } });
      var foundExpiredSpendLimitPromotionCategories = $scope.promotion.spendLimitCategory && $scope.promotion.spendLimitCategory.isExpired ? true : false;
      var foundExpiredBenefitPromotionCategories = $scope.promotion.discountCategory && $scope.promotion.discountCategory.isExpired ? true : false;

      return foundExpiredPromotionCategories || foundExpiredSpendLimitPromotionCategories || foundExpiredBenefitPromotionCategories;
    };

    $scope.disabledItems = function (item) {
      return $scope.repeatableProductPurchaseItemIds.indexOf(item.id) !== -1;
    };

    $scope.removeFromItemListByIndex = function ($index) {
      $scope.repeatableProductPurchaseItemIds.splice($index, 1);
      $scope.promotion.items.splice($index, 1);
    };

    $scope.removeFromStationListByIndex = function ($index) {
      var arrivalId = -1;
      var departureId = -1;

      if (!$scope.promotion.filters[$index]) {
        return false;
      }

      if ($scope.promotion.filters[$index].arrivalStation) {
        arrivalId = $scope.promotion.filters[$index].arrivalStation.id;
      }

      if ($scope.promotion.filters[$index].departureStation) {
        departureId = $scope.promotion.filters[$index].departureStation.id;
      }

      removeDepartureFromHasArrival(arrivalId, departureId);
      removeArrivalFromHasDeparture(arrivalId, departureId);
      $scope.promotion.filters.splice($index, 1);
    };

    $scope.disabledDepartureStations = function (station, stations) {
      if (!stations.arrivalStation) {
        return false;
      }

      return lodash.find($scope.promotion.filters, { arrivalStation: stations.arrivalStation, departureStation: station });
    };

    $scope.disabledArrivalStations = function (station, stations) {
      if (!stations.departureStation) {
        return false;
      }

      return lodash.find($scope.promotion.filters, { departureStation: stations.departureStation, arrivalStation: station });
    };

    function hasDepartureStationObject(index) {
      if (angular.isUndefined($scope.promotion.filters[index].departureStation)) {
        return false;
      }

      return !angular.isUndefined($scope.promotion.filters[index].departureStation.id);
    }

    function hasCompleteArrivalStation(index) {
      if (angular.isUndefined($scope.promotion.filters[index].arrivalStation)) {
        return false;
      }

      return !angular.isUndefined($scope.promotion.filters[index].arrivalStation.id);
    }

    function hasCompleteStationObject(index) {
      if (angular.isUndefined($scope.promotion.filters[index])) {
        return false;
      }

      return hasDepartureStationObject(index) && hasCompleteArrivalStation(index);
    }

    $scope.stationListChanged = function ($index) {
      if (!hasCompleteStationObject($index)) {
        return false;
      }

      var departureId = $scope.promotion.filters[$index].departureStation.id;
      var arrivalId = $scope.promotion.filters[$index].arrivalStation.id;
      if (!$scope.repeatableStations.departureHas[departureId]) {
        $scope.repeatableStations.departureHas[departureId] = [];
      }

      $scope.repeatableStations.departureHas[departureId].push(arrivalId);
      if (!$scope.repeatableStations.arrivalHas[arrivalId]) {
        $scope.repeatableStations.arrivalHas[arrivalId] = [];
      }

      $scope.repeatableStations.arrivalHas[arrivalId].push(departureId);
    };

    function shouldSkipCategoryChangedEvent(index) {
      return !$scope.itemCategorySelects[index] || !$scope.promotion.startDate || !$scope.promotion.endDate;
    }

    $scope.itemCategoryChanged = function (index) {
      if (shouldSkipCategoryChangedEvent(index)) {
        return;
      }

      var categoryId = $scope.itemCategorySelects[index].id;

      if (cachedRetailItemsByCatId[categoryId]) {
        $scope.repeatableItemListSelectOptions[index] = cachedRetailItemsByCatId[categoryId];
        return;
      }

      var today = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());

      var startDate = $scope.promotion.startDate !== '' ? dateUtility.formatDateForAPI($scope.promotion.startDate) : today;
      var endDate = $scope.promotion.endDate !== '' ? dateUtility.formatDateForAPI($scope.promotion.endDate) : today;

      var payload = {
        companyId: companyId,
        categoryId: categoryId,
        startDate: startDate,
        endDate: endDate,
        ignoreDryStrore: true
      };

      displayLoadingModal();
      promotionsFactory.getMasterItems(payload).then(function (dataFromAPI) {
        $scope.repeatableItemListSelectOptions[index] = dataFromAPI.masterItems;
        var value = $scope.promotion.items[index];

        if (value && value.retailItem) {
          // Check if retail items expired for provided start/end dates
          if (!lodash.find($scope.repeatableItemListSelectOptions[index], { id: value.retailItem.id })) {
            value.retailItem.isExpired = true;
          } else {
            value.retailItem.isExpired = false;
          }
        }

        cachedRetailItemsByCatId[categoryId] = dataFromAPI.masterItems;
        hideLoadingModal();
      }, showResponseErrors);
    };

    $scope.save = function () {
      $scope.promotionsForm.$setSubmitted(true);

      if ($scope.readOnly) {
        return false;
      }

      if (!formValid()) {
        $scope.displayError = true;
        return false;
      }

      var initState = $routeParams.state + 'Save';
      if (!states[initState]) {
        return false;
      }

      payloadGenerate();
      states[initState]();
    };

    $scope.showLowestPricedItem = function () {
      var discountApply = $scope.promotion.benefitDiscountApply.name;
      return (discountApply && discountApply !== 'Retail Item');
    };

  });
