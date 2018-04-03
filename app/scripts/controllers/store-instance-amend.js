'use strict';
/*jshint maxcomplexity:6 */
/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceAmendCtrl
 * @description
 * # StoreInstanceAmendCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceAmendCtrl', function ($q, $scope, $routeParams, $filter, storeInstanceAmendFactory, dateUtility, lodash, globalMenuService,
      reconciliationFactory, $location, postTripFactory, cashBagFactory, transactionFactory, storeInstanceFactory, recordsService,
      stationsService, dailyExchangeRatesService, $localStorage) {
    var $this = this;

    $scope.commitionPaidStatus = function () {
      var commitionPaidStatus = getStoreStatusByStatusStep('11');
      if (!$scope.storeInstance) {
        return false;
      }

      var statusId = $scope.storeInstance.statusId;

      return statusId === commitionPaidStatus.id ? true :  false;
    };

    $scope.confirmedStatus = function () {
      var confirmedStatus = getStoreStatusByStatusStep('10');
      if (!$scope.storeInstance) {
        return false;
      }

      var statusId = $scope.storeInstance.statusId;

      return statusId === confirmedStatus.id ? true :  false;
    };

    $scope.refreshManualCashBag = function (cashBag) {
      showLoadingModal('Refreshing Cash Bag');
      storeInstanceAmendFactory.addFlightSector(cashBag.id, 0).then(addOrEditScheduleSuccess, handleResponseError);
    };

    $scope.formatAsCurrency = function(valueToFormat) {
      if (angular.isDefined(valueToFormat)) {
        return sprintf('%.2f', valueToFormat);
      }

      return valueToFormat;
    };

    function makeFinite(valueToCheck) {
      return isFinite(valueToCheck) ? valueToCheck : 0;
    }

    function deleteScheduleSuccess () {
      getCashBags();
      hideLoadingModal();
    }

    $scope.deleteSchedule = function () {
      angular.element('.delete-schedule-warning-modal').modal('hide');

      showLoadingModal('Deleting Schedule');
      storeInstanceAmendFactory.deleteFlightSector(
        $scope.scheduleToDelete.cashbagId,
        $scope.scheduleToDelete.id,
        !$scope.scheduleToDelete.isPosttrip
      )
      .then(deleteScheduleSuccess, handleResponseError);
    };

    $scope.showDeleteScheduleModal = function (scheduleToDelete, cashBagId) {
      angular.element('.delete-schedule-warning-modal').modal('show');

      $scope.scheduleToDelete = scheduleToDelete;
      $scope.scheduleToDelete.cashbagId = cashBagId;
    };

    function addOrEditScheduleSuccess () {
      $scope.clearScheduleSelections();
      getCashBags();
      hideLoadingModal();
    }

    $scope.addOrEditSchedule = function () {
      showLoadingModal('Updating Schedule');
      if (!$scope.cashBagToEdit) {
        return;
      }

      var postTripId;
      var cashBagId = $scope.cashBagToEdit.id;
      if ($scope.scheduleToEdit) {
        postTripId = $scope.scheduleToEdit.id;
        var newPosttripId = $scope.newScheduleSelection.id;
        storeInstanceAmendFactory.editFlightSector(cashBagId, postTripId, newPosttripId, !$scope.scheduleToEdit.isPosttrip).then(addOrEditScheduleSuccess, handleResponseError);
      } else {
        postTripId = $scope.newScheduleSelection.id;

        storeInstanceAmendFactory.addFlightSector(cashBagId, postTripId).then(addOrEditScheduleSuccess, handleResponseError);
      }
    };

    $scope.showAddOrEditScheduleModal = function (cashBagToEdit, scheduleToEdit) {
      $scope.cashBagToEdit = cashBagToEdit;
      if (scheduleToEdit) {
        $scope.scheduleToEdit = scheduleToEdit;
      }

      angular.element('#addScheduleModal').modal('show');
    };

    function rearrangeSectorSuccess () {
      hideLoadingModal();
      getCashBags();
      $scope.closeRearrangeSectorModal();
    }

    $scope.isAmended = function (cashBag) {
      if (angular.isDefined(cashBag) && cashBag !== null && cashBag.isAmended) {
        return true;
      }

      return false;
    };

    $scope.rearrangeSector = function () {
      var originCashBag = $scope.rearrangeOriginCashBag;
      var targetCashBag = $scope.rearrangeTargetCashBag;
      var sectorsToMove = $scope.sectorsToMove;
      var promises = [];

      if (sectorsToMove.length > 0) {
        var objectMatch = lodash.findWhere($scope.rearrangeTargetCashBag.flightSectors, { id: sectorsToMove[0].id });
        if (angular.isDefined(objectMatch) && objectMatch !== null) {
          angular.element('.rearrange-sectors-modal').modal('show');
        } else {
          showLoadingModal('Rearrange Sector');
          angular.forEach(sectorsToMove, function (sector) {
            promises.push(storeInstanceAmendFactory.rearrangeFlightSector(originCashBag.id, targetCashBag.id, sector.id));
          });

          $q.all(promises).then(rearrangeSectorSuccess, handleResponseError);
        }
      }
    };

    $scope.continueRearrange = function () {
      showLoadingModal('Rearrange Sector');
      angular.element('.rearrange-sectors-modal').modal('hide');
      var originCashBag = $scope.rearrangeOriginCashBag;
      var targetCashBag = $scope.rearrangeTargetCashBag;
      var sectorsToMove = $scope.sectorsToMove;
      var promises = [];
      
      angular.forEach(sectorsToMove, function (sector) {
        promises.push(storeInstanceAmendFactory.rearrangeFlightSector(originCashBag.id, targetCashBag.id, sector.id));
      });

      $q.all(promises).then(rearrangeSectorSuccess, handleResponseError);
    };

    $scope.cancelRearrange = function () {
      angular.element('.rearrange-sectors-modal').modal('hide');
      $scope.closeRearrangeSectorModal();
    };
    
    $scope.showRearrangeSectorModal = function () {
      angular.element('#rearrangeSectorModal').modal('show');
    };

    $scope.showMoveCashBagModal = function (cashBag) {
      $scope.cashBagToMove = cashBag;
      angular.element('#moveCashBagModal').modal('show');
    };

    function resetAllModals () {
      $scope.clearScheduleSelections();
      $scope.clearRearrangeSelections();
      $scope.clearMoveSearchResults();
      $scope.closeRearrangeSectorModal();
      $scope.closeMoveCashBagModal();
    }

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

      if ($scope.moveCashBagAction === 'merge') {
        searchForMergeCashBag();
      } else {
        $scope.moveCashBagSearchResults = null;
      }
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
      return ($scope.sectorsToMove.length > 0 && !!$scope.rearrangeOriginCashBag && !!$scope.rearrangeTargetCashBag && $scope.rearrangeOriginCashBag.id !== $scope.rearrangeTargetCashBag.id);
    };

    $scope.toggleSelectSectorToRearrange = function (sector, cashBag) {
      if (angular.isDefined(cashBag) && cashBag !== null && cashBag.isAmended) {
        return;
      }

      if (!!$scope.rearrangeOriginCashBag && !!$scope.rearrangeTargetCashBag && $scope.rearrangeOriginCashBag.id === $scope.rearrangeTargetCashBag.id) {
        return;
      }

      /*  one or more schedule(s) can be selected to move
      var matchIndex = lodash.findIndex($scope.sectorsToMove, sector);
      if (matchIndex < 0) {
        $scope.sectorsToMove.push(sector);
      } else {
        $scope.sectorsToMove.splice(matchIndex, 1);
      }
      */
      
      // only one schedule can be selected to move
      var matchIndex = lodash.findIndex($scope.sectorsToMove, sector);
      if (matchIndex < 0) {
        $scope.sectorsToMove = [];
        $scope.sectorsToMove.push(sector);
        $scope.singleSectorsToMove = sector;
      } else {
        $scope.sectorsToMove = [];
        $scope.singleSectorsToMove = null;
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
      initData();
      $scope.closeMoveCashBagModal();
    }

    function handleReallocationErrors(errorsFromAPI) {
      var errors = angular.copy(errorsFromAPI.data);
      $scope.errorCustom = $scope.errorCustom || [];

      var isDuplicateCashBagNumber = errors.filter(function (error) {
        return error.field === 'cashBagNumber' && error.code === '004';
      }).length > 0;

      if (isDuplicateCashBagNumber) {
        $scope.errorCustom.push({ field: 'Cash Bag number', value: 'Can not reallocate to a Store Instance that contains the same Cash Bag Number.' });
      } else {
        handleResponseError(errorsFromAPI);
      }

      $scope.displayError = true;
    }

    function moveCashBagError (errorsFromAPI) {
      if ($scope.moveCashBagAction === 'reallocate') {
        handleReallocationErrors(errorsFromAPI);
      } else {
        handleResponseError(errorsFromAPI);
      }

      $scope.closeMoveCashBagModal();
    }

    $scope.showOverwriteCashBag = function () {
      angular.element('.overwrite-cashbag-warning-modal').modal('show');
    }; 

    $scope.overwriteCashBag = function () {
      angular.element('.overwrite-cashbag-warning-modal').modal('hide');
      var destinationId = $scope.cashBagToMove.id;
      var sourceId = $scope.targetRecordForMoveCashBag.id;
      cashBagFactory.overwriteCashBag(sourceId, destinationId).then(moveCashBagSuccess, moveCashBagError);
      resetAllModals();
    };

    $scope.showReallocateCashBag = function () {
      angular.element('.reallocate-cashbag-warning-modal').modal('show');
    };

    $scope.reallocateCashBag = function () {
      angular.element('.reallocate-cashbag-warning-modal').modal('hide');
      var cashBagId = $scope.cashBagToMove.id;
      var storeInstanceId = $scope.targetRecordForMoveCashBag.id;
      cashBagFactory.reallocateCashBag(cashBagId, storeInstanceId).then(moveCashBagSuccess, moveCashBagError);
      resetAllModals();
    };

    $scope.showMergeCashBag = function () {
      angular.element('.merge-cashbag-warning-modal').modal('show');
    };

    $scope.mergeCashBag = function () {
      angular.element('.merge-cashbag-warning-modal').modal('hide');
      var sourceCashBagId = $scope.cashBagToMove.id;
      var destCashBagId = $scope.targetRecordForMoveCashBag.id;
      cashBagFactory.mergeCashBag(sourceCashBagId, destCashBagId).then(moveCashBagSuccess, moveCashBagError);
      resetAllModals();
    };

    $scope.canMerge = function (cashBag) {
      if (angular.isDefined(cashBag) && cashBag !== null && angular.isDefined(cashBag.flightSectors)) {
        var isSchedule = false;
        if (cashBag.flightSectors !== null) {
          cashBag.flightSectors.forEach(function (sector) {
            if (!sector.isPosttrip) {
              isSchedule = true;
            }
          });
        }  

        if (isSchedule) {
          return false;
        }
      }

      return (cashBag && !cashBag.isManual && !cashBag.isVerified);
    };

    $scope.canOverwrite = function (cashBag) {
      if (angular.isDefined(cashBag) && cashBag !== null && angular.isDefined(cashBag.flightSectors)) {
        var isSchedule = false;
        if (cashBag.flightSectors !== null) {
          cashBag.flightSectors.forEach(function (sector) {
            if (!sector.isPosttrip) {
              isSchedule = true;
            }
          });
        }  

        if (isSchedule) {
          return false;
        }
      }

      var hasBankRef = false;
      if (angular.isDefined(cashBag) && cashBag !== null && angular.isDefined(cashBag.bankRefNumber) && cashBag.bankRefNumber !== null && cashBag.bankRefNumber !== '') {
        hasBankRef = true;
      }

      return (cashBag && !cashBag.isManual && !cashBag.isVerified && !hasBankRef);
    };

    $scope.canReallocate = function (cashBag) {
      if (angular.isDefined(cashBag) && cashBag !== null && angular.isDefined(cashBag.flightSectors)) {
        var isSchedule = false;
        if (cashBag.flightSectors !== null) {
          cashBag.flightSectors.forEach(function (sector) {
            if (!sector.isPosttrip) {
              isSchedule = true;
            }
          });
        }  

        if (isSchedule) {
          return false;
        }
      }

      return (cashBag && !cashBag.isManual && !cashBag.isVerified);
    };

    $scope.canEdit = function (cashBag) {
      if (!angular.isDefined(cashBag) && cashBag === null) {
        return false;
      }

      return (cashBag && !cashBag.isVerified && cashBag.isSubmitted);
    };

    $scope.canExecuteAmendCashBag = function (cashBag) {
      var canExAction =  $scope.canExecuteActions(cashBag);
      var canEdit = $scope.canEdit(cashBag);
      var canMerge = $scope.canMerge(cashBag);

      if (canExAction && (canEdit || canMerge)) {
        return true;
      }

      return false;
    };

    function getModalItemsToShow(modalName) {
      return (modalName === 'Promotion') ? $this.promotionTotals : $this.cashBagEposSales;
    }

    function getEposModalManualTotal (modalName, cashBagId) {
      return (modalName !== 'Regular') ? getManualDataTotals(modalName.toLowerCase(), cashBagId) : 0;
    }

    $scope.showEposModal = function (modalName, cashBag) {
      var modalNameToHeaderMap = {
        Regular: 'Regular Product Revenue',
        Virtual: 'Virtual Product Revenue',
        Voucher: 'Voucher Product Revenue',
        Promotion: 'ePOS Discount'
      };
      var modalNamToTableHeaderMap = {
        Regular: 'Regular Product Name',
        Virtual: 'Virtual Product Name',
        Voucher: 'Voucher Product Name',
        Promotion: 'Promotion Name'
      };

      var amountKey = (modalName === 'Regular') ? 'Retail' : modalName;

      if (!$scope.stockTotals || !$scope.stockTotals['total' + amountKey]) {
        return;
      }

      $scope.modalTotal = $scope.stockTotals['total' + amountKey].totalEPOS;
      $scope.modalItemTypeName = modalName;
      if (modalNameToHeaderMap[modalName] && modalNamToTableHeaderMap[modalName]) {
        $scope.modalMainTitle = modalNameToHeaderMap[modalName];
        $scope.modalTableHeader = modalNamToTableHeaderMap[modalName];
      }

      var itemsToShow = getModalItemsToShow(modalName);

      $scope.modalItems = $filter('filter')(itemsToShow, {
        itemTypeName: modalName,
        cashbagId: cashBag.id
      });

      $scope.eposModalManualTotal = getEposModalManualTotal(modalName, cashBag.id);
      angular.element('#t6Modal').modal('show');
    };

    $scope.showCashRevenueModal = function (cashBag) {
      $scope.cashRevenueModal = cashBag.cashRevenue;
      angular.element('#cashRevenueModal').modal('show');
    };

    $scope.showCreditRevenueModal = function (cashBag) {
      $scope.creditRevenueModal = cashBag.creditRevenue;

      angular.element('#creditRevenueModal').modal('show');
    };

    $scope.showDiscountRevenueModal = function (cashBag) {
      $scope.discountRevenueModal = cashBag.discountRevenue;

      angular.element('#discountRevenueModal').modal('show');
    };

    function getStationById (stationId) {
      return lodash.find($scope.stations, 'stationId', stationId);
    }

    function getCashBagById (cashBagId) {
      return lodash.find($scope.normalizedCashBags, 'id', cashBagId);
    }

    this.searchForScheduleSuccess = function (dataFromAPI) {
      $scope.searchScheduleResults = angular.copy(dataFromAPI.postTrips);

      angular.forEach($scope.searchScheduleResults, function (schedule) {
        var arrivalStation = getStationById(schedule.arrStationId);
        var departureStation = getStationById(schedule.depStationId);

        schedule.arrivalStation = arrivalStation ? arrivalStation.stationCode : 'N/A';
        schedule.departureStation = departureStation ? departureStation.stationCode : 'N/A';
      });

      if ($scope.searchScheduleResults.length === 1) {
        $scope.newScheduleSelection = $scope.searchScheduleResults[0];
      }
    };

    $scope.searchForSchedule = function () {
      if (!($scope.scheduleSearch.scheduleNumber && $scope.scheduleSearch.scheduleDate)) {
        return;
      }

      var companyId = globalMenuService.company.get();

      var payload = {
        scheduleNumber: $scope.scheduleSearch.scheduleNumber,
        scheduleDate: $scope.scheduleSearch.scheduleDate
      };

      return postTripFactory.getPostTripDataList(companyId, payload).then($this.searchForScheduleSuccess);
    };

    function getStoreStatusByStatusStep (step) {
      var storeStatus = lodash.find($scope.storeStatusList, 'name', step);

      return storeStatus;
    }

    $scope.canExecuteUnferify = function () {
      var commitionPaidStatus = getStoreStatusByStatusStep('11');
      if (!$scope.storeInstance) {
        return false;
      }

      var statusId = $scope.storeInstance.statusId;

      return statusId === commitionPaidStatus.id ? false : true;
    };

    $scope.canExecuteVerify = function (cashBag) {
      if (angular.isDefined(cashBag) && cashBag.isManual && !cashBag.isVerifiedManual) {
        return false;
      }

      return !cashBag.isVerified;
    };

    $scope.canExecuteEditActionsPsttrip = function (cashBag, flightSector) {
      if (cashBag && cashBag.isVerified) {
        return false;
      }

      if (!flightSector.isPosttrip) {
        return true;
      } else {
        var isSchedule = false;
        cashBag.flightSectors.forEach(function (sector) {
          if (!sector.isPosttrip) {
            isSchedule = true;
          }
        });

        if (isSchedule) {
          return false;
        }
      }

      return $scope.canExecuteActions(cashBag);
    };

    $scope.canExecuteDeleteActionsPsttrip = function (cashBag, flightSector) {
      if (cashBag && cashBag.isVerified) {
        return false;
      }

      if (!flightSector.isPosttrip) {
        return false;
      } else {
        var isSchedule = false;
        cashBag.flightSectors.forEach(function (sector) {
          if (!sector.isPosttrip) {
            isSchedule = true;
          }
        });

        if (isSchedule) {
          return false;
        }
      }

      return $scope.canExecuteActions(cashBag);
    };

    $scope.canExecuteActions = function (cashBag) {

      var inboundedStatus = getStoreStatusByStatusStep('8');
      var discrepanciesStatus = getStoreStatusByStatusStep('9');
      var confirmedStatus = getStoreStatusByStatusStep('10');

      var isStoreInstanceStatusValid = $scope.storeInstance && inboundedStatus && confirmedStatus && discrepanciesStatus;
      var isCashBagVerified = cashBag && cashBag.isVerified;

      if (!isStoreInstanceStatusValid || isCashBagVerified) {
        return false;
      }

      var statusId = $scope.storeInstance.statusId;

      return statusId === inboundedStatus.id || statusId === confirmedStatus.id || statusId === discrepanciesStatus.id;
    };

    $scope.getStatusNameById = function (statusId) {
      var status = lodash.find($scope.storeStatusList, 'id', statusId);

      return status.statusName;
    };

    $scope.sumGroupedAmounts = function (amounts) {
      var total = 0;
      amounts.map(function(amount) {
        total += amount.amount;
      });

      return $scope.formatAsCurrency(total);
    };

    function normalizeMergeSearchResults (dataFromAPI) {
      var cashBags = angular.copy(dataFromAPI.response) || [];

      var filteredCashBags = lodash.filter(cashBags, {
        cashBagNumber: $scope.moveSearch.cashBag,
        bankReferenceNumber: $scope.moveSearch.bankRefNumber,
        originationSource: 2
      });

      return angular.forEach(filteredCashBags, function (cashBag) {
        cashBag.scheduleDate = dateUtility.formatDateForApp(cashBag.scheduleDate);
        cashBag.updatedOn = dateUtility.formatTimestampForApp(cashBag.updatedOn);
      });
    }

    $scope.disableSelectStoreInstance = function (storeInstance) {
      var inboundedStatus = getStoreStatusByStatusStep('8');
      var discrepanciesStatus = getStoreStatusByStatusStep('9');
      var result = (storeInstance.statusId !== inboundedStatus.id && storeInstance.statusId !== discrepanciesStatus.id);

      return result;
    };

    function normalizeReallocateSearchResults (dataFromAPI) {
      var storeInstances = angular.copy(dataFromAPI.response) || [];

      return storeInstances;
    }

    this.searchForMoveCashBagSuccess = function (dataFromAPI) {
      if ($scope.moveCashBagAction === 'merge') {
        $scope.moveCashBagSearchResults = normalizeMergeSearchResults(dataFromAPI);
      }

      if ($scope.moveCashBagAction === 'reallocate') {
        $scope.moveCashBagSearchResults = normalizeReallocateSearchResults(dataFromAPI);
      }

      if ($scope.moveCashBagAction === 'overwrite') {
        $scope.moveCashBagSearchResults = dataFromAPI.cashBags;
      }

      if ($scope.moveCashBagSearchResults.length === 1) {
        $scope.targetRecordForMoveCashBag = $scope.moveCashBagSearchResults[0];
      }
    };

    $scope.disableOverwriteSelectCashBag  = function (cashBag) {
      if (cashBag.amendVerifiedOn) {
        return true;
      }

      return false;
    };

    $scope.disableSelectCashBag  = function (cashBag) {
      if (!cashBag.isVerified && cashBag.isSubmitted) {
        return false;
      }

      return true;
    };

    function searchForMergeCashBag () {
      $scope.moveCashBagSearchResults = [];
      var keyCashBag = [];
      angular.forEach($scope.normalizedCashBags, function (inCashBag) {
        if (inCashBag.id !== $scope.cashBagToMove.id && !inCashBag.isDeleted && !inCashBag.isManual) {
          var cashBag = {
            cashBagNumber:inCashBag.cashBag,
            bankRefNumber:inCashBag.bankRefNumber,
            isVerified:inCashBag.isVerified,
            isSubmitted:inCashBag.isSubmitted,
            id:inCashBag.id,
            storeInstanceNumber:inCashBag.storeInstanceId
          };
          if (keyCashBag.indexOf(cashBag.id) === -1) {
            keyCashBag.push(cashBag.id);
            $scope.moveCashBagSearchResults.push(angular.copy(cashBag));
          }
        }
      });
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

    function searchForOverwriteCashBag () {
      if (!$scope.moveSearch.cashBag) {
        return;
      }

      var companyId = globalMenuService.company.get();
      var payloadManualCashBag = {
        cashBagNumber:$scope.moveSearch.cashBag,
        originationSource:2,
        isSubmitted: true,
        isDelete: false,
        retailCompanyId:companyId,
        chCompanyId:'',
        eposCashBagsId:0
      };

      return cashBagFactory.getCashBagList(companyId, payloadManualCashBag).then($this.searchForMoveCashBagSuccess);
    }

    $scope.searchForMoveCashBag = function () {
      $scope.moveCashBagSearchResults = null;
      $scope.targetRecordForMoveCashBag = null;
      if ($scope.moveCashBagAction === 'merge') {
        return searchForMergeCashBag();
      }

      if ($scope.moveCashBagAction === 'reallocate') {
        return searchForReallocateCashBag();
      }

      if ($scope.moveCashBagAction === 'overwrite') {
        return searchForOverwriteCashBag();
      }      
    };

    $scope.editCashBagNumberShow = function () {
      if ($scope.moveSearch.cashBag === null || !angular.isDefined($scope.moveSearch.cashBag)) {
        angular.element('.cashbag-number-empty-warning-modal').modal('show');
        return;
      }

      $scope.numberExist = false;  
      angular.forEach($scope.cashBags, function (cashBag) {
        if (!cashBag.delete && cashBag.cashBagNumber === $scope.moveSearch.cashBag) {
          $scope.numberExist = true;
        }
      });

      if (!$scope.numberExist) {
        angular.element('.edit-cashbag-number-warning-modal').modal('show');
      } else {
        angular.element('.cashbag-number-exist-warning-modal').modal('show');
      }  
    };

    $scope.editCashBagNumber = function () {
      angular.element('.edit-cashbag-number-warning-modal').modal('hide');
      var cashBagToEdit = $scope.cashBagToMove;
      var cashBagNewNumber = $scope.moveSearch;
      cashBagFactory.editCashBagNumber(cashBagToEdit.id, cashBagNewNumber.cashBag).then(moveCashBagSuccess, moveCashBagError);
      resetAllModals();
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

    $scope.hasMoreThanOneUnverifiedCashBags = function () {
      var unverifiedCashBags = 0;
      angular.forEach($scope.normalizedCashBags, function (cashBag) {
        if (!cashBag.isVerified) {
          unverifiedCashBags++;
        }
      });

      return unverifiedCashBags > 1;
    };

    $scope.hasFlightSectors = function (cashBag) {
      var result = cashBag.flightSectors && cashBag.flightSectors.length > 0;
      if (result) {
        for (var i = cashBag.flightSectors.length - 1; i >= 0; i--) {
          if (cashBag.flightSectors[i].isPosttrip === false) {
            result = false;
            break;
          }
        }
      }

      return result;
    };

    function toggleVrifiedCashBagSuccess () {
      getCashBags();
      getStoreInstance();
      hideLoadingModal();
    }

    $scope.toggleVerifiedCashBag = function (cashBag) {
      if (cashBag.isVerified) {
        showLoadingModal('Unverifying Cash Bag');
        cashBagFactory.unverifyCashBag(cashBag.id, 'AMEND').then(toggleVrifiedCashBagSuccess, handleResponseError);
      } else {
        showLoadingModal('Verifying Cash Bag');
        cashBagFactory.verifyCashBag(cashBag.id, 'AMEND').then(toggleVrifiedCashBagSuccess, handleResponseError);
      }
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

    $scope.canAddPosttripToCashBag = function (cashBag) {
      if (cashBag && cashBag.isVerified) {
        return false;
      }

      var isSchedule = false;

      cashBag.flightSectors.forEach(function (sector) {
        if (!sector.isPosttrip) {
          isSchedule = true;
        }
      });

      return isSchedule ? false : true;
    };

    $scope.canCashBagBeDeleted = function (cashBag) {
      if (cashBag && cashBag.isVerified) {
        return false;
      }

      var isTransaction = false;

      cashBag.flightSectors.forEach(function (sector) {
        if (sector.transactionCount > 0) {
          isTransaction = true;
        }
      });

      cashBag.canBeDeleted = isTransaction ? false : isCashBagDeleteAllowed(cashBag);

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

    function extractEposSalesByCashBag(item) {
      if (item.cashbagId && item.eposTotal) {
        var cashBag = getCashBagById(item.cashbagId);
        var amount = item.eposTotal;
        switch (item.itemTypeName) {
          case 'Regular':
            cashBag.regularItemSales += amount;
            break;
          case 'Virtual':
            cashBag.virtualItemSales += amount;
            break;
          case 'Voucher':
            cashBag.voucherItemSales += amount;
            break;
        }
      }
    }

    function extractEposSalesPromotionByCashBag(item) {
      if (item.cashbagId) {
        var cashBag = getCashBagById(item.cashbagId);
        if (angular.isDefined(cashBag) && angular.isDefined(cashBag.promotionDiscounts)) {
          var amount = item.convertedAmount || 0;
          cashBag.promotionDiscounts += amount;
        }
      }
    }

    function getManualDataTotals(manualDataType) {
      var arrayToSum = (manualDataType === 'regular') ? $this.manualData.cash.concat($this.manualData.credit) : $this.manualData[manualDataType];
      var total = 0;
      angular.forEach(arrayToSum, function (manualDataEntry) {
        total += (manualDataType === 'promotion') ? manualDataEntry.totalConvertedAmount : manualDataEntry.convertedAmount;
      });

      return total;
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

      if (itemTypeName !== 'Regular') {
        totalEPOS += getManualDataTotals(itemTypeName.toLowerCase());
      }

      if (itemTypeName === 'Regular') {
        totalEPOS += $scope.totalCHManualValue;
        totalEPOS += getManualDataTotals('discount');
        totalEPOS += getManualDataTotals('promotion');
      }

      return {
        parsedLMP: totalLMP,
        parsedEPOS: totalEPOS,
        totalLMP: $scope.formatAsCurrency(totalLMP),
        totalEPOS: $scope.formatAsCurrency(totalEPOS)
      };
    }

    function getTotalsForPromotions(promotionTotals) {
      var total = 0;
      angular.forEach(promotionTotals, function (promotionItem) {
        total += promotionItem.convertedAmount;

        extractEposSalesPromotionByCashBag(promotionItem);
      });

      var eposTotal = total + getManualDataTotals('promotion');

      return {
        parsedLMP: total,
        parsedEPOS: eposTotal,
        totalLMP: $scope.formatAsCurrency(total),
        totalEPOS: $scope.formatAsCurrency(eposTotal)
      };
    }

    function setupNetTotals () {
      angular.forEach($this.stockTotals, function (stockItem) {
        stockItem.itemTypeName = lodash.findWhere($scope.itemTypes, {
          id: stockItem.itemTypeId
        }).name;
      });

      var totalPromotion = getTotalsForPromotions($this.promotionTotals);
      var totalItems = getTotalsFor($this.stockTotals, 'Regular');
      var totalVirtual = getTotalsFor($this.stockTotals, 'Virtual');
      var totalVoucher = getTotalsFor($this.stockTotals, 'Voucher');

      var stockTotals = {
        totalRetail: totalItems,
        totalVirtual: totalVirtual,
        totalVoucher: totalVoucher,
        totalPromotion: totalPromotion
      };

      var netLMP = stockTotals.totalRetail.parsedLMP + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher.parsedEPOS - stockTotals.totalPromotion.parsedLMP;
      var netEPOS = stockTotals.totalRetail.parsedEPOS + stockTotals.totalVirtual.parsedEPOS + stockTotals.totalVoucher.parsedEPOS - stockTotals.totalPromotion.parsedEPOS;

      var netTotals = {
        netLMP: $scope.formatAsCurrency(netLMP),
        netEPOS: $scope.formatAsCurrency(netEPOS)
      };

      $scope.stockTotals = angular.extend(stockTotals, {
        totalNet: netTotals
      });
    }

    function isCompanyUsingCash () {
      var cashPreference = lodash.where($scope.companyPreferences, { choiceName: 'Active', optionCode: 'CSL', optionName: 'Cashless' })[0];
      if (cashPreference && cashPreference.hasOwnProperty('startDate')) {
        var yesterdayOrEarlier = dateUtility.isTodayOrEarlierDatePicker(dateUtility.formatDateForApp(cashPreference.startDate, 'YYYY-MM-DD'));

        return !(cashPreference.isSelected === true && yesterdayOrEarlier);
      }

      return true;
    }

    function setupCashPreference () {
      $scope.companyIsUsingCash = isCompanyUsingCash();
    }

    function calculateCashRevenue(chRevenue) {
      $this.chCashBag = lodash.uniq(angular.copy(chRevenue[0].response), 'id');
      var chCreditCard = lodash.uniq(angular.copy(chRevenue[1].response), 'id');
      var chDiscount = lodash.uniq(angular.copy(chRevenue[2].response), 'id');
      var total = 0;

      angular.forEach($this.chCashBag, function (cashBag) {
        var cashTotal = (makeFinite(cashBag.paperAmountManualCh) + makeFinite(cashBag.coinAmountManualCh)) + (makeFinite(cashBag.paperAmountManualCHBank) + makeFinite(cashBag.coinAmountManualCHBank)) + makeFinite(cashBag.bankAmountCh);
        total += ($scope.submittedCashBags.indexOf(cashBag.cashbagId) >= 0) ? cashTotal : 0;
      });

      angular.forEach(chCreditCard, function (creditCard) {
        var creditTotal = makeFinite(creditCard.bankAmountFinal) + makeFinite(creditCard.coinAmountCc) + makeFinite(creditCard.paperAmountCc);
        total += ($scope.submittedCashBags.indexOf(creditCard.cashbagId) >= 0) ? creditTotal : 0;
      });

      angular.forEach(chDiscount, function (discount) {
        var discountTotal = makeFinite(discount.bankAmountFinal) + makeFinite(discount.coinAmountCc) + makeFinite(discount.paperAmountCc);
        total += ($scope.submittedCashBags.indexOf(discount.cashbagId) >= 0) ? discountTotal : 0;
      });

      total += getManualDataTotals('discount');

      return total;
    }

    function calculateEPOSRevenue(eposRevenue) {
      $this.eposCashBag = lodash.uniq(angular.copy(eposRevenue[0].response), 'id');
      var eposCreditCard = lodash.uniq(angular.copy(eposRevenue[1].response), 'id');
      var eposDiscount = lodash.uniq(angular.copy(eposRevenue[2].response), 'id');
      var total = 0;

      angular.forEach($this.eposCashBag, function (cashBag) {
        var cashTotal = makeFinite(cashBag.bankAmount) + makeFinite(cashBag.coinAmountManual) + makeFinite(cashBag.paperAmountManual);
        total += ($scope.submittedCashBags.indexOf(cashBag.cashbagId) >= 0) ? cashTotal : 0;
      });

      angular.forEach(eposCreditCard, function (creditCard) {
        var creditTotal = makeFinite(creditCard.bankAmountFinal);
        total += ($scope.submittedCashBags.indexOf(creditCard.cashbagId) >= 0) ? creditTotal : 0;
      });

      angular.forEach(eposDiscount, function (discount) {
        var discountTotal = makeFinite(discount.bankAmountFinal);
        total += ($scope.submittedCashBags.indexOf(discount.cashbagId) >= 0) ? discountTotal : 0;
      });

      total += getManualDataTotals('discount');

      return total;
    }

    function setupTotalRevenue () {
      $scope.totalRevenue = {
        cashHandler: $scope.companyIsUsingCash ? $scope.formatAsCurrency(calculateCashRevenue($scope.cashRevenue)) : 0,
        epos: $scope.formatAsCurrency(calculateEPOSRevenue($scope.eposRevenue))
      };
    }

    function setupDiscrepancy() {
      var netValue = parseFloat($scope.stockTotals.totalNet.netEPOS) - parseFloat($scope.stockTotals.totalNet.netLMP);
      var netPercentage = makeFinite(netValue * 100 / parseFloat($scope.stockTotals.totalNet.netEPOS));

      var revenueValue = 0;
      var revenuePercentage = 0;
      var exchangeValue = 0;
      var exchangePercentage = 0;

      if ($scope.companyIsUsingCash) {
        revenueValue = parseFloat($scope.totalRevenue.epos) - parseFloat($scope.stockTotals.totalNet.netEPOS);
        revenuePercentage = makeFinite(revenueValue * 100 / parseFloat($scope.stockTotals.totalNet.netEPOS));
        exchangeValue = parseFloat($scope.totalRevenue.cashHandler) - parseFloat($scope.totalRevenue.epos);
        exchangePercentage = makeFinite(exchangeValue * 100 / parseFloat($scope.stockTotals.totalNet.netEPOS));
      }

      var totalValue = netValue + revenueValue + exchangeValue;
      var totalPercentage = netPercentage + revenuePercentage + exchangePercentage;

      $scope.discrepancy = {
        net: {
          value: $scope.formatAsCurrency(netValue),
          percentage: $scope.formatAsCurrency(netPercentage)
        },
        revenue: {
          value: $scope.formatAsCurrency(revenueValue),
          percentage: $scope.formatAsCurrency(revenuePercentage)
        },
        exchange: {
          value: $scope.formatAsCurrency(exchangeValue),
          percentage: $scope.formatAsCurrency(exchangePercentage)
        },
        total: {
          value: $scope.formatAsCurrency(totalValue),
          percentage: $scope.formatAsCurrency(totalPercentage)
        }
      };
    }

    function initializeSalesAndRevenue(saleType, cashBagId) {
      var amount = getManualDataTotals(saleType, cashBagId);

      return {
        amount: amount,
        manualTotal: amount,
        items: []
      };
    }

    function setupCashBags () {
      $scope.normalizedCashBags = $scope.cashBags.map(function (cashBag) {
        return {
          id: cashBag.id,
          cashBag: cashBag.cashBagNumber,
          bankRefNumber: cashBag.bankReferenceNumber,
          isDeleted: cashBag.delete === true,
          deletedByUser: getDeltedBy (cashBag),
          deletedOn: getDeleteddOn (cashBag),
          isManual: (cashBag.originationSource === 2 && cashBag.eposCashbagId === null),
          scheduleNumber: cashBag.scheduleNumber,
          scheduleDate: dateUtility.formatTimestampForApp(cashBag.scheduleDate),
          isSubmitted: cashBag.submitted,
          isVerified: (cashBag.amendVerifiedOn) ? true : false,
          verifiedByUser: (cashBag.amendVerifiedBy) ? cashBag.amendVerifiedBy.userName : 'Unknown',
          verifiedOn: dateUtility.formatTimestampForApp(cashBag.amendVerifiedOn),
          cashRevenue: initializeSalesAndRevenue('cash', cashBag.id),
          creditRevenue: initializeSalesAndRevenue('credit', cashBag.id),
          discountRevenue: initializeSalesAndRevenue('discount', cashBag.id),
          regularItemSales: 0,
          virtualItemSales: 0 + getManualDataTotals('virtual', cashBag.id),
          voucherItemSales: 0 + getManualDataTotals('voucher', cashBag.id),
          promotionDiscounts: 0 + getManualDataTotals('promotion', cashBag.id),
          flightSectors: [],
          flightSectorsForRearrange: [],
          isVerifiedManual: (cashBag.verificationConfirmedOn) ? true : false,
          isAmended: (cashBag.isAddedPosttrip || cashBag.isDeletedPosttrip) 
        };
      });
    }

    function getDeleteddOn (cashBag) {
      return cashBag.updatedOn ? dateUtility.formatTimestampForApp(cashBag.updatedOn) : dateUtility.formatTimestampForApp(cashBag.createdOn);
    }

    function getDeltedBy (cashBag) {
      if (cashBag.updatedByPerson) {
        return cashBag.updatedByPerson.userName;
      }

      if (cashBag.createdByPerson) {
        return cashBag.createdByPerson.userName;
      }

      return 'Unknown';
    }

    function isCashbagSubmitted() {
      $scope.cashBagSubmitted = false;
      angular.forEach($scope.normalizedCashBags, function (normalizedCashBag) {
        if (normalizedCashBag.isSubmitted === true) {
          $scope.cashBagSubmitted = true;
        }
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

    function setStockTotals (stockTotalsFromAPI) {
      $this.stockTotals = angular.copy(stockTotalsFromAPI.response);

      angular.forEach($this.stockTotals, function (stockTotal) {
        var itemMatchName = lodash.findWhere($this.masterItemList, { id: stockTotal.itemMasterId });
        stockTotal.itemName = !!itemMatchName ? itemMatchName.itemName : '';
      });
    }

    function getStockTotals () {
      return reconciliationFactory.getStockTotals($routeParams.storeInstanceId).then(setStockTotals);
    }

    function consolidateDuplicatePromotions() {
      var consolidatedPromotions = [];
      angular.forEach($this.promotionTotals, function (promotion) {
        var promotionMatch = lodash.findWhere(consolidatedPromotions, { promotionId: promotion.promotionId });
        if (promotionMatch) {
          promotionMatch.convertedAmount = promotionMatch.convertedAmount + promotion.convertedAmount;
          promotionMatch.quantity += (promotion.quantity || 1);
        } else {
          promotion.quantity = 1;
          consolidatedPromotions.push(promotion);
        }
      });

      $this.promotionTotals = consolidatedPromotions;
    }

    function setPromotionTotals (promotionTotalsFromAPI) {
      $this.promotionTotals = $filter('filter')(angular.copy(promotionTotalsFromAPI.response), {
        exchangeRateTypeId: 1
      });

      consolidateDuplicatePromotions();

      angular.forEach($this.promotionTotals, function (promotion) {
        promotion.eposQuantity = promotion.quantity;
        promotion.eposTotal = $scope.formatAsCurrency(promotion.convertedAmount);
        reconciliationFactory.getPromotion(promotion.promotionId).then(function (dataFromAPI) {
          promotion.itemName = dataFromAPI.promotionName;
        }, handleResponseError);

        promotion.itemTypeName = 'Promotion';
      });
    }

    function getPromotionTotals () {
      return reconciliationFactory.getPromotionTotals($routeParams.storeInstanceId).then(setPromotionTotals);
    }

    function setCompanyPreferences(companyPreferencesFromAPI) {
      $scope.companyPreferences = lodash.sortByOrder(angular.copy(companyPreferencesFromAPI.preferences), 'startDate', 'desc');
      $scope.cbNumberMaxLength = 25;
      var cbNumberPref = lodash.where($scope.companyPreferences, { choiceName: 'Cashbag Number Length', optionCode: 'CBV', optionName: 'Cashbag Validation' })[0];
      if (angular.isDefined(cbNumberPref) && cbNumberPref !== null && angular.isDefined(cbNumberPref.numericValue)) {
        if (cbNumberPref.numericValue !== null && cbNumberPref.numericValue > 0) {
          $scope.cbNumberMaxLength = cbNumberPref.numericValue;
        }
      }
    }

    function getCompanyPreferences () {
      return reconciliationFactory.getCompanyPreferences().then(setCompanyPreferences);
    }

    function getCHManualData (chRevenue) {
      $this.chCashBag = lodash.uniq(angular.copy(chRevenue[0].response), 'id');
      var totalManual = 0;

      angular.forEach($this.chCashBag, function (cashBag) {
        var foundCB = lodash.findWhere($scope.cashBags, { id: cashBag.cashbagId });
        if (foundCB && foundCB.originationSource === 2 && foundCB.eposCashbagId === null) {
          var cashTotal = (makeFinite(cashBag.paperAmountManualCh) + makeFinite(cashBag.coinAmountManualCh)) + (makeFinite(cashBag.paperAmountManualCHBank) +
          makeFinite(cashBag.coinAmountManualCHBank)) + makeFinite(cashBag.bankAmountCh);
          totalManual += ($scope.manualCashBagIds.indexOf(cashBag.cashbagId) >= 0 && $scope.submittedCashBags.indexOf(cashBag.cashbagId) >= 0) ? cashTotal : 0;
        }
      });

      return totalManual;
    }

    function setCashRevenue (cashRevenueFromAPI) {
      $scope.cashRevenue = angular.copy(cashRevenueFromAPI);
      $scope.totalCHManualValue =  getCHManualData($scope.cashRevenue);
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
      var companyData = globalMenuService.getCompanyData();
      var paymentReport = angular.copy(paymentReportFromAPI.paymentReports);
      angular.forEach(paymentReport, function (report) {
        report.scheduleDate = dateUtility.formatDateForApp(report.scheduleDate, 'YYYY-MM-DDThh:mm');
        report.companyName = companyData.companyName;
      });

      $scope.paymentReport = paymentReport;
    }

    function getStoreInstancePaymentReport () {
      return reconciliationFactory.getPaymentReport($routeParams.storeInstanceId).then(setPaymentReport);
    }

    function getCashBagPaymentReport (cashBagNumber) {
      return reconciliationFactory.getPaymentReport($routeParams.storeInstanceId, cashBagNumber).then(setPaymentReport);
    }

    function setCashBags (cashBagsFromAPI) {
      $scope.cashBags = angular.copy(cashBagsFromAPI.response);
      setupCashBags();
      $scope.submittedCashBags = setSubmittedCashBagList();
      isCashbagSubmitted();
    }

    function setFlightSectors(normalizedCashBag, flightSectorsFromAPI) {
      var flightSectors = angular.copy(flightSectorsFromAPI.response);

      angular.forEach(flightSectors, function (flightSector) {
        var normalizedFlightSector = {
          id: flightSector.id,
          cashbagId: flightSector.cashbagId,
          arrivalStation: flightSector.arrivalStation,
          departureStation: flightSector.departureStation,
          passengerCount: flightSector.passengerCount,
          scheduleDate: dateUtility.formatDateForApp(flightSector.scheduleDate),
          scheduleNumber: flightSector.scheduleNumber,
          tailNumber: flightSector.tailNumber,
          transactionCount: flightSector.transactionsNumber,
          transactionTotal: $scope.formatAsCurrency(flightSector.eposSales),
          crewData: flightSector.crew,
          isPosttrip: flightSector.isPosttrip
        };

        normalizedCashBag.flightSectors.push(normalizedFlightSector);
        if (normalizedFlightSector.transactionCount > 0) {
          normalizedCashBag.canBeDeleted = false;
        }

        if (flightSector.isPosttrip) {
          normalizedCashBag.flightSectorsForRearrange.push(normalizedFlightSector);
        }
      });
    }

    function getFlightSectors(normalizedCashBag) {
      return storeInstanceAmendFactory.getFlightSectors(normalizedCashBag.id).then(function (flightSectorsFromAPI) {
          setFlightSectors(normalizedCashBag, flightSectorsFromAPI);
        });
    }

    function hasEposTransactions(cashBag) {
      if (!cashBag.cashBagCurrencies) {
        return false;
      }

      var eposTransactions = cashBag.cashBagCurrencies.filter(function (currency) {
        var coins = 0;
        var papers = 0;

        if (currency.coinAmountEpos) {
          coins = parseFloat(currency.coinAmountEpos);
        }

        if (currency.paperAmountEpos) {
          papers = parseFloat(currency.paperAmountEpos);
        }

        if (coins > 0 || papers > 0) {
          return true;
        }
      });

      return eposTransactions.length > 0;
    }

    function isCashBagDeleteAllowed(cashBag) {
      return !(cashBag.bankReferenceNumber || cashBag.isSubmitted === true || hasEposTransactions(cashBag));
    }

    function getBaseCurrencyAmount (bankAmount, paperAmount, coinAmount, exchangeRate) {
      var baseCurrencyAmount = 0.00;

      if (exchangeRate.bankExchangeRate) {
        baseCurrencyAmount = bankAmount / exchangeRate.bankExchangeRate;
      } else {
        var paperExchangeRate = exchangeRate.paperExchangeRate;
        var coinExchangeRate = exchangeRate.coinExchangeRate;

        var convertedPaperAmount = paperAmount / paperExchangeRate;
        var convertedCoinAmount = coinAmount / coinExchangeRate;

        baseCurrencyAmount = convertedPaperAmount + (convertedCoinAmount / 100);
      }

      return parseFloat(baseCurrencyAmount.toFixed(2));
    }

    function getExchangeRate(currencyId, dailyExchangeRates) {
      return lodash.find(dailyExchangeRates, 'retailCompanyCurrencyId', currencyId);
    }

    function setCashTotalRevenueItems(normalizedCashBag, detailedCashBag, dailyExchangeRates) {
      var currencies = lodash.filter(detailedCashBag.cashBagCurrencies, function(currency) {
        return parseFloat(currency.coinAmountManual) > 0 || parseFloat(currency.paperAmountManual) > 0;
      });

      angular.forEach(currencies, function (currency) {
        var totalAmount = 0.00;
        var bankAmount = 0.00;
        var paperAmount = 0.00;
        var coinAmount = 0.00;
        var realExchangeRate = 0.00;

        var exchangeRate = getExchangeRate(currency.currencyId, dailyExchangeRates.dailyExchangeRateCurrencies);

        if (exchangeRate.bankExchangeRate) {
          totalAmount = parseFloat(currency.bankAmount);
          realExchangeRate = exchangeRate.bankExchangeRate;
        } else {
          paperAmount = parseFloat(currency.paperAmountManual);
          coinAmount = parseFloat(currency.coinAmountManual);
          totalAmount = paperAmount + coinAmount;
          realExchangeRate = exchangeRate.paperExchangeRate;
        }

        normalizedCashBag.cashRevenue.items.push({
          currency: getCurrencyByBaseCurrencyId($scope.companyGlobalCurrencies, currency.currencyId).currencyCode,
          amount: totalAmount,
          exchangeRate: realExchangeRate,
          baseCurrencyAmount: getBaseCurrencyAmount(bankAmount, paperAmount, coinAmount, exchangeRate)
        });
      });
    }

    function setCashBagDetails(normalizedCashBag, cashBagFromAPI) {
      var companyId = globalMenuService.company.get();
      var detailedCashBag = angular.copy(cashBagFromAPI);
      var isTransaction = false;

      normalizedCashBag.flightSectors.forEach(function (sector) {
        if (sector.transactionCount > 0) {
          isTransaction = true;
        }
      });

      normalizedCashBag.canBeDeleted = isTransaction ? false : isCashBagDeleteAllowed(detailedCashBag);
      dailyExchangeRatesService.getDailyExchangeById(companyId, detailedCashBag.dailyExchangeRateId).then(function (dataFromAPI) {
        setCashTotalRevenueItems(normalizedCashBag, detailedCashBag, angular.copy(dataFromAPI));
      });
    }

    function getCashBagDeletionFlag(normalizedCashBag) {
      return cashBagFactory.getCashBag(normalizedCashBag.id).then(function (cashBagFromAPI) {
        setCashBagDetails(normalizedCashBag, cashBagFromAPI);
      });
    }

    function setEposItemSales(dataFromAPI, cashbagId) {
      $this.cashBagEposSales = $this.cashBagEposSales || [];
      var eposSales = angular.copy(dataFromAPI.response);

      angular.forEach(eposSales, function (item) {
        var itemMatch = lodash.findWhere($this.masterItemList, { id: item.itemMasterId });
        var typeMatch = lodash.findWhere($scope.itemTypes, { id: item.itemTypeId });
        var newItem = {
          itemTypeName: !!typeMatch ? typeMatch.name : '',
          cashbagId: cashbagId,
          eposQuantity: item.eposQuantity,
          eposTotal: item.eposTotal,
          itemName: !!itemMatch ? itemMatch.itemName : ''
        };

        $this.cashBagEposSales.push(newItem);
        extractEposSalesByCashBag(newItem);
      });
    }

    function getCashBagEposSales(normalizedCashBag) {
      return storeInstanceAmendFactory.getCashBagEposSales(normalizedCashBag.id).then(function (dataFromAPI) {
        setEposItemSales(dataFromAPI, normalizedCashBag.id);
      }, handleResponseError);
    }

    function getCashBagDetails () {
      var promiseArray = [];

      angular.forEach($scope.normalizedCashBags, function (normalizedCashBag) {
        promiseArray.push(getCashBagDeletionFlag(normalizedCashBag));
        promiseArray.push(getFlightSectors(normalizedCashBag));
        promiseArray.push(getCashBagEposSales(normalizedCashBag));
      });

      $q.all(promiseArray).then();
    }

    function getCashBags () {
      var companyId = globalMenuService.company.get();
      var payload = {
        companyId: companyId,
        storeInstanceId: $routeParams.storeInstanceId,
        showDeletedCB: true
      };

      return storeInstanceAmendFactory.getCashBags(payload)
                                      .then(setCashBags)
                                      .then(getCashBagDetails);
    }

    function setStoreStatusList(dataFromAPI) {
      $scope.storeStatusList = angular.copy(dataFromAPI);
    }

    function getStoreStatusList () {
      recordsService.getStoreStatusList().then(setStoreStatusList);
    }

    function setStations (dataFromAPI) {
      $scope.stations = angular.copy(dataFromAPI.response);
    }

    function getStations () {
      var companyId = globalMenuService.company.get();

      stationsService.getStationList(companyId).then(setStations);
    }

    function showLoadingModal(text) {
      $scope.displayError = false;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function setSubmittedCashBagList() {
      var submittedList = [];
      angular.forEach($scope.cashBags, function (cashBag) {
        if (cashBag.submitted && !cashBag.delete) {
          submittedList.push(cashBag.id);
        }
      });

      return submittedList;
    }

    function handleResponseError(responseFromAPI) {
      resetAllModals();
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
      showLoadingModal('Loading Store Instance Amend Details');

      var promiseArray = [
        getStoreStatusList(),
        getStoreInstance(),
        getCompany(),
        getCompanyGlobalCurrencies(),
        getCashBags(),
        getStockTotals(),
        getPromotionTotals(),
        getCompanyPreferences(),
        getCashRevenue(),
        getEPOSRevenue(),
        getStations()
      ];

      $q.all(promiseArray).then(handleInitDataSuccess, handleResponseError);
    }

    function setManualDataSet(dataFromAPI, cashBagsToInclude, optionalItemFilter, validateOnField) {
      var itemTypeId = (angular.isDefined(optionalItemFilter) && optionalItemFilter !== null) ? lodash.findWhere($scope.itemTypes, { name: optionalItemFilter }).id : 0;
      var manualDataSet = [];
      angular.forEach(dataFromAPI, function (manualData) {
        var itemTypeConditional = (angular.isDefined(optionalItemFilter) && optionalItemFilter !== null) ? manualData.itemTypeId === itemTypeId : true;
        if (cashBagsToInclude.indexOf(manualData.cashbagId) >= 0 && itemTypeConditional) {
          var manualCB = lodash.filter($scope.manualCashBags, { id: manualData.cashbagId });
          if (angular.isDefined(manualCB) && manualCB !== null && manualCB.length > 0) {
            var myCB = manualCB[0];
            var validatedOn = myCB[validateOnField];
            if (angular.isDefined(validatedOn) && validatedOn !== null) {
              manualDataSet.push(manualData);
            }
          }
        }
      });

      return manualDataSet;
    }

    function initAmendMode() {
      $scope.isAmendReadOnly = true;
      if (angular.isDefined($localStorage.featuresInRole.RECONCILIATION) && angular.isDefined($localStorage.featuresInRole.RECONCILIATION.AMENDSTOREINST)) {
        var featuresInRoleCollection = angular.copy($localStorage.featuresInRole.RECONCILIATION.AMENDSTOREINST);
        angular.forEach(featuresInRoleCollection, function (feature) {
          if (angular.isDefined(feature.taskCode) && feature.taskCode === 'AMEND') {
            var amendPermissions = feature.permissionCode;
            if (angular.isDefined(amendPermissions) && amendPermissions.length > 0) {
              angular.forEach(amendPermissions, function (permission) {
                if (permission === 'U' || permission === 'C' || permission === 'D') {
                  $scope.isAmendReadOnly = false;
                }
              });
            }
          } 
        });
      }
    }

    function setManualData(responseCollectionFromAPI) {
      var manualDataToInclude = [];
      var manualList = [];
      var cashBagList = angular.copy(responseCollectionFromAPI[0].response);
      angular.forEach(cashBagList, function (cashBag) {
        if (cashBag.originationSource === 2 && cashBag.eposCashbagId === null) {
          manualDataToInclude.push(cashBag.id);
          manualList.push(cashBag);
        }
      });

      $scope.manualCashBagIds = manualDataToInclude;
      $scope.manualCashBags = manualList;

      $this.manualData = {
        cash: setManualDataSet(angular.copy(responseCollectionFromAPI[2].response), manualDataToInclude, null, 'verificationConfirmedOn'),
        credit: setManualDataSet(angular.copy(responseCollectionFromAPI[3].response), manualDataToInclude, null, 'verificationConfirmedOn'),
        virtual: setManualDataSet(angular.copy(responseCollectionFromAPI[4].response), manualDataToInclude, 'Virtual', 'verificationConfirmedOn'),
        voucher: setManualDataSet(angular.copy(responseCollectionFromAPI[4].response), manualDataToInclude, 'Voucher', 'verificationConfirmedOn'),
        promotion: setManualDataSet(angular.copy(responseCollectionFromAPI[5].response), manualDataToInclude, null, 'verificationConfirmedOn'),
        discount: setManualDataSet(angular.copy(responseCollectionFromAPI[6].response), manualDataToInclude, null, 'verificationConfirmedOn')
      };
    }

    function initDependenciesSuccess(responseCollectionFromAPI) {
      hideLoadingModal();
      $scope.itemTypes = angular.copy(responseCollectionFromAPI[1]);
      $this.masterItemList = angular.copy(responseCollectionFromAPI[7].masterItems);
      setManualData(responseCollectionFromAPI);
      initData();
    }

    function initDependencies() {
      showLoadingModal('Loading Amend Details');
      var payloadForManualData = {
        storeInstanceId: $routeParams.storeInstanceId
      };

      var promises = [
        reconciliationFactory.getCashBagVerifications($routeParams.storeInstanceId),
        reconciliationFactory.getItemTypesList(),
        reconciliationFactory.getCashBagManualData('cash', payloadForManualData),
        reconciliationFactory.getCashBagManualData('credit-cards', payloadForManualData),
        reconciliationFactory.getCashBagManualData('items', payloadForManualData),
        reconciliationFactory.getCashBagManualData('promotions', payloadForManualData),
        reconciliationFactory.getCashBagManualData('discounts', payloadForManualData),
        storeInstanceAmendFactory.getMasterItemList({ startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()) })
      ];

      $q.all(promises).then(initDependenciesSuccess, handleResponseError);
    }

    function initViewDefaults () {
      $scope.moveCashBagAction = 'none';
      $scope.showDeletedCashBags = false;
      $scope.sectorsToMove = [];
      $scope.singleSectorsToMove = null;
      $scope.cashBagFilter = {};
      $scope.scheduleSearch = {};
      $scope.numberExist = false;
      angular.element('#checkbox').bootstrapSwitch();
    }

    function init () {
      initViewDefaults();
      initDependencies();
      initAmendMode();
    }

    init();

  });
