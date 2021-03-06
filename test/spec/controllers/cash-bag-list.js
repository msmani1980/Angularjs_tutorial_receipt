'use strict';

describe('Controller: CashBagListCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/cash-bag-list.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules-daily.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules-daily.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/stores-list.json'));
  beforeEach(module('served/schedules-date-range.json'));

  var CashBagListCtrl;
  var scope;
  var companyId;
  var cashBagFactory;
  var location;
  var dateUtility;
  var localStorage;

  var stationsListDeferred;
  var schedulesListDeferred;
  var schedulesDailyDeferred;
  var getStoreInstanceListDeferred;
  var getStoreListDeferred;
  var getSchedulesInDateRangeDeferred;

  var stationsResponseJSON;
  var cashBagListResponseJSON;
  var schedulesResponseJSON;
  var schedulesDailyResponseJSON;
  var storeInstanceListJSON;
  var storeListJSON;
  var schedulesDateRangeJSON;

  var checkForDailyExchangeRate;

  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location) {
    inject(function(_servedCashBagList_, _servedStations_, _servedSchedules_, _servedSchedulesDaily_,
      _servedStoreInstanceList_, _servedStoresList_, _servedSchedulesDateRange_) {
      cashBagListResponseJSON = _servedCashBagList_;
      stationsResponseJSON = _servedStations_;
      schedulesResponseJSON = _servedSchedules_;
      schedulesDailyResponseJSON = _servedSchedulesDaily_;
      storeInstanceListJSON = _servedStoreInstanceList_;
      storeListJSON = _servedStoresList_;
      schedulesDateRangeJSON = _servedSchedulesDateRange_;
    });

    location = $location;
    cashBagFactory = $injector.get('cashBagFactory');
    dateUtility = $injector.get('dateUtility');
    localStorage = $injector.get('$localStorage');
    scope = $rootScope.$new();

    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsResponseJSON);

    schedulesListDeferred = $q.defer();
    schedulesListDeferred.resolve(schedulesResponseJSON);

    getStoreInstanceListDeferred = $q.defer();
    getStoreInstanceListDeferred.resolve(storeInstanceListJSON);

    schedulesDailyDeferred = $q.defer();
    schedulesDailyDeferred.resolve(schedulesDailyResponseJSON);

    getStoreListDeferred = $q.defer();
    getStoreListDeferred.resolve(storeListJSON);

    getSchedulesInDateRangeDeferred = $q.defer();
    getSchedulesInDateRangeDeferred.resolve(getSchedulesInDateRangeDeferred);

    spyOn(cashBagFactory, 'getCashBagList').and.callFake(function() {
      var defer = $q.defer();
      defer.resolve(cashBagListResponseJSON);

      return defer.promise;
    });

    spyOn(cashBagFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesList').and.returnValue(schedulesListDeferred.promise);
    spyOn(cashBagFactory, 'getDailySchedulesList').and.returnValue(schedulesDailyDeferred.promise);
    spyOn(cashBagFactory, 'getStoreInstanceList').and.returnValue(getStoreInstanceListDeferred.promise);

    spyOn(cashBagFactory, 'getStoreList').and.returnValue(getStoreListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesInDateRange').and.returnValue(getSchedulesInDateRangeDeferred.promise);

    spyOn(cashBagFactory, 'getCompanyId').and.returnValue('fakeCompanyId');
    spyOn(cashBagFactory, 'deleteCashBag').and.returnValue({
      then: function() {
        return;
      }
    });

    checkForDailyExchangeRate = $q.defer();
    checkForDailyExchangeRate.resolve({});
    scope.checkForDailyExchangeRate = function() {
      return checkForDailyExchangeRate.promise;
    };

    CashBagListCtrl = $controller('CashBagListCtrl', {
      $scope: scope
    });
    spyOn(scope, 'editCashBag').and.callThrough();

    companyId = cashBagFactory.getCompanyId();
    scope.$digest();
  }));

  describe('scope globals', function() {
    it('should have cashBagList attached to scope', function() {
      expect(scope.cashBagList).toBeDefined();
    });

    it('should have viewName attached to scope', function() {
      expect(scope.viewName).toBeDefined();
    });

  });

  describe('cash bag constructor calls', function() {
    describe('get station list', function() {
      it('should call getStationList with companyId', function() {
        expect(cashBagFactory.getStationList).toHaveBeenCalledWith(companyId);
      });

      it('should have stationList attached to scope', function() {
        expect(scope.stationList).toBeDefined();
      });
    });

    describe('get schedule list', function() {
      it('should call getSchedulesList with companyId', function() {
        expect(cashBagFactory.getSchedulesList).toHaveBeenCalledWith(companyId);
      });

      it('should have schedulesList attached to scope', function() {
        expect(scope.schedulesList).toBeDefined();
      });
    });
  });

  describe('cashBagList scope functions', function() {
    describe('search cash bag', function() {
      it('should have a search object attached to scope', function() {
        expect(scope.search).toBeDefined();
      });

      it('should call get CashBagList with params', function() {
        scope.loadCashBagList();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {
          isDelete: false,
          limit: 100,
          offset: 0
        });
      });

      it('should call get CashBagList with search params', function() {
        var testCashBagNumber = '123';
        scope.search = {
          cashBagNumber: testCashBagNumber
        };
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {
          cashBagNumber: testCashBagNumber,
          isDelete: false,
          limit: 100,
          offset: 0
        });
      });

      it('should send searchDate with yyyymmdd format', function() {
        scope.search = {
          startDate: '06/20/2015'
        };
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {
          startDate: '20150620',
          endDate: '20150620',
          isDelete: false,
          limit: 100,
          offset: 0
        });
      });

      it('should not send empty search parameters', function () {
        scope.search = {
          storeInstanceId: '',
          cashBagNumber: '234'
        };
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {
          cashBagNumber: '234',
          isDelete: false,
          limit: 100,
          offset: 0
        });
      });

      it('should clear search model should not make api call', function() {
        scope.search = {
          cashBagNumber: 'fakeCashBagNumber'
        };
        scope.clearForm();
        expect(scope.search.cashBagNumber).toBe(undefined);
        expect(scope.cashBagList).toEqual([]);
      });

      it('should redirect to edit page if search result is 1 and cashBag is valid for redirect to edit', function() {
        cashBagListResponseJSON = {
          cashBags: [
            {
              id: 8888,
              cashBagNumber: '1',
              isSubmitted: false,
              isDelete: false
            }
          ],
          meta: {
            count: 1,
            limit: 1,
            start: 0
          }
        };
        scope.search = {
          cashBagNumber: cashBagListResponseJSON.cashBags[0].cashBagNumber
        };

        scope.loadCashBagList();
        scope.$digest();
        expect(localStorage.isEditFromList).toBe(true);
        expect(scope.editCashBag).toHaveBeenCalledWith(scope.cashBagList[0]);
      });

      it('should not redirect to edit page if cashBag has flag isDelete = true', function() {
        cashBagListResponseJSON = {
          cashBags: [
            {
              id: 8888,
              cashBagNumber: '1',
              isSubmitted: false,
              isDelete: true
            }
          ],
          meta: {
            count: 1,
            limit: 1,
            start: 0
          }
        };
        scope.search = {
          cashBagNumber: cashBagListResponseJSON.cashBags[0].cashBagNumber
        };

        scope.loadCashBagList();
        scope.$digest();
        expect(localStorage.isEditFromList).toBeUndefined();
      });

      it('should not redirect to edit page if cashBag has flag isSubmitted = true', function() {
        cashBagListResponseJSON = {
          cashBags: [
            {
              id: 8888,
              cashBagNumber: '1',
              isSubmitted: true,
              isDelete: false
            }
          ],
          meta: {
            count: 1,
            limit: 1,
            start: 0
          }
        };
        scope.search = {
          cashBagNumber: cashBagListResponseJSON.cashBags[0].cashBagNumber
        };

        scope.loadCashBagList();
        scope.$digest();
        expect(localStorage.isEditFromList).toBeUndefined();
      });

      it('should not redirect to edit page if response meta.count > 1', function() {
        cashBagListResponseJSON = {
          cashBags: [
            {
              id: 8888,
              cashBagNumber: '1',
              isSubmitted: false,
              isDelete: false
            },
            {
              id: 8889,
              cashBagNumber: '2',
              isSubmitted: false,
              isDelete: false
            }
          ],
          meta: {
            count: 2,
            limit: 2,
            start: 0
          }
        };
        scope.search = {
          cashBagNumber: cashBagListResponseJSON.cashBags[0].cashBagNumber
        };

        scope.loadCashBagList();
        scope.$digest();
        expect(localStorage.isEditFromList).toBeUndefined();
      });
    });

    describe('store instance', function() {
      it('should not call getStoreInstanceList if no fields selected', function() {
        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).not.toHaveBeenCalled();
        expect(scope.displayModalError).toBe(false);
      });

      it('should not call getStoreInstanceList if only date is selected', function() {
        scope.search.scheduleDate = '06/15/2015';
        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).toHaveBeenCalled();
        expect(scope.displayModalError).toBe(false);
      });

      it('should call getStoreInstanceList with date and schedule number', function() {
        scope.search.scheduleDate = '06/15/2015';
        scope.search.selectedSchedule = {
          scheduleNumber: '0008'
        };
        var expectedPayload = {
          startDate: dateUtility.formatDateForAPI(scope.search.scheduleDate),
          endDate: dateUtility.formatDateForAPI(scope.search.scheduleDate),
          scheduleNumber: scope.search.selectedSchedule.scheduleNumber
        };

        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload,
          'fakeCompanyId');
        expect(scope.displayModalError).toBe(false);
      });

      it('should call getStoreInstanceList with date and store number', function() {
        scope.search.scheduleDate = '06/15/2015';
        scope.search.selectedStoreNumber = {
          id: 'store001'
        };

        var expectedPayload = {
          startDate: dateUtility.formatDateForAPI(scope.search.scheduleDate),
          endDate: dateUtility.formatDateForAPI(scope.search.scheduleDate),
          storeId: scope.search.selectedStoreNumber.id
        };

        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload,
          'fakeCompanyId');
        expect(scope.displayModalError).toBe(false);
      });
    });

    describe('search store and schedules when date changes', function() {

      var expectedScheduleDate;

      beforeEach(function() {
        scope.search.scheduleDate = '06/15/2015';
        expectedScheduleDate = dateUtility.formatDateForAPI(scope.search.scheduleDate);
        scope.$digest();
      });

      it('should call getStoreList when date changes', function() {
        var expectedPayload = {
          startDate: expectedScheduleDate,
          endDate: expectedScheduleDate
        };
        expect(cashBagFactory.getStoreList).toHaveBeenCalledWith(expectedPayload, 'fakeCompanyId');
      });

      it('should call getSchedulesInDateRange when date changes', function() {
        expect(cashBagFactory.getSchedulesInDateRange).toHaveBeenCalledWith(companyId,
          expectedScheduleDate, expectedScheduleDate);
      });

    });

    describe('redirect to edit page', function () {
      it('should show search store instance popup if storeInstanceId is null', function () {
        var mockCashBag = {
          id: 123,
          storeInstanceId: null
        };

        scope.editCashBag(mockCashBag);
        scope.$digest();
        expect(location.path()).toBe('/cash-bag/edit/123');

      });

      it('should redirect to edit page if storeInstanceId is not null', function () {
        var mockCashBag = {
          id: 123,
          storeInstanceId: 123
        };

        scope.editCashBag(mockCashBag);
        scope.$digest();
        expect(location.path()).toBe('/cash-bag/edit/123');
      });

    });

    describe('continueToEditOrCreate form', function() {
      it('should call redirect to cash bag with store instance as parameter', function() {
        var storeInstance = {
          id: 'fakeStoreInstanceId'
        };
        var expectedParameters = {
          storeInstanceId: 'fakeStoreInstanceId'
        };

        scope.popupFromEdit = false;
        scope.continueToEditOrCreate(storeInstance);

        expect(location.path()).toBe('/cash-bag/create');
        expect(location.search()).toEqual(expectedParameters);
      });

      it('should stay on the same url if store instance is invalid', function() {
        scope.continueToEditOrCreate();
        expect(location.path()).not.toBe('/cash-bag/create');
      });

      it('should be able to redirect from cash bag', function () {
        var storeInstance = {
          id: 'fakeStoreInstanceId'
        };
        var expectedParameters = {
          storeInstanceId: 'fakeStoreInstanceId'
        };

        scope.popupFromEdit = true;
        scope.cashBagToEdit = 123;
        scope.continueToEditOrCreate(storeInstance);

        expect(location.path()).toBe('/cash-bag/edit/123');
        expect(location.search()).toEqual(expectedParameters);
      });

    });

    describe('isCashBagEditable', function() {
      var testCashBag = {};
      it('should return true if cash bag has not been submitted', function() {
        testCashBag.isSubmitted = false;
        testCashBag.isDelete = false;
        expect(scope.isCashBagEditable(testCashBag)).toEqual(true);
        testCashBag.isSubmitted = true;
        expect(scope.isCashBagEditable(testCashBag)).toEqual(false);
      });

      it('should return true if cash bag has not been deleted', function() {
        testCashBag.isSubmitted = false;
        testCashBag.isDelete = false;
        expect(scope.isCashBagEditable(testCashBag)).toEqual(true);
        testCashBag.isDelete = true;
        expect(scope.isCashBagEditable(testCashBag)).toEqual(false);
      });
    });
  });

  describe('helper functions', function() {
    describe('error message functions', function() {

    });
  });

  describe('Action buttons', function() {
    it('should have a viewCashBag function in scope', function() {
      expect(scope.viewCashBag).toBeDefined();
    });

    it('should change the url based on the menu object to view a cash bag', function() {
      scope.viewCashBag({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/view/1');
    });

    it('should have an editCashBag function in scope', function() {
      expect(scope.editCashBag).toBeDefined();
    });

    it('should have a editCashBag callable function', function() {
      expect(Object.prototype.toString.call(scope.editCashBag)).toBe('[object Function]');
    });

    it('should change the url based on the menu object to edit a cash bag', function() {
      scope.editCashBag({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/edit/1');
    });
  });

  describe('hideCreatePopup', function() {
    beforeEach(function() {
      scope.search.selectedSchedule = ['test'];
      scope.search.selectedStoreNumber = ['test'];
      scope.search.scheduleDate = '20150330';
      scope.hideCreatePopup();
    });

    it('should call the private function clearPopupSearch and clear the scheduleDate', function() {
      expect(scope.search.scheduleDate).toBe(undefined);
    });

    it('should call the private function clearPopupSearch and clear the selectedStoreNumber', function() {
      expect(scope.search.selectedStoreNumber).toBe(undefined);
    });

    it('should call the private function clearPopupSearch and clear the selectedSchedule', function() {
      expect(scope.search.selectedSchedule).toBe(undefined);
    });
  });


});
