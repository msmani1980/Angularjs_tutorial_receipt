'use strict';

describe('Controller: CashBagListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/stations.json', 'served/schedules.json', 'served/schedules-daily.json'));

  var CashBagListCtrl,
    scope,
    cashBagListResponseJSON,
    getCashBagListDeferred,
    companyId,
    stationsListDeferred,
    stationsResponseJSON,
    schedulesListDeferred,
    schedulesDailyDeferred,
    schedulesResponseJSON,
    schedulesDailyResponseJSON,
    cashBagFactory,
    location,
    companyId;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedCashBagList_, _servedStations_, _servedSchedules_, _servedSchedulesDaily_) {
      cashBagListResponseJSON = _servedCashBagList_;
      stationsResponseJSON = _servedStations_;
      schedulesResponseJSON = _servedSchedules_;
      schedulesDailyResponseJSON = _servedSchedulesDaily_;

    });
    location = $location;
    cashBagFactory = $injector.get('cashBagFactory');
    scope = $rootScope.$new();
    getCashBagListDeferred = $q.defer();
    getCashBagListDeferred.resolve(cashBagListResponseJSON);
    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsResponseJSON);
    schedulesListDeferred = $q.defer();
    schedulesListDeferred.resolve(schedulesResponseJSON);
    schedulesDailyDeferred = $q.defer();
    schedulesDailyDeferred.resolve(schedulesDailyResponseJSON);
    spyOn(cashBagFactory, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    spyOn(cashBagFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesList').and.returnValue(schedulesListDeferred.promise);
    spyOn(cashBagFactory, 'getDailySchedulesList').and.returnValue(schedulesDailyDeferred.promise);
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
  companyId = '403';

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
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId);
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
        scope.search = {cashBagNumber: testCashBagNumber};
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {cashBagNumber: testCashBagNumber});
      });
      it('should send searchDate with yyyymmdd format', function(){
        scope.search = {scheduleDate: '06/20/2015'};
        scope.searchCashBag();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {scheduleDate: '20150620'});
      });
      it('should clear search model and make a API call', function () {
        scope.search = {cashBagNumber: 'fakeCashBagNumber'};
        scope.clearForm();
        expect(scope.search.cashBagNumber).toBe(undefined);
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {});
      });
    });

    describe('submit new schedule form', function () {
      it('should call getDailySchedulesList API', function () {
        scope.createCashBagForm = {
          $valid: true
        };
        scope.scheduleIndex = '0';
        scope.scheduleDate = '06/18/2015';
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
        scope.schedulesList = [{scheduleNumber:'105'}];
        scope.scheduleIndex = '0';
        scope.scheduleDate = '06/18/2015';
        scope.submitCreate();
        expect(cashBagFactory.getDailySchedulesList).toHaveBeenCalledWith(companyId, '105', '20150618');
      });
    });

    describe('updateScheduleDate', function(){
      it('should set scheduleMinDate to yyyymmdd format', function(){
        scope.schedulesList = [{
          minEffectiveStart: '2015-06-20',
          minEffectiveEnd: '2015-08-20'
        }];
        scope.scheduleIndex = 0;
        scope.updateScheduleDate();
        expect(scope.scheduleMinDate).toEqual('06/20/2015');
      });
      it('should set scheduleMaxDate to yyyymmdd format', function(){
        scope.schedulesList = [{
          minEffectiveStart: '2015-06-20',
          maxEffectiveEnd: '2015-08-20'
        }];
        scope.scheduleIndex = 0;
        scope.updateScheduleDate();
        expect(scope.scheduleMaxDate).toEqual('08/20/2015');
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
      expect(location.path()).toBe('/cash-bag/1');
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
      expect(location.path()).toBe('/cash-bag/1/edit');
    });
    it('should have a deleteCashBag function in scope', function () {
      expect(scope.deleteCashBag).toBeDefined();
    });
    it('should have a deleteCashBag callable function', function () {
      expect(Object.prototype.toString.call(scope.deleteCashBag)).toBe('[object Function]');
    });
    it('should call cashBagFactory.cashBagDelete when delete is called', function () {
      var id = 95;
      var cashBag = {id: id};
      scope.deleteCashBag(cashBag);
      scope.$digest();
      expect(cashBagFactory.deleteCashBag).toHaveBeenCalledWith(id);
    });
  });

});
