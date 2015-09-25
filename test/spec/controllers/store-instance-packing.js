'use strict';

describe('Controller: StoreInstancePackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-details.json'));
  beforeEach(module('served/store-instance-item-list.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/store-status-response.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/characteristics.json'));


  var StoreInstancePackingCtrl;
  var scope;
  var storeInstanceFactory;
  var routeParams;
  var getUpdatedStoreStatusDeferred;
  var servedStoreStatusJSON;
  var getStoreDetailsDeferred;
  var servedStoreInstanceDetailsJSON;
  var getStoreInstanceMenuItemsDeferred;
  var servedStoreInstanceMenuItemsJSON;
  var getStoreInstanceItemsDeferred;
  var servedStoreInstanceItemsJSON;
  var getMasterItemsDeferred;
  var servedMasterItemsJSON;
  var getItemTypesDeferred;
  var servedItemTypesJSON;
  var getCharacteristicsDeferred;
  var servedCharacteristicsJSON;
  var dateUtility;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceMenuItems_, _servedStoreInstanceItemList_, _servedMasterItemList_,
                     _servedStoreInstanceDetails_, _servedStoreStatusResponse_, _servedCharacteristics_, _servedItemTypes_) {
      servedStoreInstanceMenuItemsJSON = _servedStoreInstanceMenuItems_;
      servedStoreInstanceItemsJSON = _servedStoreInstanceItemList_;
      servedMasterItemsJSON = _servedMasterItemList_;
      servedStoreInstanceDetailsJSON = _servedStoreInstanceDetails_;
      servedStoreStatusJSON = _servedStoreStatusResponse_;
      servedItemTypesJSON = _servedItemTypes_;
      servedCharacteristicsJSON = _servedCharacteristics_;
    });
    scope = $rootScope.$new();
    routeParams = {
      storeId: 5,
      action: 'replenish'
    };

    storeInstanceFactory = $injector.get('storeInstanceFactory');

    getUpdatedStoreStatusDeferred = $q.defer();
    getUpdatedStoreStatusDeferred.resolve(servedStoreStatusJSON);

    getStoreDetailsDeferred = $q.defer();

    getStoreInstanceMenuItemsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred.resolve(servedStoreInstanceMenuItemsJSON);

    getStoreInstanceItemsDeferred = $q.defer();
    getStoreInstanceItemsDeferred.resolve(servedStoreInstanceItemsJSON);

    getMasterItemsDeferred = $q.defer();
    getMasterItemsDeferred.resolve(servedMasterItemsJSON);

    getItemTypesDeferred = $q.defer();
    getItemTypesDeferred.resolve(servedItemTypesJSON);

    getCharacteristicsDeferred = $q.defer();
    getCharacteristicsDeferred.resolve(servedCharacteristicsJSON);
    dateUtility = $injector.get('dateUtility');

    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(getStoreInstanceMenuItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemsMasterList').and.returnValue(getMasterItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(getUpdatedStoreStatusDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemTypes').and.returnValue(getItemTypesDeferred.promise);
    spyOn(storeInstanceFactory, 'getCharacteristics').and.returnValue(getCharacteristicsDeferred.promise);


    StoreInstancePackingCtrl = $controller('StoreInstancePackingCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  describe('Init', function () {
    describe('API calls', function () {

      beforeEach(function () {
        getStoreDetailsDeferred.resolve(servedStoreInstanceDetailsJSON);
        scope.$digest();
      });

      it('should get the store details', function () {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(scope.storeId);
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeDetails).toEqual(servedStoreInstanceDetailsJSON);
      });

      it('should call getItemTypes', function () {
        expect(storeInstanceFactory.getItemTypes).toHaveBeenCalled();
      });

      it('should call getCharacteristics', function () {
        expect(storeInstanceFactory.getCharacteristics).toHaveBeenCalled();
      });

      it('should call getStoreInstanceMenuItems with Regular and Uplifted filters', function () {
        var formattedDate = dateUtility.formatDateForAPI(servedStoreInstanceDetailsJSON.scheduleDate);
        var expectedPayload = {
          itemTypeId: 1, // this is 1 because we are requesting regular items.
          characteristicId: 2, // this is 2 for upliftable items
          date: formattedDate
        };
        expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(scope.storeId, expectedPayload);
      });

      it('should call getStoreInstanceItems', function () {
        expect(storeInstanceFactory.getStoreInstanceItemList).toHaveBeenCalledWith(scope.storeId);
      });

      it('should remove the id of the instance items', function () {
        scope.menuItems = [];
        StoreInstancePackingCtrl.getStoreInstanceMenuItems();
        scope.$digest();
        expect(scope.menuItems[0].id).toBeUndefined();
      });

      it('should not remove the id of the items', function () {
        scope.menuItems = [];
        StoreInstancePackingCtrl.getStoreInstanceItems();
        scope.$digest();
        expect(scope.menuItems[0].id).toBeDefined();
      });

      it('should call getItemsMasterList', function () {
        var formattedDate = dateUtility.formatDateForAPI(servedStoreInstanceDetailsJSON.scheduleDate);
        var expectedPayload = {
          itemTypeId: 1,
          startDate: formattedDate,
          endDate: formattedDate
        };
        expect(storeInstanceFactory.getItemsMasterList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should update store details status objects', function () {
        scope.$digest();
        var expectedCurrentId = servedStoreStatusJSON.statusId;
        expect(scope.storeDetails.currentStatus.id).toEqual(expectedCurrentId);
      });

      describe('mergeMenuItems', function () {
        var newItems;
        beforeEach(function () {
          scope.menuItems = [{
            itemMasterId: 1,
            fakeKey: 1
          }, {
            itemMasterId: 2,
            fakeKey: 2
          }];
          newItems = [{
            itemMasterId: 2,
            newKey: 3
          }];
        });

        it('should merge duplicate items', function () {
          StoreInstancePackingCtrl.mergeMenuItems(newItems);
          expect(scope.menuItems.length).toBe(2);
        });

        it('should keep properties on duplicate items', function () {
          var expectedObject = {
            itemMasterId: 2,
            fakeKey: 2,
            newKey: 3
          };
          StoreInstancePackingCtrl.mergeMenuItems(newItems);
          expect(scope.menuItems[1]).toEqual(expectedObject);
        });
      });

    });
  });

  describe('formatStoreInstanceItemsPayload', function () {
    beforeEach(function () {
      scope.menuItems = [{
        id: 1,
        itemMasterId: 2,
        quantity: 3,
        fakeKey: 4
      }, {
        id: 2,
        itemMasterId: 4,
        quantity: 5,
        fooKey: 44
      }];
      scope.emptyMenuItems = [{
        quantity: 9,
        nonsenseKey: 4,
        masterItem: {id: 5}
      }];
    });

    it('should merge menuItems and emptyMenuItems', function () {
      var expectedLength = scope.menuItems.length + scope.emptyMenuItems.length;
      var result = StoreInstancePackingCtrl.formatStoreInstanceItemsPayload();
      expect(result.response.length).toEqual(expectedLength);
    });

    it('should only keep id, itemMasterId, and quantity for menuItems', function () {
      var result = StoreInstancePackingCtrl.formatStoreInstanceItemsPayload();
      var expectdItem = {
        id: 1,
        itemMasterId: 2,
        quantity: 3
      };
      expect(result.response[0]).toEqual(expectdItem);
    });
    it('should only keep itemMasterId and quantity for emptyMenuItems', function () {
      var result = StoreInstancePackingCtrl.formatStoreInstanceItemsPayload();
      var expectdItem = {
        itemMasterId: 5,
        quantity: 9
      };
      expect(result.response[2]).toEqual(expectdItem);
    });
  });

  describe('filtered master menu items', function () {
    it('should not allow to add items that are already in the store items', function () {
      scope.menuItems = [{itemMasterId: 1}, {itemMasterId: 2}, {itemMasterId: 3}];
      scope.masterItemsList = [{id: 1}, {id: 2}, {id: 5}];
      scope.$apply();
      expect(scope.filteredMasterItemList.length).toBe(1);
    });

    describe('add new items to store instance', function () {
      beforeEach(function(){
        scope.emptyMenuItems = [];
        scope.menuItems = [{itemMasterId: 1}, {itemMasterId: 2}];
        scope.masterItemsList = [{id: 1}, {id: 2}, {id: 3}];
        scope.$apply();
      });

      it('should add X number if items based on addItemsNumber variable', function () {
        scope.addItemsNumber = 10;
        scope.addItems();
        expect(scope.emptyMenuItems.length).toBe(10);
      });
      it('should not let the user add items if there is no available items', function () {
        scope.masterItemsList = [{id: 1}, {id: 2}];
        scope.addItemsNumber = 10;
        scope.$apply();
        scope.addItems();
        expect(scope.emptyMenuItems.length).toBe(0);
      });
    });

  });


});
