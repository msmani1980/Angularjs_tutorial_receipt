'use strict';

describe('Controller: StoreNumberCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  beforeEach(module('served/company-stores.json'));

  var StoreNumberCreateCtrl,
    scope,
    createStoreDeferred,
    getStoresDeferred,
    companyId,
    companyStoresService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _GlobalMenuService_, _companyStoresService_, _servedCompanyStores_) {
    scope = $rootScope.$new();

    companyStoresService = _companyStoresService_;

    createStoreDeferred = $q.defer();
    createStoreDeferred.resolve({response:200});
    spyOn(companyStoresService, 'createStore').and.returnValue(createStoreDeferred.promise);

    getStoresDeferred = $q.defer();
    getStoresDeferred.resolve(_servedCompanyStores_);
    spyOn(companyStoresService, 'getStores').and.returnValue(getStoresDeferred.promise);

    spyOn(companyStoresService, 'deleteStore').and.returnValue(getStoresDeferred.promise);

    companyId = _GlobalMenuService_.company.get();

    StoreNumberCreateCtrl = $controller('StoreNumberCreateCtrl', {
      $scope: scope
    });

    scope.$digest();

  }));

  describe('scope globals', function () {
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Create Store Number');
    });
    it('should have a submitForm function attached to the scope', function(){
      expect(scope.submitForm).toBeDefined();
      expect(Object.prototype.toString.call(scope.submitForm)).toBe('[object Function]');
    });
    it('should have a removeRecord function attached to the scope', function(){
      expect(scope.removeRecord).toBeDefined();
      expect(Object.prototype.toString.call(scope.removeRecord)).toBe('[object Function]');
    });
    it('should have a canDelete function attached to the scope', function(){
      expect(scope.canDelete).toBeDefined();
      expect(Object.prototype.toString.call(scope.canDelete)).toBe('[object Function]');
    });
  });

  describe('controller init function', function(){
    it('should set formData in scope', function(){
      expect(scope.formData).toBeDefined();
      expect(Object.prototype.toString.call(scope.formData)).toBe('[object Object]');
    });
    it('should call companyService.getStores', function(){
      expect(companyStoresService.getStores).toHaveBeenCalledWith(companyId);
    });
    it('should set storeNumbersList in scope', function(){
      expect(scope.storeNumbersList).toBeDefined();
      expect(Object.prototype.toString.call(scope.storeNumbersList)).toBe('[object Array]');
    });
  });

  describe('submitForm scope function', function(){
    it('should call companyStoresService.createStore', function(){
      scope.formData = {
        storeNumber: 'qwert12345',
        startDate: '07/09/2015',
        endDate: '07/10/2015'
      };
      scope.createStoreNumberForm = {$invalid:false};
      scope.$digest();
      var payload = angular.copy(scope.formData);
      payload.startDate = '20150709';
      payload.endDate = '20150710';

      scope.submitForm();
      expect(companyStoresService.createStore).toHaveBeenCalledWith(payload);
    });
  });

  describe('canDelete scope function', function(){
    it('should return true if the start date is in the future', function(){
      expect(scope.canDelete({startDate:'01/05/2050'})).toBe(true);
    });
    it('should return false if the start date is in the past', function(){
      expect(scope.canDelete({startDate:'01/05/2015'})).toBe(false);
    });
  });

  describe('removeRecord scope function', function(){
    it('should return false if the start date is in the past', function(){
      expect(scope.removeRecord({startDate:'01/05/2015'})).toBe(false);
    });
    it('should call deleteStore API', function(){
      var store = {
        id: 123,
        startDate:'01/05/2050'
      };
      scope.removeRecord(store);
      expect(companyStoresService.deleteStore).toHaveBeenCalledWith(store.id);
    });
  });

});
