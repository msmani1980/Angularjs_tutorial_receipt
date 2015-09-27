'use strict';

fdescribe('Controller: CashBagListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/cash-bag-list.json'));
  beforeEach(module('served/stations.json'));
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

  var getCashBagListDeferred;
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedCashBagList_, _servedStations_, _servedSchedules_, _servedSchedulesDaily_, _servedStoreInstanceList_, _servedStoresList_, _servedSchedulesDateRange_) {
      cashBagListResponseJSON    = _servedCashBagList_;
      stationsResponseJSON       = _servedStations_;
      schedulesResponseJSON      = _servedSchedules_;
      schedulesDailyResponseJSON = _servedSchedulesDaily_;
      storeInstanceListJSON      = _servedStoreInstanceList_;
      storeListJSON              = _servedStoresList_;
      schedulesDateRangeJSON     = _servedSchedulesDateRange_;

    });
    location       = $location;
    cashBagFactory = $injector.get('cashBagFactory');
    dateUtility    = $injector.get('dateUtility');
    scope          = $rootScope.$new();

    getCashBagListDeferred = $q.defer();
    getCashBagListDeferred.resolve(cashBagListResponseJSON);

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

    spyOn(cashBagFactory, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    spyOn(cashBagFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesList').and.returnValue(schedulesListDeferred.promise);
    spyOn(cashBagFactory, 'getDailySchedulesList').and.returnValue(schedulesDailyDeferred.promise);
    spyOn(cashBagFactory, 'getStoreInstanceList').and.returnValue(getStoreInstanceListDeferred.promise);

    spyOn(cashBagFactory, 'getStoreList').and.returnValue(getStoreListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesInDateRange').and.returnValue(getSchedulesInDateRangeDeferred.promise);

    spyOn(cashBagFactory, 'getCompanyId').and.returnValue('fakeCompanyId');
    spyOn(cashBagFactory, 'deleteCashBag').and.returnValue({
      then: function () {
        return;
      }
    });

    CashBagListCtrl = $controller('CashBagListCtrl', {
      $scope: scope
    });

    companyId = cashBagFactory.getCompanyId();
    scope.$digest();
  }));

  describe('scope globals', function () {
    it('should have cashBagList attached to scope', function () {
      expect(scope.cashBagList).toBeDefined();
    });

    it('should have viewName attached to scope', function () {
      expect(scope.viewName).toBeDefined();
    });

  });

  describe('cash bag constructor calls', function () {
    describe('get cashBag list', function () {
      it('should call getCashBagList with companyId', function () {
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {isDelete: 'false'});
      });
      describe('sorted bankRefList results', function () {
        it('should have bankRefList attached to scope', function () {
          expect(scope.bankRefList).toBeDefined();
        });
        it('should return no null values', function () {
          expect(scope.bankRefList).not.toContain(null);
        });
        it('should have no duplicate values', function () {
          for (var i = 0; i < scope.bankRefList.length - 1; i++) {
            expect(scope.bankRefList[i + 1]).not.toBe(scope.bankRefList[i]);
          }
        });
      });
    });

    describe('get station list', function () {
      it('should call getStationList with companyId', function () {
        expect(cashBagFactory.getStationList).toHaveBeenCalledWith(companyId);
      });

      it('should have stationList attached to scope', function () {
        expect(scope.stationList).toBeDefined();
      });
    });

    describe('get schedule list', function () {
      it('should call getSchedulesList with companyId', function () {
        expect(cashBagFactory.getSchedulesList).toHaveBeenCalledWith(companyId);
      });

      it('should have schedulesList attached to scope', function () {
        expect(scope.schedulesList).toBeDefined();
      });
    });
  });


  describe('cashBagList scope functions', function () {
    describe('search cash bag', function () {
      it('should have a search object attached to scope', function () {
        expect(scope.search).toBeDefined();
      });
      it('should call get CashBagList with search params', function () {
        var testCashBagNumber = '123';
        scope.search          = {cashBagNumber: testCashBagNumber};
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {cashBagNumber: testCashBagNumber});
      });
      it('should send searchDate with yyyymmdd format', function () {
        scope.search = {startDate: '06/20/2015'};
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {startDate: '20150620', endDate: '20150620'});
      });
      it('should clear search model and make a API call', function () {
        scope.search = {cashBagNumber: 'fakeCashBagNumber'};
        scope.clearForm();
        expect(scope.search.cashBagNumber).toBe(undefined);
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {});
      });
    });

    describe('store instance', function () {
      it('should not call getStoreInstanceList if missing required fields', function () {
        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).not.toHaveBeenCalled();
        expect(scope.displayModalError).toBe(true);
      });

      it('should call getStoreInstanceList with date and schedule number', function () {
        scope.scheduleDate     = '06/15/2015';
        scope.selectedSchedule = '0008';
        var expectedPayload    = {scheduleNumber: scope.selectedSchedule};

        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload);
        expect(scope.displayModalError).toBe(false);
      });

      it('should call getStoreInstanceList with date and store number', function () {
        scope.scheduleDate        = '06/15/2015';
        scope.selectedStoreNumber = 'store001';
        var expectedPayload       = {storeId: scope.selectedStoreNumber};

        scope.findStoreInstance();
        expect(cashBagFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload);
        expect(scope.displayModalError).toBe(false);
      });
    });

    describe('search store and schedules when date changes', function () {

      var expectedScheduleDate;

      beforeEach(function () {
        scope.scheduleDate   = '06/15/2015';
        expectedScheduleDate = dateUtility.formatDateForAPI(scope.scheduleDate);
        scope.$digest();
      });

      it('should call getStoreList when date changes', function () {
        var expectedPayload = {startDate: expectedScheduleDate, endDate: expectedScheduleDate};
        expect(cashBagFactory.getStoreList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should call getSchedulesInDateRange when date changes', function () {
        expect(cashBagFactory.getSchedulesInDateRange).toHaveBeenCalledWith(companyId, expectedScheduleDate, expectedScheduleDate);
      });

    });

    describe('submit new schedule form', function () {
      it('should call getDailySchedulesList API', function () {
        scope.createCashBagForm = {
          $valid: true
        };
        scope.scheduleDate      = '06/18/2015';
        scope.selectedSchedule  = '08000';
        scope.submitCreate();
        expect(cashBagFactory.getDailySchedulesList).toHaveBeenCalled();
      });
      it('should throw error message if there are blank values', function () {
        scope.createCashBagForm = {
          $valid: false
        };
        scope.submitCreate();
        expect(cashBagFactory.getDailySchedulesList).not.toHaveBeenCalled();
      });
      it('should reformat date structure', function () {
        scope.createCashBagForm = {
          $valid: true
        };
        scope.selectedSchedule  = {scheduleNumber: '105'};
        scope.scheduleDate      = '06/18/2015';
        scope.submitCreate();
        expect(cashBagFactory.getDailySchedulesList).toHaveBeenCalledWith(companyId, '105', '20150618');
      });
    });

    describe('isCashBagEditable', function () {
      var testCashBag = {};
      it('should return true if cash bag has not been submitted', function () {
        testCashBag.isSubmitted = false;
        testCashBag.isDelete    = 'false';
        expect(scope.isCashBagEditable(testCashBag)).toEqual(true);
        testCashBag.isSubmitted = true;
        expect(scope.isCashBagEditable(testCashBag)).toEqual(false);
      });
      it('should return true if cash bag has not been deleted', function () {
        testCashBag.isSubmitted = false;
        testCashBag.isDelete    = 'false';
        expect(scope.isCashBagEditable(testCashBag)).toEqual(true);
        testCashBag.isDelete    = 'true';
        expect(scope.isCashBagEditable(testCashBag)).toEqual(false);
      });
    });
  });

  describe('helper functions', function () {
    describe('error message functions', function () {

    });
  });

  describe('Action buttons', function () {
    it('should have a viewCashBag function in scope', function () {
      expect(scope.viewCashBag).toBeDefined();
    });
    it('should change the url based on the menu object to view a cash bag', function () {
      scope.viewCashBag({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/view/1');
    });
    it('should have an editCashBag function in scope', function () {
      expect(scope.editCashBag).toBeDefined();
    });
    it('should have a editCashBag callable function', function () {
      expect(Object.prototype.toString.call(scope.editCashBag)).toBe('[object Function]');
    });
    it('should change the url based on the menu object to edit a cash bag', function () {
      scope.editCashBag({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/edit/1');
    });
  });

});
