'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceAmendCtrl
 * @description
 * # StoreInstanceAmendCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceAmendCtrl', function ($q, $scope, $routeParams, $filter, storeInstanceAmendFactory, dateUtility, lodash, globalMenuService,
      reconciliationFactory, $location, postTripFactory, employeesService, cashBagFactory, transactionFactory, storeInstanceFactory) {
    var $this = this;

    function formatAsCurrency(valueToFormat) {
      if (angular.isDefined(valueToFormat)) {
        return sprintf('%.2f', valueToFormat);
      }

      return valueToFormat;
    }

    function makeFinite(valueToCheck) {
      return isFinite(valueToCheck) ? valueToCheck : 0;
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

    function moveCashBagSuccess () {
      getCashBags();
      $scope.closeMoveCashBagModal();
    }

    function moveCashBagError () {
      $scope.closeMoveCashBagModal();
      handleResponseError();
    }

    $scope.reallocateCashBag = function () {
      var cashBagId = $scope.cashBagToMove.id;
      var storeInstanceId = $scope.targetRecordForMoveCashBag.id;

      cashBagFactory.reallocateCashBag(cashBagId, storeInstanceId).then(moveCashBagSuccess, moveCashBagError);
    };

    $scope.mergeCashBag = function () {
      var eposCashBagId = $scope.cashBagToMove.id;
      var manualCashBagId = $scope.targetRecordForMoveCashBag.id;

      cashBagFactory.mergeCashBag(eposCashBagId, manualCashBagId).then(moveCashBagSuccess, moveCashBagError);
    };

    $scope.canMerge = function (cashBag) {
      return cashBag && !(cashBag.isManual || cashBag.bankRefNumber);
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

    $scope.getStatusNameById = function (statusId) {
      switch (statusId) {
        case 8:
          return 'Inbounded';
        case 9:
          return 'Discrepancies';
        default:
          return 'Unknown';
      }
    };

    function normalizeMergeSearchResults (dataFromAPI) {
      var cashBags = angular.copy(dataFromAPI.cashBags) || [];

      return angular.forEach(cashBags, function (cashBag) {
        cashBag.scheduleDate = dateUtility.formatDateForApp(cashBag.scheduleDate);
        cashBag.updatedOn = dateUtility.formatTimestampForApp(cashBag.updatedOn);
      });
    }

    function isStoreInstanceEligibleForReallocation(storeInstance) {
      return (storeInstance.statusId === 8 || storeInstance.statusId === 9) && storeInstance.id !== parseInt($routeParams.storeInstanceId);
    }

    function normalizeReallocateSearchResults (dataFromAPI) {
      var storeInstances = angular.copy(dataFromAPI.response) || [];

      return storeInstances.filter(function (storeInstance) {
        return isStoreInstanceEligibleForReallocation(storeInstance);
      });
    }

    this.searchForMoveCashBagSuccess = function (dataFromAPI) {
      if ($scope.moveCashBagAction === 'merge') {
        $scope.moveCashBagSearchResults = normalizeMergeSearchResults(dataFromAPI);
      }

      if ($scope.moveCashBagAction === 'reallocate') {
        $scope.moveCashBagSearchResults = normalizeReallocateSearchResults(dataFromAPI);
      }

      if ($scope.moveCashBagSearchResults.length === 1) {
        $scope.targetRecordForMoveCashBag = $scope.moveCashBagSearchResults[0];
      }
    };

    function searchForMergeCashBag () {
      if (!($scope.moveSearch.cashBag && $scope.moveSearch.bankRefNumber)) {
        return;
      }

      var payload = {
        companyId: globalMenuService.company.get(),
        cashBagNumber: $scope.moveSearch.cashBag,
        bankReferenceNumber: $scope.moveSearch.bankRefNumber,
        originationSource: 2,
        isReconciliation: true
      };

      return storeInstanceAmendFactory.getCashBags(payload).then($this.searchForMoveCashBagSuccess);
    }

    function searchForReallocateCashBag () {
      if (!($scope.moveSearch.storeNumber && $scope.moveSearch.scheduleDate)) {
        return;
      }

      var payload = {
        storeNumber: $scope.moveSearch.storeNumber,
        startDate: dateUtility.formatDateForAPI($scope.moveSearch.scheduleDate),
        endDate: dateUtility.formatDateForAPI($scope.moveSearch.scheduleDate)
      };

      return storeInstanceFactory.getStoreInstancesList(payload).then($this.searchForMoveCashBagSuccess);
    }

    $scope.searchForMoveCashBag = function () {
      if ($scope.moveCashBagAction === 'merge') {
        return searchForMergeCashBag();
      }

      if ($scope.moveCashBagAction === 'reallocate') {
        return searchForReallocateCashBag();
      }
    };

    $scope.getClassForTableAccordion = function (visibilityFlag) {
      return (visibilityFlag) ? 'fa fa-minus-square' : 'fa fa-plus-square-o';
    };

    $scope.getClassForAccordionArrows = function (accordionFlag) {
      return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
    };

    $scope.doesSectorHaveCrewData = function (flightSector) {
      return flightSector.crewData && flightSector.crewData.length > 0;
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
        if (sector.crewData && sector.crewData.length) {
          sector.rowOpen = shouldExpand;
        }
      });
    };

    $scope.goToReconciliation = function () {
      $location.path('/reconciliation-discrepancy-detail/' + $routeParams.storeInstanceId);
    };

    $scope.goToCashBagEdit = function (cashBag) {
      $location.path('/cash-bag/edit/' + cashBag.id);
    };

    $scope.showPaymentReportPanel = function () {
      angular.element('#paymentReportModal').modal('show');
    };

    $scope.showStoreInstancePaymentReport = function () {
      getStoreInstancePaymentReport().then($scope.showPaymentReportPanel);
    };

    $scope.showCashBagPaymentReport = function (cashBag) {
      getCashBagPaymentReport(cashBag.cashBag).then($scope.showPaymentReportPanel);
    };

    $scope.showDeleteCashBagModal = function (cashBag) {
      angular.element('.delete-cashbag-warning-modal').modal('show');

      $scope.cashBagToDelete = cashBag;
    };

    $scope.canCashBagBeDeleted = function (cashBag) {
      return cashBag.canBeDeleted;
    };

    function markCashBagAsDeleted() {
      $scope.cashBagToDelete.isDeleted = true;
    }

    $scope.deleteCashBag = function () {
      angular.element('.delete-cashbag-warning-modal').modal('hide');

      storeInstanceAmendFactory.deleteCashBag($scope.cashBagToDelete.id).then(markCashBagAsDeleted, handleResponseError);
    };

    $scope.getOrNA = function (value) {
      if (value === null || value === undefined)
      {
        return 'N/A';
      }

      return value;
    };

    function getCurrencyByBaseCurrencyId(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
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

      var netLMP = stockTotals.totalRetail.parsedLMP + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher.parsedEPOS - stockTotals.totalPromotion.parsedLMP;
      var netEPOS = stockTotals.totalRetail.parsedEPOS + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher.parsedEPOS - stockTotals.totalPromotion.parsedEPOS;

      var netTotals = {
        netLMP: formatAsCurrency(netLMP),
        netEPOS: formatAsCurrency(netEPOS)
      };

      $scope.stockTotals = angular.extend(stockTotals, {
        totalNet: netTotals
      });
    }

    function isCompanyUsingCash () {
      var cashPreference = lodash.where($scope.companyPreferences, { choiceName: 'Active', optionCode: 'CSL', optionName: 'Cashless' })[0];
      if (cashPreference && cashPreference.hasOwnProperty('startDate')) {
        var yesterdayOrEarlier = dateUtility.isTodayOrEarlier(dateUtility.formatDateForApp(cashPreference.startDate, 'YYYY-MM-DD'));

        return !(cashPreference.isSelected === true && yesterdayOrEarlier);
      }

      return true;
    }

    function setupCashPreference () {
      $scope.companyIsUsingCash = isCompanyUsingCash();
    }

    function calculateEPOSRevenue(eposRevenue) {
      $this.eposCashBag = angular.copy(eposRevenue[0].response);
      var eposCreditCard = angular.copy(eposRevenue[1].response);
      var eposDiscount = angular.copy(eposRevenue[2].response);
      var total = 0;

      angular.forEach($this.eposCashBag, function (cashBag) {
        total += cashBag.bankAmount + cashBag.coinAmountManual + cashBag.paperAmountManual;
      });

      angular.forEach(eposCreditCard, function (creditCard) {
        total += creditCard.bankAmountFinal;
      });

      angular.forEach(eposDiscount, function (discount) {
        total += discount.bankAmountFinal;
      });

      return total;
    }

    function calculateCashRevenue(chRevenue) {
      $this.chCashBag = angular.copy(chRevenue[0].response);
      var chCreditCard = angular.copy(chRevenue[1].response);
      var chDiscount = angular.copy(chRevenue[2].response);
      var total = 0;

      angular.forEach($this.chCashBag, function (cashBag) {
        total += (cashBag.paperAmountManualCh + cashBag.coinAmountManualCh) + (cashBag.paperAmountManualCHBank +
          cashBag.coinAmountManualCHBank) + (cashBag.bankAmountCh);
      });

      angular.forEach(chCreditCard, function (creditCard) {
        total += creditCard.bankAmountFinal + creditCard.coinAmountManualCc + creditCard.paperAmountManualCc;
      });

      angular.forEach(chDiscount, function (discount) {
        total += discount.bankAmountFinal + discount.coinAmountCc + discount.paperAmountCc;
      });

      return total;
    }

    function setupTotalRevenue () {
      $scope.totalRevenue = {
        cashHandler: $scope.companyIsUsingCash ? formatAsCurrency(calculateCashRevenue($scope.cashRevenue)) : 0,
        epos: formatAsCurrency(calculateEPOSRevenue($scope.eposRevenue))
      };
    }

    function setupDiscrepancy() {
      var netValue = parseFloat($scope.stockTotals.totalNet.netEPOS) - parseFloat($scope.stockTotals.totalNet.netLMP);
      var netPercentage = makeFinite(netValue / parseFloat($scope.stockTotals.totalNet.netEPOS));

      var revenueValue = 0;
      var revenuePercentage = 0;
      var exchangeValue = 0;
      var exchangePercentage = 0;

      if ($scope.companyIsUsingCash) {
        revenueValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.stockTotals.totalNet.netEPOS);
        revenuePercentage = makeFinite(revenueValue / parseFloat($scope.stockTotals.totalNet.netEPOS));
        exchangeValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.totalRevenue.epos);
        exchangePercentage = makeFinite(exchangeValue / parseFloat($scope.stockTotals.totalNet.netEPOS));
      }

      var totalValue = netValue + revenueValue + exchangeValue;
      var totalPercentage = netPercentage + revenuePercentage + exchangePercentage;

      $scope.discrepancy = {
        net: {
          value: formatAsCurrency(netValue),
          percentage: formatAsCurrency(netPercentage)
        },
        revenue: {
          value: formatAsCurrency(revenueValue),
          percentage: formatAsCurrency(revenuePercentage)
        },
        exchange: {
          value: formatAsCurrency(exchangeValue),
          percentage: formatAsCurrency(exchangePercentage)
        },
        total: {
          value: formatAsCurrency(totalValue),
          percentage: formatAsCurrency(totalPercentage)
        }
      };
    }

    function setupCashBags () {
      $scope.normalizedCashBags = $scope.cashBags.map(function (cashBag) {
        return {
          id: cashBag.id,
          cashBag: cashBag.cashBagNumber,
          bankRefNumber: cashBag.bankReferenceNumber,
          isDeleted: cashBag.isDelete === 'true',
          isManual: cashBag.originationSource === 2,
          scheduleNumber: cashBag.scheduleNumber,
          scheduleDate: dateUtility.formatDateForApp(cashBag.scheduleDate),
          isSubmitted: cashBag.isSubmitted,
          flightSectors: []
        };
      });
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

    function setCompanyPreferences(companyPreferencesFromAPI) {
      $scope.companyPreferences = lodash.sortByOrder(angular.copy(companyPreferencesFromAPI.preferences), 'startDate', 'desc');
    }

    function getCompanyPreferences () {
      return reconciliationFactory.getCompanyPreferences().then(setCompanyPreferences);
    }

    function setCashRevenue (cashRevenueFromAPI) {
      $scope.cashRevenue = angular.copy(cashRevenueFromAPI);
    }

    function getCashRevenue () {
      return reconciliationFactory.getCHRevenue($routeParams.storeInstanceId).then(setCashRevenue);
    }

    function setEPOSRevenue (EPOSRevenueFromAPI) {
      $scope.eposRevenue = angular.copy(EPOSRevenueFromAPI);
    }

    function getEPOSRevenue () {
      return reconciliationFactory.getEPOSRevenue($routeParams.storeInstanceId).then(setEPOSRevenue);
    }

    function setPaymentReport (paymentReportFromAPI) {
      var paymentReport = angular.copy(paymentReportFromAPI.paymentReports);
      angular.forEach(paymentReport, function (report) {
        report.scheduleDate = dateUtility.formatDateForApp(report.scheduleDate, 'YYYY-MM-DDThh:mm');
      });

      $scope.paymentReport = paymentReport;
    }

    function getStoreInstancePaymentReport () {
      return reconciliationFactory.getPaymentReport($routeParams.storeInstanceId).then(setPaymentReport);
    }

    function getCashBagPaymentReport (cashBagNumber) {
      return reconciliationFactory.getPaymentReport($routeParams.storeInstanceId, cashBagNumber).then(setPaymentReport);
    }

    function setEmployees (employeesFromAPI) {
      $scope.employees = angular.copy(employeesFromAPI.companyEmployees);
    }

    function getEmployees () {
      var companyId = globalMenuService.company.get();
      return employeesService.getEmployees(companyId).then(setEmployees);
    }

    function setCashBags (cashBagsFromAPI) {
      $scope.cashBags = angular.copy(cashBagsFromAPI.cashBags);
      setupCashBags();
    }

    function setTransactionsForFlightSector (normalizedFlightSector, transactionsFromAPI) {
      var transactions = angular.copy(transactionsFromAPI.transactions);

      var totalAmount = 0;
      angular.forEach(transactions, function (transaction) {
        totalAmount = totalAmount + (parseFloat(transaction.totalAmount));
      });

      normalizedFlightSector.transactionCount = transactions.length;
      normalizedFlightSector.transactionTotal = formatAsCurrency(totalAmount);
    }

    function getEmployeeDetailsById(employeeId) {
      return lodash.find($scope.employees, 'id', employeeId);
    }

    function extractCrewData(postTripEmployees) {
      return postTripEmployees.map(function (postTripEmployee) {
        var employeeDetails = getEmployeeDetailsById(postTripEmployee.employeeId);
        return {
          crewId: employeeDetails.id,
          firstName: employeeDetails.firstName,
          lastName: employeeDetails.lastName
        };
      });
    }

    function setPostTrip(normalizedFlightSector, postTripFromAPI) {
      var postTrip = angular.copy(postTripFromAPI);

      normalizedFlightSector.scheduleDate = postTrip.scheduleDate;
      normalizedFlightSector.scheduleNumber = postTrip.scheduleNumber;
      normalizedFlightSector.tailNumber = postTrip.tailNumber;
      normalizedFlightSector.crewData = extractCrewData(postTrip.postTripEmployeeIdentifiers);
    }

    function setFlightSectors(normalizedCashBag, flightSectorsFromAPI) {
      var flightSectors = angular.copy(flightSectorsFromAPI.response);

      angular.forEach(flightSectors, function (flightSector) {
        var companyCarrierInstance = flightSector.companyCarrierInstance;

        var normalizedFlightSector = {
          companyCarrierInstanceId: companyCarrierInstance.id,
          arrivalStation: companyCarrierInstance.arrivalStation,
          departureStation: companyCarrierInstance.departureStation,
          passengerCount: companyCarrierInstance.paxCount
        };

        normalizedCashBag.flightSectors.push(normalizedFlightSector);

        if (companyCarrierInstance.posttripId) {
          var companyId = globalMenuService.company.get();
          postTripFactory.getPostTrip(companyId, companyCarrierInstance.posttripId).then(function (postTripFromAPI) {
            setPostTrip(normalizedFlightSector, postTripFromAPI);
          });
        }

        transactionFactory.getTransactionList({ companyCarrierInstanceId: companyCarrierInstance.id }).then(function (transactionsFromAPI) {
          setTransactionsForFlightSector(normalizedFlightSector, transactionsFromAPI);
        });
      });
    }

    function getFlightSectors(normalizedCashBag) {
      return storeInstanceAmendFactory.getFlightSectors(normalizedCashBag.id).then(function (flightSectorsFromAPI) {
          setFlightSectors(normalizedCashBag, flightSectorsFromAPI);
        });
    }

    function isCashBagDeleteAllowed(cashBag) {
      return !(cashBag.bankReferenceNumber || cashBag.isSubmitted === true || (cashBag.cashBagCurrencies && cashBag.cashBagCurrencies.length > 0));
    }

    function setCashBagDeletionFlag(normalizedCashBag, cashBagFromAPI) {
      var cashBag = angular.copy(cashBagFromAPI);
      normalizedCashBag.canBeDeleted = isCashBagDeleteAllowed(cashBag);
    }

    function getCashBagDeletionFlag(normalizedCashBag) {
      return cashBagFactory.getCashBag(normalizedCashBag.id).then(function (cashBagFromAPI) {
        setCashBagDeletionFlag(normalizedCashBag, cashBagFromAPI);
      });
    }

    function getCashBagDetails () {
      var promiseArray = [];

      angular.forEach($scope.normalizedCashBags, function (normalizedCashBag) {
        promiseArray.push(getCashBagDeletionFlag(normalizedCashBag));
        promiseArray.push(getFlightSectors(normalizedCashBag));
      });

      $q.all(promiseArray).then();
    }

    function getCashBags () {
      var companyId = globalMenuService.company.get();
      var payload = {
        companyId: companyId,
        isReconciliation: true,
        storeInstanceId: $routeParams.storeInstanceId
      };

      return storeInstanceAmendFactory.getCashBags(payload)
                                      .then(setCashBags)
                                      .then(getCashBagDetails);
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

    function handleInitDataSuccess() {
      setupCompanyBaseCurrency();
      setupNetTotals();
      setupCashPreference();
      setupTotalRevenue();
      setupDiscrepancy();

      hideLoadingModal();
    }

    function initData() {
      var promiseArray = [
        getStoreInstance(),
        getCompany(),
        getCompanyGlobalCurrencies(),
        getItemTypes(),
        getStockTotals(),
        getPromotionTotals(),
        getCompanyPreferences(),
        getCashRevenue(),
        getEPOSRevenue(),
        getEmployees(),
        getCashBags()
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
