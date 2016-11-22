'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCatalogConjunctionCtrl
 * @description
 * # PromotionCatalogConjunctionCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCatalogConjunctionCtrl', function ($scope, $routeParams, promotionCatalogFactory, globalMenuService, $q, lodash, messageService, dateUtility, $location) {

    $scope.itemList = [];
    $scope.promotionCatalog = {};
    $scope.minDate = dateUtility.dateNumDaysAfterTodayFormatted(1);
    $scope.startMinDate = $routeParams.action === 'create' ? $scope.minDate : '';

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

    $scope.shouldDisableNewChildPromotion = function (promotionConjunction) {
      if (!promotionConjunction || !$scope.selectedPromotionList) {
        return true;
      }

      return promotionConjunction.childPromotions.length >= ($scope.selectedPromotionList.length - 1);
    };

    $scope.shouldDisableNewPromotionConjunctions = function () {
      if (!$scope.conjunctionList || !$scope.selectedPromotionList) {
        return true;
      }

      return $scope.conjunctionList.length >= $scope.selectedPromotionList.length;
    };

    $scope.updateFilteredChildPromotionList = function (promotionConjunction) {
      if (!promotionConjunction) {
        return;
      }

      var childMatch = lodash.findWhere(promotionConjunction.childPromotions, { selectedPromotion: promotionConjunction.selectedPromotion });
      if (childMatch) {
        childMatch.selectedPromotion = null;
      }

      promotionConjunction.filteredChildPromotionList = lodash.filter($scope.selectedPromotionList, function (promotion) {
        var promotionMatch = lodash.findWhere(promotionConjunction.childPromotions, { selectedPromotion: promotion });
        return !promotionMatch && promotion !== promotionConjunction.selectedPromotion;
      });
    };

    $scope.updatedFilteredPromotionLists = function (promotionConjunction) {
      $scope.filteredPromotionList = lodash.filter($scope.selectedPromotionList, function (promotion) {
        var promotionMatch = lodash.findWhere($scope.conjunctionList, { selectedPromotion: promotion });
        return !promotionMatch;
      });

      $scope.updateFilteredChildPromotionList(promotionConjunction);
    };

    $scope.removeConjunctionChild = function (parent, child) {
      var childIndex = parent.childPromotions.indexOf(child);
      parent.childPromotions.splice(childIndex, 1);

      angular.forEach(parent.childPromotions, function (childPromotion, index) {
        childPromotion.index = index;
      });

      $scope.updateFilteredChildPromotionList(parent);
    };

    $scope.removeConjunction = function (promotionConjunction) {
      var conjunctionIndex = $scope.conjunctionList.indexOf(promotionConjunction);
      $scope.conjunctionList.splice(conjunctionIndex, 1);

      angular.forEach($scope.conjunctionList, function (conjunction, index) {
        conjunction.index = index;
      });

      $scope.updatedFilteredPromotionLists();
    };

    $scope.newConjunctionChild = function (conjunction) {
      conjunction.childPromotions.push({
        index: conjunction.childPromotions.length
      });
    };

    $scope.newConjunction = function () {
      var newConjunction = {
        index: $scope.conjunctionList.length,
        childPromotions: [{ index: 0 }],
        filteredChildPromotionList: $scope.selectedPromotionList
      };

      $scope.conjunctionList.push(newConjunction);
    };

    //this.setViewVariables = function () {
    //  var canEdit = false;
    //
    //  if ($routeParams.action === 'edit' && $scope.promotionCatalog) {
    //    var isInFuture = dateUtility.isAfterToday($scope.promotionCatalog.startDate) && dateUtility.isAfterToday($scope.promotionCatalog.endDate);
    //    var isInPast = dateUtility.isYesterdayOrEarlier($scope.promotionCatalog.endDate);
    //    canEdit = isInFuture;
    //    $scope.isViewOnly = isInPast;
    //  } else {
    //    $scope.isViewOnly = $routeParams.action === 'view';
    //    canEdit = $routeParams.action === 'create';
    //  }
    //
    //  $scope.disableEditField = !canEdit || $scope.isViewOnly;
    //};

    function completeInit(promotionListFromAPI) {
      var allPromotions = angular.copy(promotionListFromAPI.promotions);
      $scope.selectedPromotionList = [];
      angular.forEach($scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, function (selectedPromotion) {
        var promotionMatch = lodash.findWhere(allPromotions, { id: selectedPromotion.promotionId });
        if (promotionMatch) {
          $scope.selectedPromotionList.push(promotionMatch);
        }
      });

      $scope.filteredPromotionList = $scope.selectedPromotionList;
      hideLoadingModal();
    }

    function continueInit(promotionCatalogFromAPI) {
      $scope.promotionCatalog = angular.copy(promotionCatalogFromAPI);

      var promotionPayload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.promotionCatalog.startDate)),
        endDate: dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.promotionCatalog.endDate))
      };

      promotionCatalogFactory.getPromotionList(promotionPayload).then(completeInit, showErrors);
    }

    function init() {
      $scope.isViewOnly = false;
      $scope.disableEditField = false;
      $scope.conjunctionList = [];

      showLoadingModal('Loading Data');
      promotionCatalogFactory.getPromotionCatalog($routeParams.id).then(continueInit, showErrors);
    }

    init();

  }
)
;
