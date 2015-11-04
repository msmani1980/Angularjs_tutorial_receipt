'use strict';

describe('Factory: reconciliationFactory', function () {

  beforeEach(module('ts5App'));

  var reconciliationFactory;
  var rootScope;
  var scope;

  beforeEach(inject(function ($rootScope, _reconciliationFactory_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    reconciliationFactory = _reconciliationFactory_;
  }));

  it('should be defined', function () {
    expect(!!reconciliationFactory).toBe(true);
  });

  describe('mock API calls', function () {
    it('should be accessible in the service', function () {
      expect(!!reconciliationFactory.getCashBagMockData).toBe(true);
      expect(!!reconciliationFactory.getLMPStockMockData).toBe(true);
    });
  });


});
