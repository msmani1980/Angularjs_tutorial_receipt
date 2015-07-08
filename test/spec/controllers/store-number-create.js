'use strict';

describe('Controller: storeNumberCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  beforeEach(module('served/company-stores.json'));

  var storeNumberCreateCtrl,
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

    companyId = _GlobalMenuService_.company.get();

    storeNumberCreateCtrl = $controller('storeNumberCreateCtrl', {
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
    it('should should return false if createStoreNumberForm is invalid', function(){
      scope.createStoreNumberForm = {$invalid:true};
      scope.$digest();
      var returnVal = scope.submitForm();
      expect(returnVal).toBe(false);
    });
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

});
