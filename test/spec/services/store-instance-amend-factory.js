'use strict';

describe('Factory: storeInstanceAmendFactory', function () {

  beforeEach(module('ts5App'));

  var storeInstanceAmendFactory;
  var rootScope;
  var scope;

  beforeEach(inject(function ($rootScope, _storeInstanceAmendFactory_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    storeInstanceAmendFactory = _storeInstanceAmendFactory_;
  }));

  it('should be defined', function () {
    expect(!!storeInstanceAmendFactory).toBe(true);
  });

  describe('mock API calls', function () {
    it('should be accessible in the service', function () {
      expect(!!storeInstanceAmendFactory.getCashBagListMockData).toBe(true);
      expect(!!storeInstanceAmendFactory.getStoreInstancesMockData).toBe(true);
    });
  });


});
