'use strict';

describe('Controller: CreateStoreNumberCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CreateStoreNumberCtrl,
    scope,
    createCompanyDeferred,
    companyId,
    companyService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _GlobalMenuService_, _companyService_) {
    scope = $rootScope.$new();


    companyService = _companyService_;

    createCompanyDeferred = $q.defer();
    createCompanyDeferred.resolve({response:200});
    spyOn(companyService, 'createStore').and.returnValue(createCompanyDeferred.promise);

    companyId = _GlobalMenuService_.company.get();

    CreateStoreNumberCtrl = $controller('createStoreNumberCtrl', {
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

  describe('constructor', function(){
    it('should call the constructor', function(){
      expect(CreateStoreNumberCtrl.constructor()).toHaveBeenCalled();
    });
  });

  describe('submitForm scope function', function(){
    beforeEach(function(){
      scope.formData = {
        storeNumber: '123',
        startDate: '123',
        endDate: '123'
      };
      scope.createStoreNumberForm = {$invalid:false};
      scope.$digest();
    });
    it('should call companyService\' createStore', function(){
      var payload = angular.copy(scope.company);
      payload.id = companyId;
      payload.action = 'stores';

      scope.submitForm();
      expect(companyService.createStore).toHaveBeenCalledWith(payload);
    });
  });

});
