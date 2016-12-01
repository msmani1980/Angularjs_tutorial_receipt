'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCatalogCtrl
 * @description
 * # PromotionCatalogCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCatalogCtrl', function ($scope, $routeParams, promotionCatalogFactory, globalMenuService, $q, lodash, messageService, dateUtility, $location) {

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

    function completeSave() {
      hideLoadingModal();
      var action = $routeParams.action === 'edit' ? 'updated' : 'created';
      messageService.display('success', 'Record successfully ' + action, 'Save Promotion Catalog');
      $location.path('promotion-catalog-list');
    }

    function formatPromotionListPayload() {
      var promotionListPayload = [];
      var sortOrderIndex = 1;

      angular.forEach($scope.catalogPromotionList, function (promotion) {
        if (!promotion.selectedPromotion) {
          return;
        }

        var newPromotion = {};
        newPromotion.promotionId = promotion.selectedPromotion.id;
        newPromotion.sortOrder = sortOrderIndex;

        if ($routeParams.id && promotion.recordId) {
          newPromotion.id = promotion.recordId;
        }

        promotionListPayload.push(newPromotion);
        sortOrderIndex += 1;
      });

      return promotionListPayload;
    }

    function formatPayload() {
      var payload = {};
      payload.startDate = dateUtility.formatDateForAPI(angular.copy($scope.promotionCatalog.startDate));
      payload.endDate = dateUtility.formatDateForAPI(angular.copy($scope.promotionCatalog.endDate));
      payload.promotionCatalogName = $scope.promotionCatalog.promotionCatalogName;
      payload.companyPromotionCatalogOrderCatalogs = formatPromotionListPayload();

      if ($routeParams.id) {
        payload.id = parseInt($routeParams.id);
      }

      return payload;
    }

    function checkIfPromotionListIsValid() {
      var isListValid = false;
      angular.forEach($scope.catalogPromotionList, function (promotion) {
        isListValid = !!promotion.selectedPromotion || isListValid;
      });

      if ($scope.catalogPromotionList.length <= 0 || !isListValid) {
        $scope.errorCustom = [{
          field: 'Promotion List',
          value: 'At least one promotion must be selected'
        }];

        showErrors();
        return false;
      }

      return true;
    }

    $scope.save = function () {
      if (!$scope.promotionCatalogForm.$valid) {
        return false;
      }

      var isListValid = checkIfPromotionListIsValid();
      if (!isListValid) {
        return false;
      }

      showLoadingModal('Saving Record');
      var payload = formatPayload();

      if ($routeParams.id) {
        promotionCatalogFactory.updatePromotionCatalog($routeParams.id, payload).then(completeSave, showErrors);
      } else {
        promotionCatalogFactory.createPromotionCatalog(payload).then(completeSave, showErrors);
      }
    };

    $scope.addItem = function () {
      if (!$scope.promotionCatalog.startDate && !$scope.promotionCatalog.endDate) {
        messageService.display('warning', 'Please select a date range first', 'Add Promotion');
        return;
      }

      $scope.catalogPromotionList = $scope.catalogPromotionList || [];
      var sortOrder = $scope.catalogPromotionList.length + 1;
      $scope.catalogPromotionList.push({
        sortOrder: sortOrder,
        selectedPromotion: null
      });
    };

    $scope.removePromotion = function (promotion) {
      var recordIndex = lodash.indexOf($scope.catalogPromotionList, promotion);
      if (angular.isDefined(recordIndex)) {
        $scope.catalogPromotionList.splice(recordIndex, 1);
      }

      angular.forEach($scope.catalogPromotionList, function (promotion, index) {
        promotion.sortOrder = index + 1;
      });
      
      $scope.filteredPromotionList = lodash.filter($scope.promotionList, function (promotion) {
          var promotionMatch = lodash.findWhere($scope.catalogPromotionList, { selectedPromotion: promotion });
          return !promotionMatch;
        });
    };

    $scope.setFilteredPromotionList = function () {
      $scope.filteredPromotionList = lodash.filter($scope.promotionList, function (promotion) {
        var promotionMatch = lodash.findWhere($scope.catalogPromotionList, { selectedPromotion: promotion });
        return !promotionMatch;
      });
    };

    function checkCatalogPromotionListWithNewPromotions() {
      var shouldShowWarning = false;
      angular.forEach($scope.catalogPromotionList, function (catalogPromotion) {
        var promotionMatch = !!catalogPromotion.selectedPromotion ? lodash.findWhere($scope.promotionList, { id: catalogPromotion.selectedPromotion.id }) : null;
        catalogPromotion.selectedPromotion = promotionMatch || null;
        shouldShowWarning = shouldShowWarning || !promotionMatch;
      });

      $scope.setFilteredPromotionList();
      if (shouldShowWarning) {
        messageService.display('warning', 'One or more promotions were cleared because they are not in the selected date range', 'Promotion List');
      }
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

    function formatCatalogPromotionListForApp(promotionOrderListFromAPI) {
      var newList = [];
      angular.forEach(promotionOrderListFromAPI, function (promotion) {
        var newPromotion = {
          recordId: promotion.id,
          sortOrder: promotion.sortOrder,
          selectedPromotion: {
            id: promotion.promotionId
          }
        };

        newList.push(newPromotion);
      });

      newList = lodash.sortBy(newList, 'sortOrder');
      return newList;
    }

    function formatPromotionCatalogForApp(promotionCatalogFromAPI) {
      var promotionCatalog = angular.copy(promotionCatalogFromAPI);
      promotionCatalog.startDate = dateUtility.formatDateForApp(promotionCatalog.startDate);
      promotionCatalog.endDate = dateUtility.formatDateForApp(promotionCatalog.endDate);
      $scope.catalogPromotionList = formatCatalogPromotionListForApp(promotionCatalog.companyPromotionCatalogOrderCatalogs);

      $scope.promotionCatalog = promotionCatalog;
    }

    this.setViewVariables = function () {
      var canEdit = false;

      if ($routeParams.action === 'edit' && $scope.promotionCatalog) {
        var isInFuture = dateUtility.isAfterToday($scope.promotionCatalog.startDate) && dateUtility.isAfterToday($scope.promotionCatalog.endDate);
        var isInPast = dateUtility.isYesterdayOrEarlier($scope.promotionCatalog.endDate);
        canEdit = isInFuture;
        $scope.isViewOnly = isInPast;
      } else {
        $scope.isViewOnly = $routeParams.action === 'view';
        canEdit = $routeParams.action === 'create';
      }

      $scope.disableEditField = !canEdit || $scope.isViewOnly;
      $scope.minDate = $routeParams.action === 'view' ? 0 : dateUtility.dateNumDaysAfterTodayFormatted(1);
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
);