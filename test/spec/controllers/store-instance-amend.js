'use strict';

describe('Controller: StoreInstanceAmendCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-verifications.json'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/currencies.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/stock-totals.json'));
  beforeEach(module('served/promotion-totals.json'));
  beforeEach(module('served/company-preferences.json'));
  beforeEach(module('served/ch-cash-bag.json'));
  beforeEach(module('served/payment-report.json'));
  beforeEach(module('served/employees.json'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/cash-bag-carrier-instances.json'));
  beforeEach(module('served/post-trip-data.json'));
  beforeEach(module('served/post-trip-data-list.json'));
  beforeEach(module('served/post-trip-single-data-list.json'));
  beforeEach(module('served/transactions.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/master-item.json'));
  beforeEach(module('served/promotion.json'));
  beforeEach(module('served/daily-exchange-rate.json'));

  var scope;
  var StoreInstanceAmendCtrl;
  var controller;
  var location;
  var storeInstanceAmendFactory;
  var dailyExchangeRatesService;
  var reconciliationFactory;
  var storeInstanceFactory;
  var employeesService;
  var cashBagFactory;
  var postTripFactory;
  var transactionFactory;
  var recordsService;
  var dateUtility;
  var storeInstanceDeferred;
  var storeInstanceResponseJSON;
  var cashBagsDeferred;
  var cashBagsResponseJSON;
  var schedulesDeferred;
  var schedulesResponseJSON;
  var storeInstanceJSON;
  var getStoreInstanceDetailsDeferred;
  var getCompanyDeferred;
  var getCompanyJSON;
  var getCompanyGlobalCurrenciesDeferred;
  var getCompanyGlobalCurrenciesJSON;
  var getItemTypesListDeferred;
  var getItemTypesListJSON;
  var getStockTotalsDeferred;
  var getStockTotalsJSON;
  var getPromotionTotalsDeferred;
  var getPromotionTotalsJSON;
  var getCompanyPreferencesDeferred;
  var getCompanyPreferencesJSON;
  var getCHRevenueDeferred;
  var getEPOSRevenueDeferred;
  var cashHandlerCashBagJSON;
  var getPaymentReportDeferred;
  var getPaymentReportJSON;
  var getEmployeesDeferred;
  var employeesJSON;
  var getCashBagDeferred;
  var cashBagJSON;
  var flightSectorsJSON;
  var getFlightSectorsDeferred;
  var postTripDataJSON;
  var postTripsDataJSON;
  var singlePostTripsDataJSON;
  var getPostTripDeferred;
  var getPostTripsDeferred;
  var getSinglePostTripsDeferred;
  var transactionsJSON;
  var getTransactionListDeferred;
  var storeInstancesJSON;
  var getStoreInstancesListDeferred;
  var storeStatusJSON;
  var getStoreStatusListDeferred;
  var stationsJSON;
  var getStationsDeferred;
  var stationsService;
  var masterItemJSON;
  var masterItemDeferred;
  var promotionJSON;
  var promotionDeferred;
  var dailyExchangeRateJSON;
  var dailyExchangeRateDeferred;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector, _servedCashBagVerifications_, _servedStoreInstance_, _servedCompany_,
                              _servedCurrencies_, _servedItemTypes_, _servedStockTotals_, _servedPromotionTotals_, _servedCompanyPreferences_,
                              _servedChCashBag_, _servedPaymentReport_, _servedEmployees_, _servedCashBag_, _servedCashBagCarrierInstances_,
                              _servedPostTripData_, _servedTransactions_, _servedStoreInstanceList_, _servedStoreStatus_, _servedPostTripDataList_,
                              _servedPostTripSingleDataList_, _servedStations_, _servedMasterItem_, _servedPromotion_, _servedDailyExchangeRate_) {
    location = $location;
    scope = $rootScope.$new();
    storeInstanceAmendFactory = $injector.get('storeInstanceAmendFactory');
    reconciliationFactory = $injector.get('reconciliationFactory');
    employeesService = $injector.get('employeesService');
    cashBagFactory = $injector.get('cashBagFactory');
    postTripFactory = $injector.get('postTripFactory');
    transactionFactory = $injector.get('transactionFactory');
    storeInstanceFactory = $injector.get('storeInstanceFactory');
    recordsService = $injector.get('recordsService');
    dateUtility = $injector.get('dateUtility');
    stationsService = $injector.get('stationsService');
    dailyExchangeRatesService = $injector.get('dailyExchangeRatesService');
    controller = $controller;

    storeInstanceResponseJSON = [{ id: 1 }]; // stub for now until API is complete
    storeInstanceDeferred = $q.defer();
    storeInstanceDeferred.resolve(storeInstanceResponseJSON);
    schedulesResponseJSON = [{ id: 2 }]; // stub for now until API is complete
    schedulesDeferred = $q.defer();
    schedulesDeferred.resolve(schedulesResponseJSON);

    cashBagsResponseJSON = _servedCashBagVerifications_;
    cashBagsDeferred = $q.defer();
    cashBagsDeferred.resolve(cashBagsResponseJSON);

    storeInstanceJSON = _servedStoreInstance_;
    getStoreInstanceDetailsDeferred = $q.defer();
    getStoreInstanceDetailsDeferred.resolve(storeInstanceJSON);

    getCompanyJSON = _servedCompany_;
    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(getCompanyJSON);

    getCompanyGlobalCurrenciesJSON = _servedCurrencies_;
    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesDeferred.resolve(getCompanyGlobalCurrenciesJSON);

    getItemTypesListJSON = _servedItemTypes_;
    getItemTypesListDeferred = $q.defer();
    getItemTypesListDeferred.resolve(getItemTypesListJSON);

    getStockTotalsJSON = _servedStockTotals_;
    getStockTotalsDeferred = $q.defer();
    getStockTotalsDeferred.resolve(getStockTotalsJSON);

    getPromotionTotalsJSON = _servedPromotionTotals_;
    getPromotionTotalsDeferred = $q.defer();
    getPromotionTotalsDeferred.resolve(getPromotionTotalsJSON);

    getCompanyPreferencesJSON = _servedCompanyPreferences_;
    getCompanyPreferencesDeferred = $q.defer();
    getCompanyPreferencesDeferred.resolve(getCompanyPreferencesJSON);

    cashHandlerCashBagJSON = _servedChCashBag_;
    getCHRevenueDeferred = $q.defer();
    getCHRevenueDeferred.resolve([cashHandlerCashBagJSON, {}, {}]);

    getEPOSRevenueDeferred = $q.defer();
    getEPOSRevenueDeferred.resolve([{}, {}, {}]);

    getPaymentReportJSON = _servedPaymentReport_;
    getPaymentReportDeferred = $q.defer();
    getPaymentReportDeferred.resolve(getPaymentReportJSON);

    employeesJSON = _servedEmployees_;
    getEmployeesDeferred = $q.defer();
    getEmployeesDeferred.resolve(employeesJSON);

    cashBagJSON = _servedCashBag_;
    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagJSON);

    flightSectorsJSON = _servedCashBagCarrierInstances_;
    getFlightSectorsDeferred = $q.defer();
    getFlightSectorsDeferred.resolve(flightSectorsJSON);

    postTripDataJSON = _servedPostTripData_;
    getPostTripDeferred = $q.defer();
    getPostTripDeferred.resolve(postTripDataJSON);

    postTripsDataJSON = _servedPostTripDataList_;
    getPostTripsDeferred = $q.defer();
    getPostTripsDeferred.resolve(postTripsDataJSON);

    singlePostTripsDataJSON = _servedPostTripSingleDataList_;
    getSinglePostTripsDeferred = $q.defer();
    getSinglePostTripsDeferred.resolve(singlePostTripsDataJSON);

    transactionsJSON = _servedTransactions_;
    getTransactionListDeferred = $q.defer();
    getTransactionListDeferred.resolve(transactionsJSON);

    storeInstancesJSON = _servedStoreInstanceList_;
    getStoreInstancesListDeferred = $q.defer();
    getStoreInstancesListDeferred.resolve(storeInstancesJSON);

    storeStatusJSON = _servedStoreStatus_;
    getStoreStatusListDeferred = $q.defer();
    getStoreStatusListDeferred.resolve(storeStatusJSON);

    stationsJSON = _servedStations_;
    getStationsDeferred = $q.defer();
    getStationsDeferred.resolve(stationsJSON);

    masterItemJSON = _servedMasterItem_;
    masterItemDeferred = $q.defer();
    masterItemDeferred.resolve(masterItemJSON);

    promotionJSON = _servedPromotion_;
    promotionDeferred = $q.defer();
    promotionDeferred.resolve(promotionJSON);

    dailyExchangeRateJSON = _servedDailyExchangeRate_;
    dailyExchangeRateDeferred = $q.defer();
    dailyExchangeRateDeferred.resolve(dailyExchangeRateJSON);

    spyOn(storeInstanceAmendFactory, 'getStoreInstancesMockData').and.returnValue(storeInstanceDeferred.promise);
    spyOn(storeInstanceAmendFactory, 'getCashBags').and.returnValue(cashBagsDeferred.promise);
    spyOn(storeInstanceAmendFactory, 'getScheduleMockData').and.returnValue(schedulesDeferred.promise);
    spyOn(storeInstanceAmendFactory, 'getCashBagListMockData').and.returnValue(getCashBagDeferred.promise);
    spyOn(reconciliationFactory, 'getStoreInstanceDetails').and.returnValue(getStoreInstanceDetailsDeferred.promise);
    spyOn(reconciliationFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);
    spyOn(reconciliationFactory, 'getCompanyGlobalCurrencies').and.returnValue(getCompanyGlobalCurrenciesDeferred.promise);
    spyOn(reconciliationFactory, 'getItemTypesList').and.returnValue(getItemTypesListDeferred.promise);
    spyOn(reconciliationFactory, 'getStockTotals').and.returnValue(getStockTotalsDeferred.promise);
    spyOn(reconciliationFactory, 'getPromotionTotals').and.returnValue(getPromotionTotalsDeferred.promise);
    spyOn(reconciliationFactory, 'getCompanyPreferences').and.returnValue(getCompanyPreferencesDeferred.promise);
    spyOn(reconciliationFactory, 'getCHRevenue').and.returnValue(getCHRevenueDeferred.promise);
    spyOn(reconciliationFactory, 'getEPOSRevenue').and.returnValue(getEPOSRevenueDeferred.promise);
    spyOn(reconciliationFactory, 'getPaymentReport').and.returnValue(getPaymentReportDeferred.promise);
    spyOn(reconciliationFactory, 'getMasterItem').and.returnValue(masterItemDeferred.promise);
    spyOn(reconciliationFactory, 'getPromotion').and.returnValue(promotionDeferred.promise);
    spyOn(employeesService, 'getEmployees').and.returnValue(getEmployeesDeferred.promise);
    spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);
    spyOn(cashBagFactory, 'verifyCashBag').and.callThrough();
    spyOn(cashBagFactory, 'unverifyCashBag').and.callThrough();
    spyOn(storeInstanceAmendFactory, 'getFlightSectors').and.returnValue(getFlightSectorsDeferred.promise);
    spyOn(storeInstanceAmendFactory, 'addFlightSector').and.callThrough();
    spyOn(storeInstanceAmendFactory, 'editFlightSector').and.callThrough();
    spyOn(postTripFactory, 'getPostTrip').and.returnValue(getPostTripDeferred.promise);
    spyOn(postTripFactory, 'getPostTripDataList').and.returnValues(getSinglePostTripsDeferred.promise, getPostTripsDeferred.promise);
    spyOn(transactionFactory, 'getTransactionList').and.returnValue(getTransactionListDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstancesList').and.returnValue(getStoreInstancesListDeferred.promise);
    spyOn(recordsService, 'getStoreStatusList').and.returnValue(getStoreStatusListDeferred.promise);
    spyOn(cashBagFactory, 'reallocateCashBag').and.callThrough();
    spyOn(cashBagFactory, 'mergeCashBag').and.callThrough();
    spyOn(storeInstanceAmendFactory, 'deleteCashBag').and.callThrough();
    spyOn(storeInstanceAmendFactory, 'rearrangeFlightSector').and.callThrough();
    spyOn(stationsService, 'getStationList').and.returnValue(getStationsDeferred.promise);
    spyOn(dailyExchangeRatesService, 'getDailyExchangeById').and.returnValue(dailyExchangeRateDeferred.promise);

    StoreInstanceAmendCtrl = controller('StoreInstanceAmendCtrl', {
      $scope: scope,
      $routeParams: {
        id: 2
      }
    });
  }));

  describe('init', function () {
    it('should call get cash bag data', function () {
      expect(storeInstanceAmendFactory.getCashBags).toHaveBeenCalled();
      expect(reconciliationFactory.getStoreInstanceDetails).toHaveBeenCalled();
      expect(reconciliationFactory.getCompany).toHaveBeenCalled();
      expect(reconciliationFactory.getCompanyGlobalCurrencies).toHaveBeenCalled();
      expect(reconciliationFactory.getItemTypesList).toHaveBeenCalled();
      expect(reconciliationFactory.getStockTotals).toHaveBeenCalled();
      expect(reconciliationFactory.getPromotionTotals).toHaveBeenCalled();
      expect(reconciliationFactory.getCompanyPreferences).toHaveBeenCalled();
      expect(reconciliationFactory.getCHRevenue).toHaveBeenCalled();
      expect(reconciliationFactory.getEPOSRevenue).toHaveBeenCalled();
      expect(employeesService.getEmployees).toHaveBeenCalled();

      scope.$digest();
      expect(scope.normalizedCashBags).toBeDefined();
    });

    it('should init no moveCashBag actions', function () {
      expect(scope.moveCashBagAction).toEqual('none');
    });

    it('should init with no sectors to be moved', function () {
      expect(scope.showDeletedCashBags).toEqual(false);
    });

    it('should init deleted cashBags to not be visible', function () {
      expect(scope.sectorsToMove.length).toEqual(0);
    });
  });

  describe('miscellaneous scope view functions', function () {
    describe('get class for accordion views', function () {
      it('should return close icon for open records', function () {
        var openAccordionIcon = scope.getClassForAccordionArrows(true);
        var openRowIcon = scope.getClassForTableAccordion(true);
        expect(openAccordionIcon).toEqual('fa-chevron-down');
        expect(openRowIcon).toEqual('fa fa-minus-square');
      });

      it('should return close class for closed records', function () {
        var openAccordionIcon = scope.getClassForAccordionArrows(false);
        var openRowIcon = scope.getClassForTableAccordion(false);
        expect(openAccordionIcon).toEqual('fa-chevron-right');
        expect(openRowIcon).toEqual('fa fa-plus-square-o');
      });
    });

    describe('doesSectorHaveCrewData', function () {
      it('should return false if cashBag has empty crew array', function () {
        var mockSector = { id: 1, crewData: [] };
        expect(scope.doesSectorHaveCrewData(mockSector)).toEqual(false);
        mockSector = { id: 1, crewData: [{ crewId: 1 }] };
        expect(scope.doesSectorHaveCrewData(mockSector)).toEqual(true);
      });
    });

    describe('shouldShowCashBag', function () {
      it('should always show cashBag if it has not been deleted and there are no filters', function () {
        var mockCashBag = { isDeleted: false };
        scope.cashBagFilter = {};
        scope.showDeletedCashBags = false;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
        scope.showDeletedCashBags = true;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
      });

      it('should show deleted cashBag if showDeletedCashBags is true and there are no filters', function () {
        var mockCashBag = { isDeleted: true };
        scope.cashBagFilter = {};
        scope.showDeletedCashBags = false;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(false);
        scope.showDeletedCashBags = true;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
      });

      it('should showCashBag if it is selected in the filter', function () {
        var mockFilteredCashBag = { id: 123, isDeleted: false };
        var mockNonFilteredCashBag = { id: 345, isDeleted: false };
        scope.cashBagFilter = { filterList:[{ id:123 }] };
        scope.showDeletedCashBags = false;
        expect(scope.shouldShowCashBag(mockFilteredCashBag)).toEqual(true);
        expect(scope.shouldShowCashBag(mockNonFilteredCashBag)).toEqual(false);
      });
    });

    describe('toggle verified cashBag', function () {
      it('should refresh cash bag list on success', function () {
          scope.cashBagList = [{ isVerified: false }];
          scope.toggleVerifiedCashBag(scope.cashBagList[0]);

          expect(storeInstanceAmendFactory.getCashBags).toHaveBeenCalled();
      });
      it('should call verifyCashBag in case cash bag is not verified yet', function () {
        scope.cashBagList = [{ isVerified: false }];
        scope.toggleVerifiedCashBag(scope.cashBagList[0]);

        expect(cashBagFactory.verifyCashBag).toHaveBeenCalled();
      });
      it('should call unverifyCashBag in case cash bag is verified already', function () {
        scope.cashBagList = [{ isVerified: true }];
        scope.toggleVerifiedCashBag(scope.cashBagList[0]);

        expect(cashBagFactory.unverifyCashBag).toHaveBeenCalled();
      });
    });

    describe('hasMoreThanOneUnverifiedCashBags', function () {
      it('should return correct data', function () {

        scope.normalizedCashBags = [{ isVerified: false }, { isVerified: false}];
        expect(scope.hasMoreThanOneUnverifiedCashBags()).toBeTruthy();

        scope.normalizedCashBags = [{ isVerified: true }, { isVerified: false}];
        expect(scope.hasMoreThanOneUnverifiedCashBags()).toBeFalsy();

        scope.normalizedCashBags = [{ isVerified: true }, { isVerified: true}];
        expect(scope.hasMoreThanOneUnverifiedCashBags()).toBeFalsy();
      });
    });

    describe('hasFlightSectors', function () {
      it('should return correct data', function () {
        var cashBag;

        cashBag = { };
        expect(scope.hasFlightSectors(cashBag)).toBeFalsy();

        cashBag = { flightSectors: [] };
        expect(scope.hasFlightSectors(cashBag)).toBeFalsy();

        cashBag = { flightSectors: [ { id: 1 }] };
        expect(scope.hasFlightSectors(cashBag)).toBeTruthy();
      });
    });

    describe('expand/collapse all crew data', function () {
      var mockCashBag;
      beforeEach(function () {
        mockCashBag = {
          flightSectors: [
            { id: 1, rowOpen: false, crewData: [{ crewId: 1 }] },
            { id: 1, rowOpen: true, crewData: [{ crewId: 2 }] }
          ]
        };
        scope.cashBagList = [mockCashBag];
      });

      it('should expand all rows when shouldExpand is true', function () {
        scope.toggleCrewDetails(scope.cashBagList[0], true);
        expect(scope.cashBagList[0].flightSectors[0].rowOpen).toEqual(true);
        expect(scope.cashBagList[0].flightSectors[1].rowOpen).toEqual(true);
      });

      it('should return true if at least one row is open', function () {
        var isOpen = scope.isCrewDataOpen(scope.cashBagList[0]);
        expect(isOpen).toEqual(true);
        scope.cashBagList[0].flightSectors[1].rowOpen = false;
        isOpen = scope.isCrewDataOpen(mockCashBag);
        expect(isOpen).toEqual(false);
      });
    });

    it('canExecuteActions should decide if actions can be executed for given store instance', function () {
      scope.storeInstance = { statusId: 1 };
      scope.$digest();
      expect(scope.canExecuteActions()).toBeFalsy();

      scope.storeInstance = { statusId: 5 };
      scope.$digest();
      expect(scope.canExecuteActions()).toBeTruthy();

      scope.storeInstance = { statusId: 4 };
      scope.$digest();
      expect(scope.canExecuteActions()).toBeTruthy();

      scope.storeInstance = { statusId: 8 };
      scope.$digest();
      expect(scope.canExecuteActions()).toBeTruthy();

      scope.storeInstance = null;
      scope.$digest();
      expect(scope.canExecuteActions()).toBeFalsy();

      scope.storeInstance = null;
      scope.$digest();
      expect(scope.canExecuteActions({ isVerified: true })).toBeFalsy();
    });

    it('getStatusNameById should return status name for given status id', function () {
      scope.storeStatusList = storeStatusJSON;

      expect(scope.getStatusNameById(8)).toBe('Inbounded');
      expect(scope.getStatusNameById(4)).toBe('Discrepancies');
    });

    it('sumGroupedAmounts should sum amounts from the credit revenue array', function () {
      var amounts = [ {amount: 1.1}, {amount: 2.2} ];

      var result = scope.sumGroupedAmounts(amounts);

      expect(result).toBe('3.30');
    });

    it('getOrNA should return value or N/A if value is not defined or null', function () {
      expect(scope.getOrNA(null)).toEqual('N/A');
      expect(scope.getOrNA(undefined)).toEqual('N/A');
      expect(scope.getOrNA(0)).toEqual(0);
      expect(scope.getOrNA(1)).toEqual(1);
      expect(scope.getOrNA('ABC')).toEqual('ABC');
    });
  });

  describe('rearrange flight sector functions', function () {
    describe('clearRearrangeSelections', function () {
      it('should clear old flight sectors to be moved', function () {
        scope.sectorsToMove = [{ id: 1 }, { id: 2 }];
        scope.clearRearrangeSelections();
        expect(scope.sectorsToMove.length).toEqual(0);
      });
    });

    describe('canSaveRearrange', function () {
      it('should only allow saving if a record is selected and a target is set', function () {
        scope.sectorsToMove = [{ id: 1 }];
        scope.rearrangeOriginCashBag = { id: 1, cashBag: '123' };
        scope.rearrangeTargetCashBag = { id: 2, cashBag: '123' };
        expect(scope.canSaveRearrange()).toEqual(true);
      });

      it('should now allow saving if a target or selected sector is not set', function () {
        scope.sectorsToMove = { id: 1 };
        scope.rearrangeTargetCashBag = null;
        expect(scope.canSaveRearrange()).toEqual(false);
        scope.sectorsToMove = [];
        scope.rearrangeTargetCashBag = { cashBag: '123' };
        expect(scope.canSaveRearrange()).toEqual(false);
      });
    });

    describe('select flight sector to move', function () {
      beforeEach(function () {
        scope.sectorsToMove = [{ id: 1 }, { id: 2 }];
      });

      it('should add new sectors to sectorsToMove', function () {
        var mockNewSector = { id: 5 };
        scope.toggleSelectSectorToRearrange(mockNewSector);
        var expectedSectorsToMove = [{ id: 1 }, { id: 2 }, { id: 5 }];
        expect(scope.sectorsToMove).toEqual(expectedSectorsToMove);

      });

      it('should remove existing sectors to sectorsToMove', function () {
        var mockSelectedSector = { id: 1 };
        scope.toggleSelectSectorToRearrange(mockSelectedSector);
        var expectedSectorsToMove = [{ id: 2 }];
        expect(scope.sectorsToMove).toEqual(expectedSectorsToMove);
      });
    });

    describe('classes for selected records', function () {
      beforeEach(function () {
        scope.sectorsToMove = [{ id: 1 }, { id: 2 }];
      });

      it('should return colored and selected rows for items in sectorsToMove', function () {
        var mockSelectedSector = { id: 1 };
        var background = scope.getClassesForRearrangeSectors(mockSelectedSector, 'background');
        var buttonIcon = scope.getClassesForRearrangeSectors(mockSelectedSector, 'buttonIcon');
        expect(background).not.toEqual('');
        expect(buttonIcon).toEqual('fa fa-check-circle');
      });

      it('should return white deselected rows for items not in sectorsToMove', function () {
        var mockNonSelectedSector = { id: 5 };
        var background = scope.getClassesForRearrangeSectors(mockNonSelectedSector, 'background');
        var buttonIcon = scope.getClassesForRearrangeSectors(mockNonSelectedSector, 'buttonIcon');
        expect(background).toEqual('');
        expect(buttonIcon).toEqual('fa fa-circle-thin');
      });
    });

    describe('rearrangeSector', function () {
      it('should rearrange selected sectors', function () {
        scope.sectorsToMove = [{ id: 1 }, { id: 2 }];
        scope.rearrangeOriginCashBag = { id: 1, cashBag: '123', isManual: true };
        scope.rearrangeTargetCashBag = { id: 2, cashBag: '345'};

        scope.rearrangeSector();
        expect(storeInstanceAmendFactory.rearrangeFlightSector).toHaveBeenCalled();
      });
    });

    describe('close rearrange modal', function () {
      it('should clear all changes', function () {
        scope.sectorsToMove = [{ id: 1 }, { id: 2 }];
        scope.rearrangeOriginCashBag = { cashBag: '123' };
        scope.rearrangeTargetCashBag = { cashBag: '345' };

        scope.closeRearrangeSectorModal();
        expect(scope.sectorsToMove.length).toEqual(0);
        expect(scope.rearrangeOriginCashBag).toEqual(null);
        expect(scope.rearrangeTargetCashBag).toEqual(null);
      });
    });
  });

  describe('move cash bag functions', function () {
    describe('open move cash bag modal', function () {
      it('should attach cash bag to move to scope', function () {
        var mockCashBag = { id: 1 };
        scope.showMoveCashBagModal(mockCashBag);
        expect(scope.cashBagToMove).toEqual(mockCashBag);
      });
    });

    describe('close move cash bag modal', function () {
      it('should clear all previously set variables', function () {
        scope.moveCashBagAction = 'rearrange';
        scope.moveCashBagSearchResults = [{ id: 1 }];
        scope.cashBagToMove = { id: 1 };
        scope.moveSearch = { cashBag: '123' };
        scope.targetRecordForMoveCashBag = { cashBag: '345' };
        scope.closeMoveCashBagModal();

        expect(scope.moveCashBagAction).toEqual('none');
        expect(scope.moveCashBagSearchResults).toEqual(null);
        expect(scope.cashBagToMove).toEqual(null);
        expect(scope.moveSearch).toEqual({});
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });
    });

    describe('clear move cash bag results', function () {
      beforeEach(function () {
        scope.moveCashBagAction = 'rearrange';
        scope.moveCashBagSearchResults = [{ id: 1 }];
        scope.cashBagToMove = { id: 1 };
        scope.moveSearch = { cashBag: '123' };
        scope.targetRecordForMoveCashBag = { cashBag: '345' };
        scope.clearMoveSearchResults();
      });

      it('should clear search query and results', function () {
        expect(scope.moveSearch).toEqual({});
        expect(scope.moveCashBagSearchResults).toEqual(null);
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });

      it('should not clear cashBagAction and cashBag to move', function () {
        expect(scope.moveCashBagAction).toEqual('rearrange');
        expect(scope.cashBagToMove).toEqual({ id: 1 });
      });
    });

    describe('search for record', function () {
      beforeEach(function () {
        scope.targetRecordForMoveCashBag = null;
      });

      it('should getStoreInstances if action is reallocate', function () {
        scope.moveCashBagAction = 'reallocate';
        scope.moveSearch = { storeNumber: '123', scheduleDate: '10/20/2015' };
        var payload = {
          storeNumber: scope.moveSearch.storeNumber,
          startDate: dateUtility.formatDateForAPI(scope.moveSearch.scheduleDate),
          endDate: dateUtility.formatDateForAPI(scope.moveSearch.scheduleDate)
        };

        scope.searchForMoveCashBag();
        scope.$digest();

        expect(storeInstanceFactory.getStoreInstancesList).toHaveBeenCalledWith(payload);
      });

      it('should getCashBag if action is merge', function () {
        scope.moveCashBagAction = 'merge';
        scope.moveSearch = { cashBag: '123', bankRefNumber: 'ABC' };
        scope.searchForMoveCashBag();
        scope.$digest();

        expect(storeInstanceAmendFactory.getCashBags).toHaveBeenCalled();
      });

      it('should automatically set targetRecordForMoveCashBag if there is more than one record', function () {
        scope.moveCashBagAction = 'merge';  // cash bag API stubbed to return two records
        scope.moveSearch = { storeNumber: '123', scheduleDate: '10/20/2015' };
        scope.searchForMoveCashBag();
        scope.$digest();
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });

      it('should not set targetRecordForMoveCashBag if there is only one result', function () {
        scope.moveCashBagAction = 'reallocate';  // storeInstance API stubbed to return one record above
        scope.moveSearch = { storeNumber: '123', scheduleDate: '10/20/2015' };
        scope.searchForMoveCashBag();
        scope.$digest();
        expect(scope.targetRecordForMoveCashBag).not.toEqual(null);
      });

    });

    describe('classes for selected records', function () {
      beforeEach(function () {
        scope.targetRecordForMoveCashBag = { id: 1 };
      });

      it('should return colored and selected rows for the selected target', function () {
        var mockSelectedRecord = scope.targetRecordForMoveCashBag;
        var background = scope.getClassesForSingleSelectedRow(mockSelectedRecord, 'background', 'cashBag');
        var buttonIcon = scope.getClassesForSingleSelectedRow(mockSelectedRecord, 'buttonIcon', 'cashBag');
        expect(background).toEqual('bg-success');
        expect(buttonIcon).toEqual('fa fa-check-circle');
      });

      it('should return white deselected rows for non selected records', function () {
        var mockNonSelectedRecord = { id: 5 };
        var background = scope.getClassesForSingleSelectedRow(mockNonSelectedRecord, 'background', 'cashBag');
        var buttonIcon = scope.getClassesForSingleSelectedRow(mockNonSelectedRecord, 'buttonIcon', 'cashBag');
        expect(background).toEqual('');
        expect(buttonIcon).toEqual('fa fa-circle-thin');
      });
    });

    describe('select record', function () {
      it('should set targetRecordForMoveCashBag to given record', function () {
        var mockRecord = { id: 1 };
        scope.targetRecordForMoveCashBag = null;
        scope.selectRecordForMoveCashBag(mockRecord);
        expect(scope.targetRecordForMoveCashBag).toEqual(mockRecord);
      });
    });

    describe('reallocate cash bag', function () {
      it('should reallocate target cash bag to new store instance', function () {
        scope.targetRecordForMoveCashBag = { id: 2 };
        scope.cashBagToMove = {
          id: 1,
          bankRefNumber: '2',
          dailyExchangeRateId: 3,
          cashBag: '4',
          scheduleDate: '2016/03/13',
          retailCompanyId: 5,
          scheduleNumber: '6',
          isSubmitted: true
        };
        scope.$digest();

        scope.reallocateCashBag();

        expect(cashBagFactory.reallocateCashBag).toHaveBeenCalledWith(1, 2);
      });
    });

    describe('merge cash bag', function () {
      it('should merge target cash bag to new store instance', function () {
        scope.targetRecordForMoveCashBag = { id: 2 };
        scope.cashBagToMove = {
          id: 1,
          bankRefNumber: '2',
          dailyExchangeRateId: 3,
          cashBag: '4',
          scheduleDate: '2016/03/13',
          retailCompanyId: 5,
          scheduleNumber: '6',
          isSubmitted: true
        };
        scope.$digest();

        scope.mergeCashBag();

        expect(cashBagFactory.mergeCashBag).toHaveBeenCalledWith(1, 2);
      });

      it('should decide if can be merged or not', function () {
        expect(scope.canMerge()).toBeFalsy();
        expect(scope.canMerge({ isManual: true })).toBeFalsy();
        expect(scope.canMerge({ bankRefNumber: '123' })).toBeFalsy();
        expect(scope.canMerge({ bankRefNumber: '123' })).toBeFalsy();
        expect(scope.canMerge({ })).toBeTruthy();
      });
    });
  });

  describe('Add schedules', function () {
    describe('clear search data', function () {
      it('should clear search query and results', function () {
        scope.scheduleSearch = { scheduleNumber: 1 };
        scope.newScheduleSelection = { id: 1 };
        scope.searchScheduleResults = [{ id: 1 }];
        scope.clearScheduleSelections();
        expect(scope.scheduleSearch).toEqual({});
        expect(scope.newScheduleSelection).toEqual(null);
        expect(scope.searchScheduleResults).toEqual(null);
      });
    });

    describe('select search record', function () {
      it('should set targetRecordForMoveCashBag to given record', function () {
        var mockRecord = { id: 1 };
        scope.newScheduleSelection = null;
        scope.selectRecordForNewSchedule(mockRecord);
        expect(scope.newScheduleSelection).toEqual(mockRecord);
      });
    });

    describe('search for schedule', function () {
      beforeEach(function () {
        scope.newScheduleSelection = null;
        scope.moveCashBagSearchResults = null;
      });

      it('should getSchedules', function () {
        scope.scheduleSearch = { scheduleNumber: '123', scheduleDate: '10/20/2015' };
        scope.searchForSchedule();
        expect(postTripFactory.getPostTripDataList).toHaveBeenCalledWith('fakeCompanyId', scope.scheduleSearch);
      });

      it('should set schedule search results', function () {
        scope.scheduleSearch = { scheduleNumber: '123', scheduleDate: '10/20/2015' };
        scope.searchForSchedule();
        expect(scope.searchScheduleResults).not.toEqual(null);
      });

      it('should automatically set selection if there is only one result', function () {
        scope.scheduleSearch = { scheduleNumber: '123', scheduleDate: '10/20/2015' };
        scope.searchForSchedule();
        scope.$digest();
        expect(scope.newScheduleSelection).not.toEqual(null);
      });
    });

    describe('addOrEditSchedule schedule', function () {
      beforeEach(function () {
        scope.newScheduleSelection = null;
        scope.moveCashBagSearchResults = null;
        scope.cashBagToEdit = { id: 1 };
        scope.newScheduleSelection = { id: 2, scheduleNumber: '3', scheduleDate: '02/01/2016'};
      });

      it('should add schedule if add action is requested', function () {
        scope.addOrEditSchedule();
        expect(storeInstanceAmendFactory.addFlightSector).toHaveBeenCalledWith(1, 2);
      });

      it('should edit schedule if edit schedule is requested', function () {
        scope.scheduleToEdit = { id: 2 };
        scope.addOrEditSchedule();
        expect(storeInstanceAmendFactory.editFlightSector).toHaveBeenCalledWith(1, 2, '3', '20160201');
      });
    });
  });

  describe('Payment reports', function () {
    it('showStoreInstancePaymentReport should fetch and show store instance payment report', function () {
      scope.showStoreInstancePaymentReport();

      expect(reconciliationFactory.getPaymentReport).toHaveBeenCalled();
    });

    it('showCashBagPaymentReport should fetch and show cash bag payment report', function () {
      scope.showCashBagPaymentReport({ cashBag: 1 });

      expect(reconciliationFactory.getPaymentReport).toHaveBeenCalled();
    });
  });

  describe('Delete cash bag functions', function () {
    it ('showDeleteCashBagModal should show modal and mark cash bag for deletion', function () {
      var cashBag = { id: 1 };

      scope.showDeleteCashBagModal(cashBag);

      expect(scope.cashBagToDelete).toBe(cashBag);
    });

    it('canCashBagBeDeleted returns true if cash bag can be deleted', function () {
      expect(scope.canCashBagBeDeleted({ id: 1, canBeDeleted: true })).toBeTruthy();
      expect(scope.canCashBagBeDeleted({ id: 1, canBeDeleted: false })).toBeFalsy();
    });

    it('deleteCashBag calls storeInstanceAmendFactory.deleteCashBag', function () {
      scope.cashBagToDelete = {
        id: 1
      };
      scope.$digest();

      scope.deleteCashBag();

      expect(storeInstanceAmendFactory.deleteCashBag).toHaveBeenCalledWith(1);
    });
  });

  describe('Show modals', function () {
    it('epos modal should populate title and row column names', function () {
      scope.stockTotals = {
        totalRetail: 1,
        totalVirtual: 2,
        totalVoucher: 3,
        totalPromotion: 4
      };

      scope.$digest();

      var cashBag = { id: 2158 };

      scope.showEposModal('Regular', cashBag);
      expect(scope.modalMainTitle).toBe('Regular Product Revenue');
      expect(scope.modalTableHeader).toBe('Regular Product Name');

      scope.showEposModal('Virtual', cashBag);
      expect(scope.modalMainTitle).toBe('Virtual Product Revenue');
      expect(scope.modalTableHeader).toBe('Virtual Product Name');

      scope.showEposModal('Voucher', cashBag);
      expect(scope.modalMainTitle).toBe('Voucher Product Revenue');
      expect(scope.modalTableHeader).toBe('Voucher Product Name');

      scope.showEposModal('Promotion', cashBag);
      expect(scope.modalMainTitle).toBe('ePOS Discount');
      expect(scope.modalTableHeader).toBe('Promotion Name');
    });

    it('cash revenue modal should calculate proper items', function () {
      var cashBag = { id: 2158, cashRevenue: { amount: 10 } };
      scope.showCashRevenueModal(cashBag);

      expect(scope.cashRevenueModal).toEqual({ amount: 10 });
    });

    it('card revenue modal should assin model', function () {
      var cashBag = { id: 2158, creditRevenue: { amount: 10 } };
      scope.showCreditRevenueModal(cashBag);

      expect(scope.creditRevenueModal).toEqual({ amount: 10 });
    });

    it('discount revenue modal should assin model', function () {
      var cashBag = { id: 2158, discountRevenue: { amount: 10 } };
      scope.showDiscountRevenueModal(cashBag);

      expect(scope.discountRevenueModal).toEqual({ amount: 10 });
    });
  });

});
