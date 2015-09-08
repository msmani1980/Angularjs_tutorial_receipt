'use strict';

describe('Controller: StoreInstanceReviewCtrl', function () {

// load the controller's module
  beforeEach(module('ts5App'));


  var StoreInstanceReviewCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var routeParams;
  var getStoreDetailsDeferred;
  var storeInstanceDispatchWizardConfig;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function () {
    });
    scope = $rootScope.$new();
    routeParams = {
      storeId: 5
    };

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');

    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);

    StoreInstanceReviewCtrl = $controller('StoreInstanceReviewCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  describe('Init', function () {
    describe('API calls', function () {
      beforeEach(function () {
        storeDetailsJSON = {
          LMPStation: 'ORD',
          storeNumber: '180485',
          scheduleDate: '2015-08-13',
          scheduleNumber: 'SCHED123',
          storeInstanceNumber: scope.storeId
        };
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        scope.$digest();
      });

      it('should get the store details', function () {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(scope.storeId);
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeDetails).toEqual(storeDetailsJSON);
      });

      it('should set wizardSteps', function(){
        var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(routeParams.storeId);
        expect(scope.wizardSteps).toEqual(wizardSteps);
      });

    });
  });

});
