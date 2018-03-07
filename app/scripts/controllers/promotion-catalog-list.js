'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PromotionCatalogListCtrl
 * @description
 * # PromotionCatalogListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PromotionCatalogListCtrl', function ($window, $scope, promotionCatalogFactory, dateUtility, $location, accessService) {
    $scope.viewName = 'Promotion Catalogs';
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
      return (angular.isDefined($scope.promotionCatalogs) && $scope.promotionCatalogs !== null && $this.meta.offset < $this.meta.count);
    };

    $scope.shouldShowSearchPrompt = function () {
      return !$scope.promotionCatalogs;
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !$this.isLoading && angular.isDefined($scope.promotionCatalogs) && $scope.promotionCatalogs !== null && $scope.promotionCatalogs.length <= 0;
    };

    $scope.redirectRecordToAction = function (action, recordId, isConjunction) {
      var path = isConjunction ? 'promotion-catalog-conjunction/' : 'promotion-catalog/';
      $location.path(path + action + '/' + recordId);
      $window.location.reload();
    };

    $scope.canEdit = function (catalog) {
      return dateUtility.isTomorrowOrLaterDatePicker(catalog.endDate) || dateUtility.isTodayDatePicker(catalog.endDate);
    };

    $scope.canDelete = function (catalog) {
      return dateUtility.isTomorrowOrLaterDatePicker(catalog.startDate);
    };

    $scope.removeRecord = function (catalog) {
      showLoadingModal('Removing Record');
      promotionCatalogFactory.deletePromotionCatalog(catalog.id).then(function () {
        hideLoadingModal();
        $scope.searchPromotionCatalogs();
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

    function getPromotionCatalogsSuccess(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var newPromotionCatalogList = angular.copy(dataFromAPI.companyPromotionCatalogs);
      angular.forEach(newPromotionCatalogList, function (catalog) {
        catalog.startDate = dateUtility.formatDateForApp(catalog.startDate);
        catalog.endDate = dateUtility.formatDateForApp(catalog.endDate);
        catalog.conjunctionFlag = catalog.conjunctionFlag === 'true';
      });

      $scope.promotionCatalogs = $scope.promotionCatalogs || [];
      $scope.promotionCatalogs = $scope.promotionCatalogs.concat(newPromotionCatalogList);

      hideLoadingBar();
      hideLoadingModal();
    }

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.promotionCatalogs = null;
      resetSearchMetaVars();
    };

    $scope.getPromotionCatalogs = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = createSearchPayload();
      showLoadingBar();
      promotionCatalogFactory.getPromotionCatalogList(payload).then(getPromotionCatalogsSuccess);
      $this.meta.offset += $this.meta.limit;

    };

    $scope.searchPromotionCatalogs = function () {
      resetSearchMetaVars();
      $scope.promotionCatalogs = [];
      showLoadingModal();
      $scope.getPromotionCatalogs();
    };

    $scope.getUpdatedOn = function (catalog) {
      return catalog.updatedOn ? dateUtility.formatTimestampForApp(catalog.updatedOn) : dateUtility.formatTimestampForApp(catalog.createdOn);
    };

    $scope.getUpdateBy = function (promotion) {
      if (promotion.updatedByPerson) {
        return promotion.updatedByPerson.userName;
      }

        if (promotion.createdByPerson) {
          return promotion.createdByPerson.userName;
        }

        return '';
      };

    function init() {
      $scope.isCRUD = accessService.crudAccessGranted('PROMOTION', 'PROMOTIONCATALOG', 'CRUDPRCTL');
      $scope.promotionCatalogs = null;
      resetSearchMetaVars();
      $scope.search = {};
    }

    init();

  });
