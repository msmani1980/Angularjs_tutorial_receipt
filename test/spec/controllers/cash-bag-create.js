'use strict';

describe('Controller: CashBagCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));

  var CashBagCreateCtrl,
    scope,
    cashBagResponseJSON,
    cashBagService,
    getCashBagListDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCashBag_) {
      cashBagResponseJSON = _servedCashBag_;
    });
    cashBagService = $injector.get('cashBagService');
    scope = $rootScope.$new();
    getCashBagListDeferred = $q.defer();
    getCashBagListDeferred.resolve(cashBagResponseJSON);
    CashBagCreateCtrl = $controller('CashBagCreateCtrl', {
      $scope: scope
    });
    spyOn(cashBagService, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Cash Bag');
  });



});
