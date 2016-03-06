'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceAmendCtrl
 * @description
 * # StoreInstanceAmendCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceAmendCtrl', function ($q, $scope, $routeParams, $filter, storeInstanceAmendFactory, dateUtility, lodash, globalMenuService, reconciliationFactory) {
    var $this = this;

    function formatAsCurrency(valueToFormat) {
      if (angular.isDefined(valueToFormat)) {
        return sprintf('%.2f', valueToFormat);
      }

      return valueToFormat;
    }

    $scope.showAddOrEditScheduleModal = function (scheduleToEdit) {
      if (scheduleToEdit) {
        $scope.scheduleToEdit = scheduleToEdit;
      }

      angular.element('#addScheduleModal').modal('show');
    };

    $scope.showRearrangeSectorModal = function () {
      angular.element('#rearrangeSectorModal').modal('show');
    };

    $scope.showMoveCashBagModal = function (cashBag) {
      $scope.cashBagToMove = cashBag;
      angular.element('#moveCashBagModal').modal('show');
    };

    $scope.clearScheduleSelections = function () {
      $scope.scheduleSearch = {};
      $scope.newScheduleSelection = null;
      $scope.searchScheduleResults = null;
      $scope.scheduleToEdit = null;
    };

    $scope.clearRearrangeSelections = function () {
      $scope.sectorsToMove = [];
    };

    $scope.clearMoveSearchResults = function () {
      $scope.moveSearch = {};
      $scope.moveCashBagSearchResults = null;
      $scope.targetRecordForMoveCashBag = null;
    };

    $scope.closeRearrangeSectorModal = function () {
      $scope.sectorsToMove = [];
      $scope.rearrangeOriginCashBag = null;
      $scope.rearrangeTargetCashBag = null;
    };

    $scope.closeMoveCashBagModal = function () {
      $scope.clearMoveSearchResults();
      $scope.moveCashBagAction = 'none';
      $scope.cashBagToMove = null;
    };

    $scope.canSaveRearrange = function () {
      return ($scope.sectorsToMove.length > 0 && !!$scope.rearrangeTargetCashBag);
    };

    $scope.toggleSelectSectorToRearrange = function (sector) {
      var matchIndex = lodash.findIndex($scope.sectorsToMove, sector);
      if (matchIndex < 0) {
        $scope.sectorsToMove.push(sector);
      } else {
        $scope.sectorsToMove.splice(matchIndex, 1);
      }
    };

    $scope.selectRecordForMoveCashBag = function (record) {
      $scope.targetRecordForMoveCashBag = record;
    };

    $scope.selectRecordForNewSchedule = function (record) {
      $scope.newScheduleSelection = record;
    };

    $scope.getClassesForRearrangeSectors = function (sector, tagType) {
      var selectedClasses = { background: 'bg-danger', buttonIcon: 'fa fa-check-circle', button: 'btn btn-danger btn-sm' };
      var deselectedClasses = { background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default btn-sm' };

      var objectMatch = lodash.findWhere($scope.sectorsToMove, { id: sector.id });
      var correctClassObj = (angular.isDefined(objectMatch)) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

    $scope.getClassesForSingleSelectedRow = function (record, tagType, recordType) {
      var selectedClasses = { background: 'bg-success', buttonIcon: 'fa fa-check-circle', button: 'btn btn-success' };
      var deselectedClasses = { background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default' };

      var target = (recordType === 'schedule') ? $scope.newScheduleSelection : $scope.targetRecordForMoveCashBag;

      var correctClassObj = (record === target) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

    this.searchForScheduleSuccess = function (dataFromAPI) {
      $scope.searchScheduleResults = angular.copy(dataFromAPI);
      if ($scope.searchScheduleResults.length === 1) {
        $scope.newScheduleSelection = $scope.searchScheduleResults[0];
      }
    };

    $scope.searchForSchedule = function () {
      return storeInstanceAmendFactory.getScheduleMockData($scope.scheduleSearch).then($this.searchForScheduleSuccess);
    };

    this.searchForMoveCashBagSuccess = function (dataFromAPI) {
      $scope.moveCashBagSearchResults = angular.copy(dataFromAPI);
      if ($scope.moveCashBagSearchResults.length === 1) {
        $scope.targetRecordForMoveCashBag = $scope.moveCashBagSearchResults[0];
      }
    };

    $scope.searchForMoveCashBag = function () {
      if ($scope.moveCashBagAction === 'merge') {
        return storeInstanceAmendFactory.getCashBagListMockData($scope.moveSearch).then($this.searchForMoveCashBagSuccess);
      }

      if ($scope.moveCashBagAction === 'reallocate') {
        return storeInstanceAmendFactory.getStoreInstancesMockData($scope.moveSearch).then($this.searchForMoveCashBagSuccess);
      }
    };

    $scope.getClassForTableAccordion = function (visibilityFlag) {
      return (visibilityFlag) ? 'fa fa-minus-square' : 'fa fa-plus-square-o';
    };

    $scope.getClassForAccordionArrows = function (accordionFlag) {
      return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
    };

    $scope.doesSectorHaveCrewData = function (flightSector) {
      return flightSector.crewData.length > 0;
    };

    $scope.shouldShowCashBag = function (cashBag) {
      var canCashBagBeVisible = ($scope.showDeletedCashBags) ? true : !cashBag.isDeleted;
      var isCashBagInFilter = true;
      if ($scope.cashBagFilter.filterList && $scope.cashBagFilter.filterList.length > 0) {
        var cashBagMatch = lodash.findWhere($scope.cashBagFilter.filterList, { id: cashBag.id });
        isCashBagInFilter = angular.isDefined(cashBagMatch);
      }

      return canCashBagBeVisible && isCashBagInFilter;
    };

    $scope.toggleVerifiedCashBag = function (cashBag) {
      cashBag.isVerified = !cashBag.isVerified;
    };

    $scope.isCrewDataOpen = function (cashBag) {
      var crewRecordOpen = false;
      angular.forEach(cashBag.flightSectors, function (sector) {
        crewRecordOpen = sector.rowOpen || crewRecordOpen;
      });

      return crewRecordOpen;
    };

    $scope.toggleCrewDetails = function (cashBag, shouldExpand) {
      angular.forEach(cashBag.flightSectors, function (sector) {
        if (sector.crewData.length) {
          sector.rowOpen = shouldExpand;
        }
      });
    };

    function getCurrencyByBaseCurrencyId(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    }

    function getCashBagListSuccess (dataFromAPI) {
      $scope.cashBagList = angular.copy(dataFromAPI);
    }

    function getCashBagList () {
      return storeInstanceAmendFactory.getCashBagListMockData().then(getCashBagListSuccess);
    }

    function setStoreInstance (storeInstanceDataFromAPI) {
      var storeInstance = angular.copy(storeInstanceDataFromAPI);
      storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);

      $scope.storeInstance = storeInstance;
    }

    function getStoreInstance () {
      return reconciliationFactory.getStoreInstanceDetails($routeParams.storeInstanceId).then(setStoreInstance);
    }

    function setCompany (companyFromAPI) {
      $scope.company = angular.copy(companyFromAPI);
    }

    function getCompany () {
      var companyId = globalMenuService.company.get();
      return reconciliationFactory.getCompany(companyId).then(setCompany);
    }

    function setCompanyGlobalCurrencies (companyGlobalCurrenciesFromAPI) {
      $scope.companyGlobalCurrencies = angular.copy(companyGlobalCurrenciesFromAPI.response);
    }

    function getCompanyGlobalCurrencies () {
      return reconciliationFactory.getCompanyGlobalCurrencies().then(setCompanyGlobalCurrencies);
    }

    function setItemTypes (itemTypesFromAPI) {
      $scope.itemTypes = angular.copy(itemTypesFromAPI);
    }

    function getItemTypes () {
      return reconciliationFactory.getItemTypesList().then(setItemTypes);
    }

    function setStockTotals (stockTotalsFromAPI) {
      $scope.stockTotals = angular.copy(stockTotalsFromAPI.response);
    }

    function getStockTotals () {
      return reconciliationFactory.getStockTotals($routeParams.storeInstanceId).then(setStockTotals);
    }

    function setPromotionTotals (promotionTotalsFromAPI) {
      $scope.promotionTotals = $filter('filter')(angular.copy(promotionTotalsFromAPI.response), {
        exchangeRateTypeId: 1
      });
    }

    function getPromotionTotals () {
      return reconciliationFactory.getPromotionTotals($routeParams.storeInstanceId).then(setPromotionTotals);
    }

    function showLoadingModal(text) {
      $scope.displayError = false;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function handleResponseError(responseFromAPI) {
      hideLoadingModal();
      $scope.errorResponse = angular.copy(responseFromAPI);
      $scope.displayError = true;
    }

    function setupCompanyBaseCurrency () {
      $scope.companyBaseCurrency = getCurrencyByBaseCurrencyId($scope.companyGlobalCurrencies, $scope.company.baseCurrencyId);
    }

    function getTotalsFor(stockTotals, itemTypeName) {
      var stockItem = $filter('filter')(stockTotals, {
        itemTypeName: itemTypeName
      });
      var totalLMP = 0;
      var totalEPOS = 0;
      angular.forEach(stockItem, function (item) {
        totalLMP += item.lmpTotal || 0;
        totalEPOS += item.eposTotal || 0;
      });

      return {
        parsedLMP: totalLMP,
        parsedEPOS: totalEPOS,
        totalLMP: formatAsCurrency(totalLMP),
        totalEPOS: formatAsCurrency(totalEPOS)
      };
    }

    function getTotalsForPromotions(promotionTotals) {
      var total = 0;
      angular.forEach(promotionTotals, function (promotionItem) {
        total += promotionItem.convertedAmount;
      });

      return {
        parsedLMP: total,
        parsedEPOS: total,
        totalLMP: formatAsCurrency(total),
        totalEPOS: formatAsCurrency(total)
      };
    }

    function setupNetTotals () {
      angular.forEach($scope.stockTotals, function (stockItem) {
        stockItem.itemTypeName = lodash.findWhere($scope.itemTypes, {
          id: stockItem.itemTypeId
        }).name;
      });

      var totalItems = getTotalsFor($scope.stockTotals, 'Regular');
      var totalVirtual = getTotalsFor($scope.stockTotals, 'Virtual');
      var totalVoucher = getTotalsFor($scope.stockTotals, 'Voucher');
      var totalPromotion = getTotalsForPromotions($scope.promotionTotals);

      var stockTotals = {
        totalRetail: totalItems,
        totalVirtual: totalVirtual,
        totalVoucher: totalVoucher,
        totalPromotion: totalPromotion
      };

      var netLMP = stockTotals.totalRetail.parsedLMP + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher
          .parsedEPOS - stockTotals.totalPromotion.parsedLMP;
      var netEPOS = stockTotals.totalRetail.parsedEPOS + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher
          .parsedEPOS - stockTotals.totalPromotion.parsedEPOS;

      var netTotals = {
        netLMP: formatAsCurrency(netLMP),
        netEPOS: formatAsCurrency(netEPOS)
      };

      //var stockItems = $this.stockTotals.concat($this.promotionTotals);
      $scope.stockTotals = angular.extend(stockTotals, {
        totalNet: netTotals
      });
    }

    function handleInitDataSuccess() {
      setupCompanyBaseCurrency();
      setupNetTotals();

      hideLoadingModal();
    }

    function initData() {
      var promiseArray = [
        getCashBagList(),
        getStoreInstance(),
        getCompany(),
        getCompanyGlobalCurrencies(),
        getItemTypes(),
        getStockTotals(),
        getPromotionTotals()
      ];

      $q.all(promiseArray).then(handleInitDataSuccess, handleResponseError);
    }

    function initViewDefaults () {
      $scope.moveCashBagAction = 'none';
      $scope.showDeletedCashBags = false;
      $scope.sectorsToMove = [];
      $scope.cashBagFilter = {};
      $scope.scheduleSearch = {};
      angular.element('#checkbox').bootstrapSwitch();
    }

    function init () {
      showLoadingModal('Loading Store Instance Amend Details');
      initViewDefaults();
      initData();
    }

    init();

  });
