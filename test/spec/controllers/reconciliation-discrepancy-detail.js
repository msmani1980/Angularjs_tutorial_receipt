'use strict';

describe('Controller: ReconciliationDiscrepancyDetail', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/stock-totals.json'));
  beforeEach(module('served/promotion-totals.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/count-types.json'));
  beforeEach(module('served/store-instance-item-list.json'));
  beforeEach(module('served/currencies.json'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/payment-report.json'));
  beforeEach(module('served/company-preferences.json'));
  beforeEach(module('served/promotion.json'));
  beforeEach(module('served/item.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/stock-item-counts.json'));
  beforeEach(module('served/ch-cash-bag.json'));

  var scope;
  var ReconciliationDiscrepancyDetail;
  var controller;
  var location;
  var reconciliationFactory;
  var storeInstanceFactory;
  var globalMenuService;
  var getStoreInstanceDetailsDeferred;
  var storeInstanceJSON;
  var getStockTotalsDeferred;
  var getStockTotalsJSON;
  var getPromotionTotalsDeferred;
  var getPromotionTotalsJSON;
  var getItemTypesListDeferred;
  var getItemTypesListJSON;
  var getCountTypesDeferred;
  var getCountTypesJSON;
  var getCHRevenueDeferred;
  var getEPOSRevenueDeferred;
  var getStoreInstanceItemListDeferred;
  var getStoreInstanceItemListJSON;
  var getCompanyGlobalCurrenciesDeferred;
  var getCompanyGlobalCurrenciesJSON;
  var getCompanyDeferred;
  var getCompanyJSON;
  var getPaymentReportDeferred;
  var getPaymentReportJSON;
  var getPromotionDeferred;
  var getPromotionJSON;
  var getItemDeferred;
  var getItemJSON;
  var getCompanyPreferencesDeferred;
  var getCompanyPreferencesJSON;
  var getStoreStatusListDeferred;
  var getStoreStatusListJSON;
  var putSaveStockItemsCountsDeferred;
  var stockItemCountsDeferred;
  var stockItemCountsJSON;
  var cashHandlerCashBagJSON;
  var routeParams;
  var dateUtility;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    inject(function (_servedStoreInstance_, _servedStockTotals_, _servedItemTypes_, _servedPromotionTotals_,
                     _servedCountTypes_, _servedStoreInstanceItemList_, _servedPromotion_, _servedItem_,
                     _servedStoreStatus_, _servedStockItemCounts_, _servedChCashBag_) {
      storeInstanceJSON = _servedStoreInstance_;
      getPromotionTotalsJSON = _servedPromotionTotals_;
      getStockTotalsJSON = _servedStockTotals_;
      getItemTypesListJSON = _servedItemTypes_;
      getCountTypesJSON = _servedCountTypes_;
      getStoreInstanceItemListJSON = _servedStoreInstanceItemList_;
      getPromotionJSON = _servedPromotion_;
      getItemJSON = _servedItem_;
      getStoreStatusListJSON = _servedStoreStatus_;
      stockItemCountsJSON = _servedStockItemCounts_;
      cashHandlerCashBagJSON = _servedChCashBag_;
    });

    inject(function (_servedCurrencies_, _servedCompany_, _servedPaymentReport_) {
      getCompanyGlobalCurrenciesJSON = _servedCurrencies_;
      getCompanyJSON = _servedCompany_;
      getPaymentReportJSON = _servedPaymentReport_;
    });

    location = $location;
    scope = $rootScope.$new();
    reconciliationFactory = $injector.get('reconciliationFactory');
    storeInstanceFactory = $injector.get('storeInstanceFactory');
    globalMenuService = $injector.get('globalMenuService');
    dateUtility = $injector.get('dateUtility');
    controller = $controller;

    getStoreStatusListDeferred = $q.defer();
    getStoreStatusListDeferred.resolve(getStoreStatusListJSON);
    spyOn(reconciliationFactory, 'getStoreStatusList').and.returnValue(getStoreStatusListDeferred.promise);

    getStoreInstanceDetailsDeferred = $q.defer();
    getStoreInstanceDetailsDeferred.resolve(storeInstanceJSON);
    spyOn(reconciliationFactory, 'getStoreInstanceDetails').and.returnValue(getStoreInstanceDetailsDeferred.promise);

    getStockTotalsDeferred = $q.defer();
    getStockTotalsDeferred.resolve(getStockTotalsJSON);
    spyOn(reconciliationFactory, 'getStockTotals').and.returnValue(getStockTotalsDeferred.promise);

    getPromotionTotalsDeferred = $q.defer();
    getPromotionTotalsDeferred.resolve(getPromotionTotalsJSON);
    spyOn(reconciliationFactory, 'getPromotionTotals').and.returnValue(getPromotionTotalsDeferred.promise);

    getItemTypesListDeferred = $q.defer();
    getItemTypesListDeferred.resolve(getItemTypesListJSON);
    spyOn(reconciliationFactory, 'getItemTypesList').and.returnValue(getItemTypesListDeferred.promise);

    getCountTypesDeferred = $q.defer();
    getCountTypesDeferred.resolve(getCountTypesJSON);
    spyOn(reconciliationFactory, 'getCountTypes').and.returnValue(getCountTypesDeferred.promise);

    getCHRevenueDeferred = $q.defer();
    getCHRevenueDeferred.resolve([cashHandlerCashBagJSON, {}, {}]);
    spyOn(reconciliationFactory, 'getCHRevenue').and.returnValue(getCHRevenueDeferred.promise);

    getEPOSRevenueDeferred = $q.defer();
    getEPOSRevenueDeferred.resolve([{}, {}, {}]);
    spyOn(reconciliationFactory, 'getEPOSRevenue').and.returnValue(getEPOSRevenueDeferred.promise);

    getStoreInstanceItemListDeferred = $q.defer();
    getStoreInstanceItemListDeferred.resolve(getStoreInstanceItemListJSON);
    spyOn(reconciliationFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemListDeferred
      .promise);

    putSaveStockItemsCountsDeferred = $q.defer();
    putSaveStockItemsCountsDeferred.resolve({});
    spyOn(reconciliationFactory, 'saveStockItemsCounts').and.returnValue(putSaveStockItemsCountsDeferred.promise);

    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesDeferred.resolve(getCompanyGlobalCurrenciesJSON);
    spyOn(reconciliationFactory, 'getCompanyGlobalCurrencies').and.returnValue(
      getCompanyGlobalCurrenciesDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(getCompanyJSON);
    spyOn(reconciliationFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getPaymentReportDeferred = $q.defer();
    getPaymentReportDeferred.resolve(getPaymentReportJSON);
    spyOn(reconciliationFactory, 'getPaymentReport').and.returnValue(getPaymentReportDeferred.promise);

    getPromotionDeferred = $q.defer();
    getPromotionDeferred.resolve(getPromotionJSON);
    spyOn(reconciliationFactory, 'getPromotion').and.returnValue(getPromotionDeferred.promise);

    getItemDeferred = $q.defer();
    getItemDeferred.resolve(getItemJSON);
    spyOn(reconciliationFactory, 'getItem').and.returnValue(getItemDeferred.promise);

    getCompanyPreferencesJSON = $injector.get('servedCompanyPreferences');
    getCompanyPreferencesDeferred = $q.defer();
    getCompanyPreferencesDeferred.resolve(getCompanyPreferencesJSON);
    spyOn(reconciliationFactory, 'getCompanyPreferences').and.returnValue(getCompanyPreferencesDeferred.promise);

    spyOn(globalMenuService.company, 'get').and.returnValue(666);

    stockItemCountsDeferred = $q.defer();
    stockItemCountsDeferred.resolve(stockItemCountsJSON);

    spyOn(reconciliationFactory, 'getStockItemCounts').and.returnValue(stockItemCountsDeferred.promise);

    routeParams = {
      storeInstanceId: 'fakeStoreInstanceId'
    };
    ReconciliationDiscrepancyDetail = controller('ReconciliationDiscrepancyDetail', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  describe('init', function () {

    it('should call getStoreInstanceDetails', function () {
      expect(reconciliationFactory.getStoreInstanceDetails).toHaveBeenCalledWith(routeParams.storeInstanceId);
    });

    describe('dependencies', function () {
      beforeEach(function () {
        scope.$digest();
      });

      it('should localize date to mm/dd/yyy', function () {
        expect(scope.storeInstance.scheduleDate).toBe(dateUtility.formatDateForApp(storeInstanceJSON.scheduleDate));
      });

      it('should call getItemTypesList', function () {
        expect(reconciliationFactory.getItemTypesList).toHaveBeenCalled();
      });

      it('should call getCountTypes', function () {
        expect(reconciliationFactory.getCountTypes).toHaveBeenCalled();
      });

      it('should call getStockTotals', function () {
        expect(reconciliationFactory.getStockTotals).toHaveBeenCalled();
      });

      it('should call getPromotionTotals', function () {
        expect(reconciliationFactory.getPromotionTotals).toHaveBeenCalled();
      });

      it('should call getCHRevenue', function () {
        expect(reconciliationFactory.getCHRevenue).toHaveBeenCalled();
      });

      it('should call getEPOSRevenue', function () {
        expect(reconciliationFactory.getEPOSRevenue).toHaveBeenCalled();
      });

      it('should call getCompanyGlobalCurrencies', function () {
        expect(reconciliationFactory.getCompanyGlobalCurrencies).toHaveBeenCalled();
      });

      it('should call getCompany', function () {
        expect(reconciliationFactory.getCompany).toHaveBeenCalled();
      });

      it('should call getStoreInstanceItemList', function () {
        expect(reconciliationFactory.getStoreInstanceItemList).toHaveBeenCalled();
      });

      it('should call getStoreStatusList', function () {
        expect(reconciliationFactory.getStoreStatusList).toHaveBeenCalled();
      });

      it('should init tables to only show discrepancies', function () {
        expect(scope.showLMPDiscrepancies).toEqual(true);
        expect(scope.showCashBagDiscrepancies).toEqual(true);
      });

      it('should init tables to not be in edit mode', function () {
        expect(scope.editLMPStockTable).toEqual(false);
        expect(scope.editCashBagTable).toEqual(false);
      });

      it('should init each object with a revision object for editing', function () {
        expect(scope.stockItemList).toBeDefined();
        expect(scope.stockItemList[0].revision.itemName).toEqual(scope.stockItemList[0].itemName);
      });

      describe('cash bag init', function () {
        it('should contain cash bag number, epos calculated amount, paper and coin amounts directly from response', function () {
          scope.$digest();
          var expectedCashBag = jasmine.objectContaining({
            cashBagNumber: cashHandlerCashBagJSON.response[0].cashbagNumber,
            eposCalculatedAmount: cashHandlerCashBagJSON.response[0].eposCalculatedAmount.toString(),
            paperAmount: cashHandlerCashBagJSON.response[0].paperAmountManualCh.toString(),
            coinAmount: cashHandlerCashBagJSON.response[0].coinAmountManualCh.toString()
          });
          expect(scope.cashBags[0]).toEqual(expectedCashBag);
        });

        it('should calculate crew amount by summing epos paper and coin amounts', function () {
          var expectedCrewAmount = (cashHandlerCashBagJSON.response[0].paperAmountEpos + cashHandlerCashBagJSON.response[0].coinAmountEpos).toString();
          expect(scope.cashBags[0].crewAmount).toEqual(expectedCrewAmount);
        });

        it('should set bank or paper exchange rate from bank or paper exchange rate', function () {
          var expectedPaperExchangeRate = (cashHandlerCashBagJSON.response[0].chPaperExchangeRate).toString();
          var expectedBankExchangeRate = (cashHandlerCashBagJSON.response[1].chBankExchangeRate).toString();
          expect(scope.cashBags[0].bankOrPaperExchangeRate).toEqual(expectedPaperExchangeRate);
          expect(scope.cashBags[1].bankOrPaperExchangeRate).toEqual(expectedBankExchangeRate);
        });

        it('should set isPaperAndCoinExchangeRatePreferred to true if any record prefers paper & coin over bank', function () {
          scope.$digest();
          expect(scope.isPaperAndCoinExchangeRatePreferred).toEqual(true);
        });
      });
    });

    describe('filteredLMPStock', function () {
      beforeEach(function () {
        scope.$digest();
      });

      it('should have a LMP stock item list attached to scope', function () {
        expect(scope.stockItemList.length).toBeGreaterThan(0);
      });

      it('should have a valid, finite variance value', function () {
        var expectedVariance = jasmine.objectContaining({
          varianceValue: '0.00'
        });
        expect(scope.stockItemList[0]).toEqual(expectedVariance);
      });
    });

  });

  describe('company preferences', function () {
    it('should set the cash preference to false if found and date < today', function () {
      ReconciliationDiscrepancyDetail.companyPreferences = [{
        isSelected: true,
        choiceName: 'Active',
        optionCode: 'CSL',
        optionName: 'Cashless',
        startDate: '2015-01-01'
      }];
      expect(ReconciliationDiscrepancyDetail.checkIfCompanyUseCash()).toBeFalsy();
    });

    it('should set the cash preference to true if most recent is turned off', function () {
      ReconciliationDiscrepancyDetail.companyPreferences = [{
        isSelected: false,
        choiceName: 'Active',
        optionCode: 'CSL',
        optionName: 'Cashless',
        startDate: '2015-10-10'
      }, {
        isSelected: true,
        choiceName: 'Active',
        optionCode: 'CSL',
        optionName: 'Cashless',
        startDate: '2015-01-01'
      }];
      expect(ReconciliationDiscrepancyDetail.checkIfCompanyUseCash()).toBeTruthy();
    });

    it('should set the cash preference to true if found and date > today', function () {
      ReconciliationDiscrepancyDetail.companyPreferences = [{
        isSelected: true,
        choiceName: 'Active',
        optionCode: 'CSL',
        optionName: 'Cashless',
        startDate: '2017-01-01'
      }];
      expect(ReconciliationDiscrepancyDetail.checkIfCompanyUseCash()).toBeTruthy();
    });

    it('should set the cash preference to true if no preference is found', function () {
      ReconciliationDiscrepancyDetail.companyPreferences = [{
        choiceName: 'Active',
        optionCode: 'fakeCode',
        optionName: 'fakeOption'
      }];
      expect(ReconciliationDiscrepancyDetail.checkIfCompanyUseCash()).toBeTruthy();
    });
  });

  describe('edit table functions', function () {
    describe('row editing', function () {
      var mockItem;

      describe('edit init', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2
          };
          scope.$digest();
        });

        it('should set item.isEditing to true', function () {
          scope.editItem(mockItem);
          expect(mockItem.isEditing).toEqual(true);
        });

        it('should init item revision to equal current item properties', function () {
          var expectedRevisionObject = angular.copy(mockItem);
          scope.editItem(mockItem);
          expect(mockItem.revision).toEqual(expectedRevisionObject);
        });
      });

      describe('saveItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2
          };
          scope.editItem(mockItem);
          mockItem.revision = {
            itemName: 'newName',
            quantity: 3
          };
          scope.saveItem(mockItem);
          scope.$digest();
        });

        it('should set item properties to revision properties', function () {
          expect(mockItem.itemName).toEqual('newName');
          expect(mockItem.quantity).toEqual(3);
        });

        it('should item.isEditing to false', function () {
          expect(mockItem.isEditing).toEqual(false);
        });

        it('should clear revision object', function () {
          expect(mockItem.revision).toEqual({});
        });
      });

      describe('saveStockItemCounts', function () {
        beforeEach(function () {
          mockItem = {
            storeInstanceId: 1,
            itemMasterId: 2,
            itemName: 'testItem',
            dispatchedCount: 3,
            replenishCount: 4,
            inboundOffloadCount: 5,
            revision: {
              itemName: 'testItem',
              dispatchedCount: 30,
              replenishCount: 40,
              inboundOffloadCount: 50
            }
          };
          scope.saveStockItemCounts(mockItem);
          scope.$digest();
        });

        it('should call saveStockItemsCounts with new item counts', function () {
          var expectedPayload = [{
            storeInstanceId: 1,
            replenishStoreInstanceId: undefined,
            itemMasterId: 2,
            dispatchedCount: 30,
            replenishCount: 40,
            inboundedCount: 0,
            offloadCount: 50,
            companyId: undefined,
            itemId: undefined,
            cateringStationId: undefined,
            cciStagId: undefined,
            ullageReasonCode: undefined
          }];
          expect(reconciliationFactory.saveStockItemsCounts).toHaveBeenCalledWith(expectedPayload);
        });
      });

      describe('revertItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2,
            isEditing: true,
            revision: {
              itemName: 'newItem',
              quantity: 3
            }
          };
          scope.revertItem(mockItem);
          scope.$digest();
        });

        it('should revert revision properties to original properties', function () {
          expect(mockItem.revision.itemName).toEqual('testItem');
          expect(mockItem.revision.quantity).toEqual(2);
        });

        it('should not change item.isEditing property', function () {
          expect(mockItem.isEditing).toEqual(true);
        });
      });

      describe('cancelEditItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2,
            isEditing: true,
            revision: {
              itemName: 'newItem',
              quantity: 3
            }
          };
          scope.cancelEditItem(mockItem, true);
          scope.$digest();
        });

        it('should set item.isEditing to false', function () {
          expect(mockItem.isEditing).toEqual(false);
        });

        it('should not save item.revision properties', function () {
          expect(mockItem.revision).toEqual({});
        });
      });
    });

    describe('table editing', function () {
      describe('edit init', function () {
        beforeEach(function () {
          scope.stockItemList = [{
            itemName: 'item1',
            quantity: 1
          }, {
            itemName: 'item2',
            quantity: 2
          }];
          scope.cashBags = angular.copy(scope.stockItemList);
        });

        it('should put table in edit mode', function () {
          scope.initEditTable(true);
          expect(scope.editLMPStockTable).toEqual(true);
        });

        it('should init revisions to equal current data', function () {
          var expectedRevisionObject = angular.copy(scope.stockItemList[0]);
          scope.initEditTable(true);
          expect(scope.stockItemList[0].revision).toEqual(expectedRevisionObject);
        });

        it('should make changes to cash bag table if isLMPTable is false', function () {
          var expectedRevisionObject = angular.copy(scope.cashBags[0]);
          scope.initEditTable(false);
          expect(scope.editCashBagTable).toEqual(true);
          expect(scope.cashBags[0].revision).toEqual(expectedRevisionObject);
        });
      });

      describe('save', function () {
        beforeEach(function () {
          scope.stockItemList = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }, {
            itemName: 'item2',
            quantity: 2,
            revision: {
              itemName: 'newItem2',
              quantity: 4
            }
          }];
          scope.cashBags = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }];
        });

        it('should set all data to revision data', function () {
          scope.saveTable(true);
          expect(scope.stockItemList[0].itemName).toEqual('item1');
          expect(scope.stockItemList[0].quantity).toEqual(1);
          expect(scope.stockItemList[1].itemName).toEqual('item2');
          expect(scope.stockItemList[1].quantity).toEqual(2);
        });

        it('should revert table to not be in edit mode', function () {
          scope.saveTable(true);
          expect(scope.editLMPStockTable).toEqual(false);
        });

        it('should make expected changes to cashBags object if isLMPTable is false', function () {
          scope.saveTable(false);
          expect(scope.editCashBagTable).toEqual(false);
          expect(scope.cashBags[0].itemName).toEqual('newItem1');
          expect(scope.cashBags[0].quantity).toEqual(3);
        });
      });

      describe('cancel editing table', function () {
        beforeEach(function () {
          scope.stockItemList = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }, {
            itemName: 'item2',
            quantity: 2,
            revision: {
              itemName: 'newItem2',
              quantity: 4
            }
          }];
          scope.cashBags = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }];
        });

        it('should clear revision data', function () {
          scope.cancelEditingTable(true);
          expect(scope.stockItemList[0].itemName).toEqual('item1');
          expect(scope.stockItemList[0].quantity).toEqual(1);
          expect(scope.stockItemList[0].revision).toEqual({
            itemName: 'newItem1',
            quantity: 3
          });
        });

        it('should revert table to not be in edit mode', function () {
          scope.cancelEditingTable(true);
          expect(scope.editLMPStockTable).toEqual(false);
        });

        it('should make expected changes to cashBags object if isLMPTable is false', function () {
          scope.cancelEditingTable(false);
          expect(scope.editCashBagTable).toEqual(false);
          expect(scope.cashBags[0].itemName).toEqual('item1');
          expect(scope.cashBags[0].quantity).toEqual(1);
          expect(scope.cashBags[0].revision).toEqual({});
        });
      });
    });

  });

  describe('show modal', function () {
    it('should show the modal', function () {
      scope.$digest();
      scope.showModal('Virtual');
      expect(scope.modalTotal).toBe('0.00');
    });

    it('should not add modalMainTitle to scope', function () {
      scope.$digest();
      scope.showModal('nonExistingKey');
      expect(scope.modalMainTitle).toBeUndefined();
    });

    it('should attach modalMainTitle to scope', function () {
      scope.$digest();
      scope.showModal('Virtual');
      expect(scope.modalMainTitle).toBeDefined();
    });

  });

  describe('scope helper functions', function () {
    describe('canEdit', function () {
      it('should return false when store instance is not defined', function () {
        scope.storeInstance = null;
        expect(scope.canEdit()).toEqual(false);
      });
      it('should return true when store instance status is not commission paid', function () {
        scope.storeInstance = {
          statusName: 'fakeStatusName'
        };
        expect(scope.canEdit()).toEqual(true);
        scope.storeInstance = {
          statusName: 'Commission Paid'
        };
        expect(scope.canEdit()).toEqual(false);
      });
    });

    describe('update orderBy', function () {
      it('should change sort title to given title', function () {
        scope.LMPSortTitle = 'oldSortName';
        scope.updateOrderBy('newSortName', true);
        expect(scope.LMPSortTitle).toEqual('newSortName');
      });

      it('should not update LMPSortTitle if isLMP is false', function () {
        scope.cashBagSortTitle = 'oldCashSortName';
        scope.LMPSortTitle = 'lmpSortName';
        scope.updateOrderBy('newSortName', false);
        expect(scope.LMPSortTitle).toEqual('lmpSortName');
        expect(scope.cashBagSortTitle).toEqual('newSortName');
      });

      it('should reverse sort direction if already sorting on given name', function () {
        scope.LMPSortTitle = 'sortName';
        scope.updateOrderBy('sortName', true);
        expect(scope.LMPSortTitle).toEqual('-sortName');
      });

    });

    describe('getArrowType', function () {
      it('should return descending if sort title is negative', function () {
        scope.LMPSortTitle = '-sortName';
        var arrowType = scope.getArrowType('sortName', true);
        expect(arrowType).toEqual('descending');
      });

      it('should return ascending if sort title is not negative', function () {
        scope.LMPSortTitle = 'sortName';
        var arrowType = scope.getArrowType('sortName', true);
        expect(arrowType).toEqual('ascending');
      });

      it('should return none if sort title is not the given name', function () {
        scope.LMPSortTitle = 'sortName';
        var arrowType = scope.getArrowType('otherName', true);
        expect(arrowType).toEqual('none');
      });

      it('should check against cashBagSortTitle if isLMP is false', function () {
        scope.LMPSortTitle = 'sortName';
        scope.cashBagSortTitle = 'cashSortName';
        var arrowType = scope.getArrowType('sortName', false);
        expect(arrowType).toEqual('none');
      });
    });

    describe('showEditViewForItem', function () {
      var mockItem;
      beforeEach(function () {
        scope.editLMPStockTable = false;
        scope.editCashBagTable = false;
        mockItem = {
          isEditing: true
        };
      });

      it('should return true if item is editing', function () {
        var showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(true);
        mockItem.isEditing = false;
        showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(false);
      });

      it('should return true if table is editing', function () {
        scope.editLMPStockTable = true;
        mockItem.isEditing = false;
        var showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(true);
      });

      it('should check against cash bag table if isLMP is false', function () {
        scope.editLMPStockTable = false;
        scope.editCashBagTable = true;
        mockItem.isEditing = false;
        var showEdit = scope.showEditViewForItem(mockItem, false);
        expect(showEdit).toEqual(true);
      });
    });

    describe('$scope.isInStatus method', function () {
      beforeEach(function () {
        scope.statusList = getStoreStatusListJSON;
      });

      it('should return false if nothing passed as status', function () {
        expect(scope.isInStatus()).toBeFalsy();
      });

      it('should return true if matching', function () {
        scope.storeInstance = {
          statusName: 'Discrepencies'
        };
        expect(scope.isInStatus('Discrepencies')).toBeTruthy();
      });

      it('should return true if matching', function () {
        scope.storeInstance = {
          statusName: 'Confirmed'
        };
        expect(scope.isInStatus('Confirmed')).toBeTruthy();
      });

      it('should return true if matching', function () {
        scope.storeInstance = {
          statusName: 'Discrepencies'
        };
        expect(scope.isInStatus('Confirmed')).toBeFalsy();
      });
    });

    describe('$scope.performAction method', function () {
      beforeEach(function () {
        scope.statusList = getStoreStatusListJSON;
        spyOn(storeInstanceFactory, 'updateStoreInstanceStatus');
      });
      it('should return false if nothing passed as status', function () {
        scope.storeInstance = {
          statusName: 'Confirmed',
          id: '1'
        };
        scope.confirmAction('Discrepancies', 'Unconfirm');
        scope.performAction('Discrepancies');
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith('1', '9');
      });

    });

  });


});
