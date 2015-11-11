'use strict';

fdescribe('Factory: reconciliationFactory', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));


  var reconciliationFactory;
  var storeInstanceService;
  var getStoreInstanceDeferred;
  var storeInstanceJSON;

  beforeEach(inject(function (_reconciliationFactory_, $injector, $q) {
    inject(function (_servedStoreInstance_) {
      storeInstanceJSON = _servedStoreInstance_;
    });

    storeInstanceService = $injector.get('storeInstanceService');

    getStoreInstanceDeferred = $q.defer();
    getStoreInstanceDeferred.resolve(storeInstanceJSON);
    spyOn(storeInstanceService, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);

    reconciliationFactory = _reconciliationFactory_;
  }));

  it('should be defined', function () {
    expect(!!reconciliationFactory).toBe(true);
  });

  describe('API calls', function () {
    it('should call storeInstanceService on getStoreInstance', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStoreInstance(storeInstanceId);
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(storeInstanceId);
    });
  });

  describe('mock API calls', function () {
    it('should be accessible in the service', function () {
      expect(!!reconciliationFactory.getCashBagMockData).toBe(true);
      expect(!!reconciliationFactory.getLMPStockMockData).toBe(true);
      expect(!!reconciliationFactory.getMockReconciliationDataList).toBe(true);
    });
  });


});
