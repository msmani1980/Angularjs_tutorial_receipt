'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCategoryListCtrl
 * @description
 * # PromotionCategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCategoryListCtrl', function ($scope, promotionCategoriesService, dateUtility, $location) {
    $scope.viewName = 'Promotion Categories';
    $scope.promotionCategories = null;
    $scope.search = {};

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.viewOrEditRecord = function (action, recordId) {
      $location.path('promotion-category/' + action + '/' + recordId);
    };

    function createSearchPayload() {
      var payload = angular.copy($scope.search);

      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      }

      if (payload.endDate) {
        payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      }

      return payload;
    }

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.promotionCategories = null;
    };

    $scope.searchPromotionCategories = function () {
      var payload = createSearchPayload();
      showLoadingModal('Searching Promotion Categories');
      promotionCategoriesService.getPromotionCategories(payload).then(getPromotionCategoriesSuccess);
    };

    function getPromotionCategoriesSuccess(dataFromAPI) {
      $scope.promotionCategories = angular.copy(dataFromAPI.companyPromotionCategories);
      angular.forEach($scope.promotionCategories, function (category) {
        category.startDate = dateUtility.formatDateForApp(category.startDate);
        category.endDate = dateUtility.formatDateForApp(category.endDate);
      });

      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Data');
      promotionCategoriesService.getPromotionCategories().then(getPromotionCategoriesSuccess);
    }

    init();

  });
