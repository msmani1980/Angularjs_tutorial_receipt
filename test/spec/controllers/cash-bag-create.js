'use strict';

describe('Controller: CashBagCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));

  var CashBagCreateCtrl,
    scope,
    $httpBackend,
    cashBagService,
    cashBagResponseJSON,
    cashBagId = 95;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, _cashBagService_) {
    scope = $rootScope.$new();
    inject(function (_servedCashBag_) {
      cashBagResponseJSON = _servedCashBag_;
    });

    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/cash-bags/).respond(cashBagResponseJSON);

    cashBagService = _cashBagService_;

    CashBagCreateCtrl = $controller('CashBagCreateCtrl', {
      $scope: scope,
      $routeParams: {state: 'view', id: 95}
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
  describe('cash bag object in scope', function () {
    it('should get the cash bag from API', function () {
      expect(cashBagService.getCashBag).toHaveBeenCalled();
    });

    it('should attach a cash bag object after a API call to getCashBag', function () {
      expect(!!scope.cashBag).toBe(true);
    });
  });
*/
});
