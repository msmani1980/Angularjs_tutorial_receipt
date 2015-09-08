'use strict';

describe('Controller: StoreInstancePackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StoreInstancePackingCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var getStoreDetailsDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();

    storeInstanceFactory = $injector.get('storeInstanceFactory');

    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);

    StoreInstancePackingCtrl = $controller('StoreInstancePackingCtrl', {
      $scope: scope
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
          storeInstanceNumber: 5
        };
        getStoreDetailsDeferred.resolve(storeDetailsJSON);
        scope.$digest();
      });

      it('should get the store details', function () {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalled();
      });

      it('should attach all properties of JSON to scope', function () {
        angular.forEach(storeDetailsJSON, function (value, key) {
          expect(scope[key]).toBe(storeDetailsJSON[key]);
        });
      });
    });
  });

});
