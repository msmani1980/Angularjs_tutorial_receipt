'use strict';

describe('Factory: reconciliationFactory', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/store.json'));

  var reconciliationFactory;
  var storeInstanceService;
  var getStoreInstanceDeferred;
  var storeInstanceJSON;
  var storesService;
  var getStoreDeferred;
  var getStoreJSON;

  beforeEach(inject(function (_reconciliationFactory_, $injector, $q) {
    inject(function (_servedStoreInstance_,_servedStore_) {
      storeInstanceJSON = _servedStoreInstance_;
      getStoreJSON = _servedStore_;
    });

    storeInstanceService = $injector.get('storeInstanceService');
    storesService = $injector.get('storesService');

    getStoreInstanceDeferred = $q.defer();
    getStoreInstanceDeferred.resolve(storeInstanceJSON);
    spyOn(storeInstanceService, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);

    getStoreDeferred = $q.defer();
    getStoreDeferred.resolve(getStoreJSON);
    spyOn(storesService, 'getStore').and.returnValue(getStoreDeferred.promise);

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

    it('should call storesService on getStore', function () {
      var storeId = 'fakeStoreId';
      reconciliationFactory.getStore(storeId);
      expect(storesService.getStore).toHaveBeenCalledWith(storeId);
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
