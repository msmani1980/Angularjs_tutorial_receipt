'use strict';

describe('Controller: CashBagListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/stations.json', 'served/schedules.json'));

  var CashBagListCtrl,
    scope,
    cashBagListResponseJSON,
    getCashBagListDeferred,
    companyId,
    stationsListDeferred,
    stationsResponseJSON,
    schedulesListDeferred,
    schedulesResponseJSON,
    cashBagFactory,
    location;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedCashBagList_, _servedStations_, _servedSchedules_) {
      cashBagListResponseJSON = _servedCashBagList_;
      stationsResponseJSON = _servedStations_;
      schedulesResponseJSON = _servedSchedules_;

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
    spyOn(cashBagFactory, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    spyOn(cashBagFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(cashBagFactory, 'getSchedulesList').and.returnValue(schedulesListDeferred.promise);
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

  it('should call getCashBagList with companyId', function () {
    expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId);
  });

  it('should have cashBagList attached to scope', function () {
    expect(scope.cashBagList).toBeDefined();
  });


  describe('filter bank reference number list for search', function () {
    it('should have bankRefList attached to scope', function () {
      expect(scope.bankRefList).toBeDefined();
    });

    it('should have no null values', function () {
      expect(scope.bankRefList).not.toContain(null);
    });

    it('should have no duplicate values', function () {
      for (var i = 0; i < scope.bankRefList.length - 1; i++) {
        expect(scope.bankRefList[i + 1]).not.toBe(scope.bankRefList[i]);
      }
    });
  });

  describe('search cash bag', function () {
    it('should have a search object attached to scope', function () {
      expect(scope.search).toBeDefined();
    });

    it('should clear search model and make a API call', function () {
      scope.search = {cashBagNumber: 'fakeCashBagNumber'};
      scope.clearForm();
      expect(scope.search.cashBagNumber).toBe(undefined);
      expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {});
    });

    it('should have a search model and make a API call', function () {
      var testCashBagNumber = '123';
      scope.search = {cashBagNumber: testCashBagNumber};
      scope.searchCashBag();
      expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(companyId, {cashBagNumber: testCashBagNumber});
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

  describe('Action buttons', function () {
    it('should have a viewCashBag function in scope', function(){
      expect(scope.viewCashBag).toBeDefined();
    });
    it('should change the url based on the menu object to view a cash bag', function () {
      scope.viewCashBag({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/view/1');
    });
    it('should have an editCashBag function in scope', function(){
      expect(scope.editCashBag).toBeDefined();
    });
    it('should have a editCashBag callable function', function(){
      expect(Object.prototype.toString.call(scope.editCashBag)).toBe('[object Function]');
    });
    it('should change the url based on the menu object to edit a cash bag', function () {
      scope.editCashBag({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/cash-bag/edit/1');
    });
  });

});
