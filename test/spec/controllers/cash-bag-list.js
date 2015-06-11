'use strict';

describe('Controller: CashBagListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/stations.json'));

  var CashBagListCtrl,
    scope,
    cashBagListResponseJSON,
    cashBagService,
    getCashBagListDeferred,
    GlobalMenuService,
    companyId,
    stationsService,
    stationsListDeferred,
    stationsResponseJSON,
    location;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedCashBagList_, _servedStations_) {
      cashBagListResponseJSON = _servedCashBagList_;
      stationsResponseJSON = _servedStations_;
    });
    location = $location;
    cashBagService = $injector.get('cashBagService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    stationsService = $injector.get('stationsService');
    scope = $rootScope.$new();
    getCashBagListDeferred = $q.defer();
    getCashBagListDeferred.resolve(cashBagListResponseJSON);
    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsResponseJSON);
    spyOn(cashBagService, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    spyOn(stationsService, 'getStationList').and.returnValue(stationsListDeferred.promise);
    CashBagListCtrl = $controller('CashBagListCtrl', {
      $scope: scope
    });
    companyId = GlobalMenuService.company.get();
    scope.$digest();
  }));

  it('should call cashBagService with companyId', function () {
    expect(cashBagService.getCashBagList).toHaveBeenCalledWith(companyId);
  });

  it('should have cashBagList attached to scope', function () {
    expect(scope.cashBagList).not.toBe(undefined);
  });

  describe('get station list', function () {
    it('should call getStationList with companyId', function () {
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId);
    });

    it('should have stationList attached to scope', function () {
      expect(scope.stationList).not.toBe(undefined);
    });
  });

  describe('Action buttons', function(){
    it('should change the url based on the menu object', function () {
      scope.showCashBag({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/cash-bag-create/1');
    });
  });

});
