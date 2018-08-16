'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryListCtrl
 * @description
 * # PromotionCategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryListCtrl', function ($scope, promotionCategoryFactory, dateUtility, $location, accessService) {
    $scope.viewName = 'Promotion Categories';
    var $this = this;

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showLoadingBar() {
      $this.isLoading = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $this.isLoading = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function resetSearchMetaVars() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    }

    $scope.shouldShowLoadingAlert = function () {
      return (angular.isDefined($scope.promotionCategories) && $scope.promotionCategories !== null && $this.meta.offset < $this.meta.count);
    };

    $scope.shouldShowSearchPrompt = function () {
      return !$scope.promotionCategories;
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !$this.isLoading && angular.isDefined($scope.promotionCategories) && $scope.promotionCategories !== null && $scope.promotionCategories.length <= 0;
    };

    $scope.viewOrEditRecord = function (action, recordId) {
      $location.path('promotion-category/' + action + '/' + recordId);
    };

    $scope.canEdit = function (category) {
      return dateUtility.isTodayDatePicker(category.endDate) || dateUtility.isTomorrowOrLaterDatePicker(category.endDate);
    };

    $scope.canDelete = function (category) {
      return dateUtility.isTomorrowOrLaterDatePicker(category.startDate);
    };

    $scope.removeRecord = function (category) {
      showLoadingModal('Removing Record');
      promotionCategoryFactory.deletePromotionCategory(category.id).then(function () {
        hideLoadingModal();
        init();
      }, showErrors);
    };

    function createSearchPayload() {
      var payload = angular.copy($scope.search);

      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      }

      if (payload.endDate) {
        payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      }

      payload.limit = $this.meta.limit;
      payload.offset = $this.meta.offset;

      return payload;
    }

    function getPromotionCategoriesSuccess(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var newStoreInstanceList = angular.copy(dataFromAPI.companyPromotionCategories);
      angular.forEach(newStoreInstanceList, function (category) {
        category.startDate = dateUtility.formatDateForApp(category.startDate);
        category.endDate = dateUtility.formatDateForApp(category.endDate);
      });

      $scope.promotionCategories = $scope.promotionCategories || [];
      $scope.promotionCategories = $scope.promotionCategories.concat(newStoreInstanceList);

      hideLoadingBar();
      hideLoadingModal();
    }

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.promotionCategories = null;
      resetSearchMetaVars();
    };

    $scope.getPromotionCategories = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = createSearchPayload();
      showLoadingBar();
      promotionCategoryFactory.getPromotionCategoryList(payload).then(getPromotionCategoriesSuccess);
      $this.meta.offset += $this.meta.limit;

    };

    $scope.searchPromotionCategories = function () {
      resetSearchMetaVars();
      $scope.promotionCategories = [];
      showLoadingModal();
      $scope.getPromotionCategories();
    };

    $scope.getUpdatedOn = function (category) {
      return category.updatedOn ? dateUtility.formatTimestampForApp(category.updatedOn) : dateUtility.formatTimestampForApp(category.createdOn);
    };

    $scope.getUpdateBy = function (category) {
      if (category.updatedByPerson) {
        return category.updatedByPerson.userName;
      }

      if (category.createdByPerson) {
        return category.createdByPerson.userName;
      }

      return '';
    };

    $scope.copyPromotionCategory = function(category) {
      console.log ('copyPromotionCategory', category);
      //$location.path('/promotion-category/copy/' + category.id);
    };

    function init() {
      $scope.isCRUD = accessService.crudAccessGranted('PROMOTION', 'PROMOTIONCATEGORY', 'CRUDPRCAT');
      $scope.promotionCategories = null;
      resetSearchMetaVars();
      $scope.search = {};
    }

    init();

  });
