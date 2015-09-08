'use strict';

fdescribe('Controller: StoreInstancePackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));


  var StoreInstancePackingCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var routeParams;
  var getStoreDetailsDeferred;
  var getStoreInstanceMenuItemsDeferred;
  var servedStoreInstanceMenuItemsJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceMenuItems_) {
      servedStoreInstanceMenuItemsJSON = _servedStoreInstanceMenuItems_;
    });
    scope = $rootScope.$new();
    routeParams = {
      storeId: 5
    };

    storeInstanceFactory = $injector.get('storeInstanceFactory');

    getStoreDetailsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred.resolve(servedStoreInstanceMenuItemsJSON);

    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(getStoreInstanceMenuItemsDeferred.promise);

    StoreInstancePackingCtrl = $controller('StoreInstancePackingCtrl', {
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
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalled();
      });

      it('should attach all properties of JSON to scope', function () {
        // TODO: refactor
        angular.forEach(storeDetailsJSON, function (value, key) {
          expect(scope[key]).toBe(storeDetailsJSON[key]);
        });
      });

      it('should call getStoreInstanceMenuItems', function () {
        var expectedPayload = {
          itemTypeId: 1, // this is 1 because we are requesting regular items.
          scheduleDate: storeDetailsJSON.scheduleDate
        };
        expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(scope.storeId, expectedPayload);
      });

      it('should attach the menuItems to scope', function () {
        expect(scope.menuItems).toBeDefined();
      });
    });
  });

});
