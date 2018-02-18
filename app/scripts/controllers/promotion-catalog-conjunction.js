'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCatalogConjunctionCtrl
 * @description
 * # PromotionCatalogConjunctionCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCatalogConjunctionCtrl', function ($scope, $routeParams, promotionCatalogFactory, globalMenuService, $q, lodash, messageService, dateUtility, $location, accessService) {

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

    function handleDeleteError() {
      $scope.errorCustom = [{
        field: 'Promotion Conjunction',
        value: 'Record could not be deleted'
      }];

      showErrors();
    }

    function deleteSuccess() {
      hideLoadingModal();
      messageService.display('success', 'Record successfully Deleted');
      $location.path('promotion-catalog-list');
    }

    $scope.removeRecord = function () {
      showLoadingModal('Removing Record');
      promotionCatalogFactory.deletePromotionCatalogConjunction($routeParams.id).then(deleteSuccess, handleDeleteError);
    };

    function completeSave() {
      hideLoadingModal();
      var action = $routeParams.action === 'edit' ? 'updated' : 'created';
      messageService.display('success', 'Record successfully ' + action, 'Save Promotion Catalog Conjunction');
      $location.path('promotion-catalog-list');
    }

    function getCatalogIdFromPromotion(promotionId) {
      var promotionCatalogRecord = lodash.findWhere($scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { promotionId: promotionId });
      if (!promotionCatalogRecord) {
        return null;
      }

      return promotionCatalogRecord.id;
    }

    function formatPromotionForAPI(promotion, isParent) {
      if (!promotion.selectedPromotion) {
        return null;
      }

      var attributeNameForId = isParent ? 'promotionCatalogOrderId' : 'promotionCatalogOrderConjunctionId';
      var formattedPromotion = {};

      formattedPromotion[attributeNameForId] = getCatalogIdFromPromotion(promotion.selectedPromotion.id);

      // TODO: uncomment for rsvr APIs
      //if(promotion.recordId) {
      //  formattedPromotion.id = promotion.recordId;
      //}

      return formattedPromotion;
    }

    function formatConjunctionPayload(parentPromotionConjunction) {
      var conjunctionList = [];

      angular.forEach(parentPromotionConjunction.childPromotions, function (childPromotion) {
        var childPayload = formatPromotionForAPI(childPromotion, false);
        if (childPayload) {
          conjunctionList.push(childPayload);
        }
      });

      return conjunctionList;
    }

    function formatPayload() {
      var payload = {
        companyPromotionCatalogConjunctions: []
      };

      angular.forEach($scope.conjunctionList, function (promotionConjunction) {
        var parentPayload = formatPromotionForAPI(promotionConjunction, true);
        if (parentPayload) {
          parentPayload.conjunctions = formatConjunctionPayload(promotionConjunction);
          payload.companyPromotionCatalogConjunctions.push(parentPayload);
        }
      });

      return payload;
    }

    function checkIfChildPromotionListIsValid(childPromotionsList) {
      var isListValid = false;

      angular.forEach(childPromotionsList, function (childPromotion) {
        isListValid = !!childPromotion.selectedPromotion || isListValid;
      });

      return isListValid;
    }

    function checkIfPromotionConjunctionListIsValid() {
      var isListValid = false;
      angular.forEach($scope.conjunctionList, function (promotionConjunction) {
        var isParentValid = !!promotionConjunction.selectedPromotion;
        var areChildrenValid = checkIfChildPromotionListIsValid(promotionConjunction.childPromotions);

        isListValid = (isParentValid && areChildrenValid) || isListValid;
      });

      if ($scope.conjunctionList.length <= 0 || !isListValid) {
        $scope.errorCustom = [{
          field: 'Promotion Conjunction List',
          value: 'At least one promotion conjunction must be selected'
        }];

        showErrors();
        return false;
      }

      return true;
    }

    $scope.save = function () {
      if (!$scope.promotionCatalogConjunctionForm.$valid) {
        return false;
      }

      var isListValid = checkIfPromotionConjunctionListIsValid();
      if (!isListValid) {
        return false;
      }

      showLoadingModal('Saving Record');
      var payload = formatPayload();

      if ($routeParams.id) {
        promotionCatalogFactory.updatePromotionCatalogConjunction($routeParams.id, payload).then(completeSave, showErrors);
      } else {
        promotionCatalogFactory.createPromotionCatalogConjunction(payload).then(completeSave, showErrors);
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

    function getPromotionFromCatalogId(promotionCatalogRecordId) {
      var promotionCatalogRecord = lodash.findWhere($scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { id: promotionCatalogRecordId });
      if (!promotionCatalogRecord) {
        return null;
      }

      return lodash.findWhere($scope.selectedPromotionList, { id: promotionCatalogRecord.promotionId }) || null;
    }

    function formatPromotionConjunctionForApp(parentPromotionConjunctionFromAPI, index) {
      var newParent = {
        index: index,
        recordId: parentPromotionConjunctionFromAPI.id,
        selectedPromotion: getPromotionFromCatalogId(parentPromotionConjunctionFromAPI.promotionCatalogOrderId),
        filteredChildPromotionList: $scope.selectedPromotionList,
        childPromotions: []
      };

      angular.forEach(parentPromotionConjunctionFromAPI.conjunctions, function (childPromotion, index) {
        var promotionMatch = lodash.findWhere($scope.selectedPromotionList, { id: childPromotion.promotionId });
        var newChild = {
          index: index,
          recordId: childPromotion.id,
          selectedPromotion: promotionMatch || null
        };

        newParent.childPromotions.push(newChild);
      });

      return newParent;
    }

    function formatPromotionConjunctionFroApp(promotionConjunctionsFromAPI) {
      var promotionConjunctions = angular.copy(promotionConjunctionsFromAPI.companyPromotionCatalogConjunctions);

      angular.forEach(promotionConjunctions, function (parentPromotionConjunction, index) {
        var newParent = formatPromotionConjunctionForApp(parentPromotionConjunction, index);
        $scope.conjunctionList.push(newParent);
        $scope.updatedFilteredPromotionLists(newParent);
      });
    }

    this.setViewVariables = function () {
      var isFuture = dateUtility.isAfterToday($scope.promotionCatalog.startDate) && dateUtility.isAfterToday($scope.promotionCatalog.endDate);
      $scope.isViewOnly = !isFuture;
      $scope.canDelete = isFuture && $routeParams.action !== 'create';
    };

    function completeInit(promotionListFromAPI, promotionConjunctionFromAPI) {
      var allPromotions = angular.copy(promotionListFromAPI.promotions);
      $scope.selectedPromotionList = [];
      angular.forEach($scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, function (selectedPromotion) {
        var promotionMatch = lodash.findWhere(allPromotions, { id: selectedPromotion.promotionId });
        if (promotionMatch) {
          $scope.selectedPromotionList.push(promotionMatch);
        }
      });

      $scope.filteredPromotionList = $scope.selectedPromotionList;

      if (promotionConjunctionFromAPI) {
        formatPromotionConjunctionFroApp(promotionConjunctionFromAPI);
      }

      $this.setViewVariables();
      hideLoadingModal();
    }

    function continueInit(responseCollectionFromAPI) {
      $scope.promotionCatalog = angular.copy(responseCollectionFromAPI[0]);
      $scope.promotionCatalog.startDate = dateUtility.formatDateForApp($scope.promotionCatalog.startDate);
      $scope.promotionCatalog.endDate = dateUtility.formatDateForApp($scope.promotionCatalog.endDate);

      var promotionPayload = {
        startDate: dateUtility.formatDateForAPI($scope.promotionCatalog.startDate),
        endDate: dateUtility.formatDateForAPI($scope.promotionCatalog.endDate)
      };

      promotionCatalogFactory.getPromotionList(promotionPayload).then(function (promotionListFromAPI) {
        completeInit(promotionListFromAPI, responseCollectionFromAPI[1] || null);
      }, showErrors);
    }

    function getInitPromises() {
      var initPromises = [
        promotionCatalogFactory.getPromotionCatalog($routeParams.id)
      ];

      if ($routeParams.action !== 'create') {
        initPromises.push(promotionCatalogFactory.getPromotionCatalogConjunction($routeParams.id));
      }

      return initPromises;
    }

    function init() {
      $scope.isCRUD = accessService.crudAccessGranted('PROMOTION', 'PROMOTIONCATALOG', 'CRUDPRCTL');
      $scope.isViewOnly = true;
      $scope.conjunctionList = [];

      showLoadingModal('Loading Data');

      var promises = getInitPromises();
      $q.all(promises).then(continueInit, showErrors);
    }

    init();
  }
)
;
