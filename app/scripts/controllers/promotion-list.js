'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionListCtrl
 * @description
 * # PromotionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionListCtrl', function ($scope, $q, $location, payloadUtility, dateUtility, promotionsFactory, recordsService) {
    var $this = this;
    $scope.viewName = 'Promotions';
    $scope.search = {};
    $scope.promotionList = [];
    $scope.promotionTypeList = [];
    $scope.benefitTypeList = [];
    $scope.promotionToDelete = {};
    $scope.defaultLimit = 100;

    this.formatDates = function (data) {
      var formattedData = angular.copy(data);
      angular.forEach(formattedData, function (item) {
        item.startDate = dateUtility.formatDateForApp(item.startDate);
        item.endDate = dateUtility.formatDateForApp(item.endDate);
      });

      return formattedData;
    };

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    $scope.searchPromotions = function () {
      $this.showLoadingModal();
      promotionsFactory.getPromotions(payloadUtility.serializeDates($scope.search)).then(function (dataFromAPI) {
        $this.hideLoadingModal();
        $this.setPromotionsList(dataFromAPI);
      });
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchPromotions();
    };

    $scope.editPromotion = function (promotion) {
      $location.path('/promotions/edit/' + promotion.id);
    };

    $scope.isPromotionEditable = function (promotion) {
      if (angular.isUndefined(promotion)) {
        return false;
      }
      return dateUtility.isAfterToday(promotion.endDate);
    };

    $scope.isPromotionReadOnly = function (promotion) {
      if (!promotion.startDate) {
        return false;
      }
      return !(dateUtility.isAfterToday(promotion.startDate));
    };

    this.deletePromotion = function (promotionId) {
      promotionsFactory.deletePromotion(promotionId);
    };

    $scope.showDeleteConfirmation = function (index, promotion) {
      $scope.promotionToDelete = promotion;
      $scope.promotionToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deletePromotion = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#promotion-' + $scope.promotionToDelete.rowIndex).remove();

      $this.deletePromotion($scope.promotionToDelete.id);
    };

    this.setPromotionsList = function (dataFromAPI) {
      $scope.promotionList = $this.formatDates(dataFromAPI.promotions);
    };

    this.setBenefitTypeList = function (dataFromAPI) {
      $scope.benefitTypeList = angular.copy(dataFromAPI);
    };

    this.setPromotionTypeList = function (dataFromAPI) {
      $scope.promotionTypeList = angular.copy(dataFromAPI);
    };

    this.getPromotionList = function () {
      return promotionsFactory.getPromotions({limit: $scope.defaultLimit}).then($this.setPromotionsList);
    };

    this.getBenefitTypeList = function () {
      return recordsService.getBenefitTypes().then($this.setBenefitTypeList);
    };

    this.getPromotionTypeList = function () {
      return recordsService.getPromotionTypes().then($this.setPromotionTypeList);
    };

    this.makeDependencyPromises = function () {
      return [
        $this.getBenefitTypeList(),
        $this.getPromotionTypeList(),
        $this.getPromotionList()
      ];
    };

    this.dependenciesSuccess = function () {
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
    };

    this.init = function () {
      $this.showLoadingModal('Loading Promotions.');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function (response) {
        $this.dependenciesSuccess(response);
      });
    };


    this.init();
  });
