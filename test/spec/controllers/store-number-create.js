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

    spyOn(companyStoresService, 'createStore').and.returnValue(createStoreDeferred.promise);
    spyOn(companyStoresService, 'saveStore').and.returnValue(createStoreDeferred.promise);
    spyOn(companyStoresService, 'getStore').and.returnValue(createStoreDeferred.promise);

    getStoresDeferred = $q.defer();
    getStoresDeferred.resolve(_servedCompanyStores_);
    spyOn(companyStoresService, 'getStoreList').and.returnValue(getStoresDeferred.promise);

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
  });

  describe('controller init function', function(){
    it('should set formData in scope', function(){
      expect(scope.formData).toBeDefined();
      expect(Object.prototype.toString.call(scope.formData)).toBe('[object Object]');
    });
    it('should set storeNumbersList in scope', function(){
      expect(scope.storeNumbersList).toBeDefined();
      expect(Object.prototype.toString.call(scope.storeNumbersList)).toBe('[object Array]');
    });
  });

  describe('scope.getStoreList', function(){
    it('should call companyService.getStores', function(){
      scope.getStoreList();
      scope.$digest();
      expect(companyStoresService.getStoreList).toHaveBeenCalled();
    });
  });

  describe('submitForm scope function', function(){
    it('should call companyStoresService.createStore when creating a new store', function(){
      scope.formData = {
        storeNumber: 'qwert12345',
        startDate: '07/09/2015',
        endDate: '07/10/2015'
      };
      scope.$digest();
      var payload = angular.copy(scope.formData);
      payload.startDate = '20150709';
      payload.endDate = '20150710';

      scope.submitForm();
      expect(companyStoresService.createStore).toHaveBeenCalledWith(payload);
    });
    it('should call companyStoresService.saveStore when editing a store that contains an id', function(){
      scope.formData = {
        id: 2,
        storeNumber: 'qwert12345',
        startDate: '07/09/2015',
        endDate: '07/10/2015'
      };
      scope.$digest();
      var payload = angular.copy(scope.formData);
      payload.startDate = '20150709';
      payload.endDate = '20150710';

      scope.submitForm();
      expect(companyStoresService.saveStore).toHaveBeenCalledWith(payload);
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

  describe('formDefault scope function', function(){
    it('should return true', function(){
      scope.formData = {storeNumber: null,startDate: null,endDate: null};
      scope.$digest();
      expect(scope.formDefault()).toBe(true);
    });
    it('should return false', function(){
      scope.formData = {storeNumber: '1',startDate: null,endDate: null};
      scope.$digest();
      expect(scope.formDefault()).toBe(false);
    });
  });

  describe('canEdit scope function', function(){
    it('should return true', function(){
      expect(scope.canEdit({endDate: '12/30/2050'})).toBe(true);
    });
    it('should return false', function(){
      expect(scope.canEdit({endDate: '12/30/2000'})).toBe(false);
    });
  });

  describe('fieldDisabled scope function', function(){
    it('should return true', function(){
      expect(scope.fieldDisabled({startDate: '12/30/2000', endDate: '12/30/2050'})).toBe(true);
    });
    it('should return false', function(){
      expect(scope.fieldDisabled({startDate: '12/30/1999', endDate: '12/30/2000'})).toBe(false);
    });
  });

  describe('editStoreNumber scope function', function(){
    it('should return false if cannot delete', function(){
      expect(scope.editStoreNumber({endDate: '12/30/2000'})).toBe(false);
    });
    it('should get the store from the current storelist if cached', function(){
      var store = {id:1,endDate: '12/30/2050'};
      scope.storeNumbersList = [store];
      scope.$digest();
      scope.editStoreNumber(store);
      expect(scope.formData.id).toBe(store.id);
    });
    it('should call get store from service if not cached in storeNumbersList', function(){
      var store = {id:1,endDate: '12/30/2050'};
      scope.storeNumbersList = [];
      scope.$digest();
      scope.editStoreNumber(store);
      expect(companyStoresService.getStore).toHaveBeenCalledWith(store.id);
    });


    describe('error handler', function(){

      var mockError;
      beforeEach(function(){
        mockError = {
          status:400,
          statusText:'Bad Request'
        };
        var store = {id:1,endDate: '12/30/2050'};
        scope.storeNumbersList = [];
        scope.$digest();
        scope.editStoreNumber(store);
        createStoreDeferred.reject(mockError);
        scope.$apply();
      });

      it('should set the displayError flag to true', function(){
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the error response as a copy the API response', function(){
        expect(scope.errorResponse).toEqual(mockError);
      });

    });

  });

});
