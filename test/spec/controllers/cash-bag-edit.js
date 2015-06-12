'use strict';

describe('Controller: CashBagEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));

  var CashBagEditCtrl,
    scope,
    $httpBackend,
    cashBagService,
    cashBagResponseJSON,
    cashBagId = 95;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    inject(function (_servedCashBag_) {
      cashBagResponseJSON = _servedCashBag_;
    });

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/cash-bags/).respond(cashBagResponseJSON);

    cashBagService = $injector.get('cashBagService');

    CashBagEditCtrl = $controller('CashBagEditCtrl', {
      $scope: scope,
      $routeParams: {state:'edit', id:95}
    });

    spyOn(cashBagService, 'getCashBag').and.callThrough();

    scope.$digest();
    $httpBackend.flush();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Cash Bag');
  });

  /*
  it('should call getCashBag from cashBagService', function () {
    expect(cashBagService.getCashBag).toHaveBeenCalled();
  });
  */

  it('should have cashBag attached to scope after API call', function () {
    // console.log(scope.cashBag);
    expect(!!scope.cashBag).toBe(true);
  });

});
