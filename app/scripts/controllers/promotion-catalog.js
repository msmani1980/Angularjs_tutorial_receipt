'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCatalogCtrl
 * @description
 * # PromotionCategoryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCatalogCtrl', function ($scope, $routeParams, promotionCatalogFactory, globalMenuService, $q, lodash, messageService, dateUtility) {

    $scope.itemList = [];
    $scope.promotionCatalog = {};
    $scope.minDate = dateUtility.dateNumDaysAfterTodayFormatted(1);
    $scope.startMinDate = $routeParams.action === 'create' ? $scope.minDate : '';
    var $this = this;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }

    //function completeSave() {
    //  hideLoadingModal();
    //  var action = $routeParams.action === 'edit' ? 'updated' : 'created';
    //  messageService.display('success', 'Record successfully ' + action, 'Save Promotion Category');
    //  $location.path('promotion-category-list');
    //}
    //
    //function formatItemPayload(item) {
    //  if (!item.selectedItem) {
    //    return null;
    //  }
    //
    //  var newItem = {};
    //  newItem.itemId = item.selectedItem.id;
    //
    //  if ($routeParams.id && item.recordId) {
    //    newItem.id = item.recordId;
    //  }
    //
    //  if ($routeParams.id) {
    //    newItem.companyPromotionCategoryId = parseInt($routeParams.id);
    //  }
    //
    //  if (item.selectedCategory) {
    //    newItem.salesCategoryId = item.selectedCategory.id;
    //  }
    //
    //  return newItem;
    //}
    //
    //function formatPayload() {
    //  var payload = {};
    //  payload.startDate = dateUtility.formatDateForAPI($scope.promotionCatalog.startDate);
    //  payload.endDate = dateUtility.formatDateForAPI($scope.promotionCatalog.endDate);
    //  payload.promotionCatalogName = $scope.promotionCatalog.promotionCatalogName;
    //  payload.companyId = promotionCategoryFactory.getCompanyId();
    //
    //  if ($routeParams.id) {
    //    payload.id = parseInt($routeParams.id);
    //  }
    //
    //  payload.companyPromotionCategoryItems = [];
    //  angular.forEach($scope.itemList, function (item) {
    //    var newItem = formatItemPayload(item);
    //    if (newItem !== null) {
    //      payload.companyPromotionCategoryItems.push(newItem);
    //    }
    //  });
    //
    //  return payload;
    //}
    //
    //function checkIfItemListIsValid() {
    //  var isListValid = false;
    //  angular.forEach($scope.itemList, function (item) {
    //    isListValid = !!item.selectedItem || isListValid;
    //  });
    //
    //  if ($scope.itemList.length <= 0 || !isListValid) {
    //    $scope.errorCustom = [{
    //      field: 'Retail Items',
    //      value: 'At least one item must be selected'
    //    }];
    //
    //    showErrors();
    //    return false;
    //  }
    //
    //  return true;
    //}
    //
    //$scope.save = function () {
    //  if (!$scope.promotionCategoryForm.$valid) {
    //    return false;
    //  }
    //
    //  var isListValid = checkIfItemListIsValid();
    //  if (!isListValid) {
    //    return false;
    //  }
    //
    //  showLoadingModal('Saving Record');
    //  var payload = formatPayload();
    //
    //  if ($routeParams.id) {
    //    promotionCategoryFactory.updatePromotionCategory($routeParams.id, payload).then(completeSave, showErrors);
    //  } else {
    //    promotionCategoryFactory.createPromotionCategory(payload).then(completeSave, showErrors);
    //  }
    //};
    //
    //$scope.addItem = function () {
    //  if (!$scope.promotionCatalog.startDate && !$scope.promotionCatalog.endDate) {
    //    messageService.display('warning', 'Please select a date range first', 'Add Promotion Category Item');
    //    return;
    //  }
    //
    //  var newIndex = $scope.itemList.length;
    //  $scope.itemList.push({
    //    itemIndex: newIndex,
    //    masterItemList: angular.copy($scope.masterItemList)
    //  });
    //};
    //
    //$scope.removeItem = function (item) {
    //  var itemIndex = lodash.indexOf($scope.itemList, item);
    //  if (angular.isDefined(itemIndex)) {
    //    $scope.itemList.splice(itemIndex, 1);
    //  }
    //};
    //
    //$scope.shouldDisableItemDropDown = function (item) {
    //  return angular.isDefined(item.masterItemList) ? item.masterItemList.length <= 0 : true;
    //};
    //
    //function setFilteredItemList(dataFromAPI, item) {
    //  item.masterItemList = angular.copy(dataFromAPI.masterItems);
    //  var oldItemId = !!item.selectedItem ? item.selectedItem.id : null;
    //  var oldItemMatch = lodash.findWhere(item.masterItemList, { id: oldItemId });
    //  if (!oldItemMatch) {
    //    item.selectedItem = null;
    //  }
    //}
    //
    //$scope.filterItemListFromCategory = function (item) {
    //  if (!item.selectedCategory) {
    //    item.masterItemList = angular.copy($scope.masterItemList);
    //    return;
    //  }
    //
    //  var category = item.selectedCategory;
    //  var itemPayload = {
    //    categoryId: category.id,
    //    startDate: dateUtility.formatDateForAPI($scope.promotionCatalog.startDate),
    //    endDate: dateUtility.formatDateForAPI($scope.promotionCatalog.endDate)
    //  };
    //
    //  promotionCategoryFactory.getMasterItemList(itemPayload).then(function (response) {
    //    setFilteredItemList(response, item);
    //  }, showErrors);
    //
    //};
    //

    function checkCatalogPromotionListWithNewPromotions() {
      angular.forEach($scope.catalogPromotionList, function (catalogPromotion) {
        var promotionMatch = lodash.findWhere($scope.promotionList, { id: catalogPromotion.id });
        if (promotionMatch && !catalogPromotion.promotionName) {
          catalogPromotion.promotionName = promotionMatch.promotionName;
        } else {
          catalogPromotion = {};
        }
      });
    }

    function setPromotionList(dataFromAPI) {
      $scope.promotionList = angular.copy(dataFromAPI.promotions);
      checkCatalogPromotionListWithNewPromotions();
      hideLoadingModal();
    }

    function getPromotionList() {
      showLoadingModal();
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.promotionCatalog.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCatalog.endDate)
      };

      promotionCatalogFactory.getPromotionList(payload).then(setPromotionList, showErrors);
    }

    //
    //function formatItemListForApp(promotionCategory, itemList) {
    //  angular.forEach(promotionCategory.companyPromotionCategoryItems, function (item) {
    //    var newItem = {};
    //    var categoryMatch = lodash.findWhere($scope.categoryList, { id: item.salesCategoryId });
    //    var itemMatch = lodash.findWhere(itemList, { id: item.itemId });
    //    newItem.selectedCategory = categoryMatch || null;
    //    newItem.selectedItem = itemMatch || null;
    //    newItem.masterItemList = [];
    //    newItem.recordId = item.id;
    //    $scope.itemList.push(newItem);
    //  });
    //}

    function formatPromotionListForApp(promotionOrderListFromAPI) {
      var newList = [];
      angular.forEach(promotionOrderListFromAPI, function (promotion) {
        var newPromotion = {
          recordId: promotion.id,
          id: promotion.promotionId,
          sortOrder: promotion.sortOrder
        };

        newList.push(newPromotion);
      });

      return newList;
    }

    function formatPromotionCatalogForApp(promotionCatalogFromAPI) {
      var promotionCatalog = angular.copy(promotionCatalogFromAPI);
      promotionCatalog.startDate = dateUtility.formatDateForApp(promotionCatalog.startDate);
      promotionCatalog.endDate = dateUtility.formatDateForApp(promotionCatalog.endDate);
      $scope.catalogPromotionList = formatPromotionListForApp(promotionCatalog.companyPromotionCatalogOrderCatalogs);

      $scope.promotionCatalog = promotionCatalog;
    }

    this.setViewVariables = function () {
      var canEdit = false;

      if ($routeParams.action === 'edit' && $scope.promotionCatalog) {
        var isInFuture = dateUtility.isAfterToday($scope.promotionCatalog.startDate) && dateUtility.isAfterToday($scope.promotionCategory.endDate);
        var isInPast = dateUtility.isYesterdayOrEarlier($scope.promotionCatalog.endDate);
        canEdit = isInFuture;
        $scope.isViewOnly = isInPast;
      } else {
        $scope.isViewOnly = $routeParams.action === 'view';
        canEdit = $routeParams.action === 'create';
      }

      $scope.disableEditField = !canEdit || $scope.isViewOnly;
    };

    function setPromotionCatalog(dataFromAPI) {
      formatPromotionCatalogForApp(dataFromAPI);

      $this.setViewVariables();
      hideLoadingModal();
    }

    function init() {
      $scope.isViewOnly = false;
      $scope.disableEditField = false;

      if ($routeParams.id) {
        showLoadingModal('Loading Data');
        promotionCatalogFactory.getPromotionCatalog($routeParams.id).then(setPromotionCatalog, showErrors);
      }
    }

    init();

    $scope.$watchGroup(['promotionCatalog.startDate', 'promotionCatalog.endDate'], function () {
      if ($scope.promotionCatalog && $scope.promotionCatalog.startDate && $scope.promotionCatalog.endDate) {
        getPromotionList();
      }
    });

  }
)
;
