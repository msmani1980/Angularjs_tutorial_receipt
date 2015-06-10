'use strict';

describe('Controller: CashBagListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));

  var CashBagListCtrl,
    scope, cashBagResponseJSON, cashBagService, getCashBagListDeferred, GlobalMenuService, companyId, stationsService, stationsListDeferred, stationsResponseJSON;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCashBag_) {
      cashBagResponseJSON = _servedCashBag_;
    });
    cashBagService = $injector.get('cashBagService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    stationsService = $injector.get('stationsService');
    scope = $rootScope.$new();
    getCashBagListDeferred = $q.defer();
    getCashBagListDeferred.resolve(cashBagResponseJSON);
    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsResponseJSON);
    spyOn(cashBagService, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    spyOn(stationsService, 'getStationsList').and.returnValue(stationsListDeferred.promise);
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

  it('should call stationsService with id', function () {
    expect(stationsService.getStationsList).toHaveBeenCalled();
  });

});
