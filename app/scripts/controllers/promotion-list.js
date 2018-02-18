'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionListCtrl
 * @description
 * # PromotionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionListCtrl', function($scope, $q, $location, payloadUtility, dateUtility, promotionsFactory,
    recordsService, lodash, accessService) {

    var $this = this;
    this.meta = {
      limit: 100,
      offset: 0
    };
    $scope.viewName = 'Promotions';
    $scope.search = {};
    $scope.promotionList = [];
    $scope.promotionTypeList = [];
    $scope.benefitTypeList = [];
    $scope.promotionToDelete = {};
    $scope.defaultLimit = 100;

    this.formatDates = function(promotion) {
      promotion.startDate = dateUtility.formatDateForApp(promotion.startDate);
      promotion.endDate = dateUtility.formatDateForApp(promotion.endDate);
      return promotion;
    };

    this.showLoadingModal = function(text) {
      angular.element('.loading-more').show();
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('.loading-more').hide();
      angular.element('#loading').modal('hide');
    };

    $scope.searchPromotions = function() {
      $this.showLoadingModal();
      $scope.promotionList = [];

      promotionsFactory.getPromotions(payloadUtility.serializeDates($scope.search)).then(function(dataFromAPI) {
        $this.hideLoadingModal();
        $this.setPromotionsList(dataFromAPI);
      });
    };

    $scope.clearForm = function() {
      $scope.search = {};
      $scope.promotionList = [];
    };

    $scope.viewPromotion = function(promotion) {
      $location.path('/promotions/view/' + promotion.id);
    };

    $scope.editPromotion = function(promotion) {
      $location.path('/promotions/edit/' + promotion.id);
    };

    $scope.isPromotionEditable = function(promotion) {
      if (angular.isUndefined(promotion)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(promotion.endDate) || dateUtility.isTodayDatePicker(promotion.endDate);
    };

    $scope.isPromotionReadOnly = function(promotion) {
      if (!promotion.startDate) {
        return false;
      }

      return !(dateUtility.isAfterTodayDatePicker(promotion.startDate));
    };

    this.deletePromotion = function(promotionId) {
      promotionsFactory.deletePromotion(promotionId);
    };

    $scope.showDeleteConfirmation = function(index, promotion) {
      $scope.promotionToDelete = promotion;
      $scope.promotionToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deletePromotion = function() {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#promotion-' + $scope.promotionToDelete.rowIndex).remove();

      $this.deletePromotion($scope.promotionToDelete.id);
    };

    this.setPromotionsList = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var promotionList = angular.copy(dataFromAPI.promotions);
      angular.forEach(promotionList, function(promotion) {
        $scope.promotionList.push($this.formatDates(promotion));
      });
    };

    this.setBenefitTypeList = function(dataFromAPI) {
      $scope.benefitTypeList = angular.copy(dataFromAPI);
    };

    this.setPromotionTypeList = function(dataFromAPI) {
      $scope.promotionTypeList = angular.copy(dataFromAPI);
    };

    $scope.getPromotionList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      payload.startDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());

      promotionsFactory.getPromotions(payload).then($this.setPromotionsList);
      $this.meta.offset += $this.meta.limit;
    };

    this.getBenefitTypeList = function() {
      return recordsService.getBenefitTypes().then($this.setBenefitTypeList);
    };

    this.getPromotionTypeList = function() {
      return recordsService.getPromotionTypes().then($this.setPromotionTypeList);
    };

    this.makeDependencyPromises = function() {
      return [
        $this.getBenefitTypeList(),
        $this.getPromotionTypeList()
      ];
    };

    this.dependenciesSuccess = function() {
      $scope.uiSelectTemplateReady = true;
      $this.hideLoadingModal();
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('PROMOTION', 'PROMOTION', 'CRUDPROMO');
      $this.showLoadingModal('Loading Promotions.');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then($this.dependenciesSuccess);
    };

    this.init();
  });
