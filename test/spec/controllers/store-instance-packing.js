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
  beforeEach(module('served/company-reason-codes.json'));
  beforeEach(module('served/count-types.json'));
  beforeEach(module('served/features.json'));
  beforeEach(module('served/threshold-list.json'));


  var StoreInstancePackingCtrl;
  var scope;
  var storeInstanceFactory;
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
  var getCountTypesDeferred;
  var servedCountTypesJSON;
  var getCompanyReasonCodesDeferred;
  var servedCompanyReasonCodesJSON;
  var getFeaturesDeferred;
  var getFeaturesJSON;
  var getThresholdDeferred;
  var getThresholdJSON;
  var dateUtility;
  var storeId;
  var controller;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceMenuItems_, _servedStoreInstanceItemList_, _servedMasterItemList_,
                     _servedStoreInstanceDetails_, _servedStoreStatusResponse_, _servedCharacteristics_,
                     _servedItemTypes_, _servedCompanyReasonCodes_, _servedCountTypes_, _servedFeatures_, _servedThresholdList_) {
      servedStoreInstanceMenuItemsJSON = _servedStoreInstanceMenuItems_;
      servedStoreInstanceItemsJSON = _servedStoreInstanceItemList_;
      servedMasterItemsJSON = _servedMasterItemList_;
      servedStoreInstanceDetailsJSON = _servedStoreInstanceDetails_;
      servedStoreStatusJSON = _servedStoreStatusResponse_;
      servedItemTypesJSON = _servedItemTypes_;
      servedCharacteristicsJSON = _servedCharacteristics_;
      servedCountTypesJSON = _servedCountTypes_;
      servedCompanyReasonCodesJSON = _servedCompanyReasonCodes_;
      getFeaturesJSON = _servedFeatures_;
      getThresholdJSON = _servedThresholdList_;
    });
    storeId = 5;
    scope = $rootScope.$new();
    controller = $controller;

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

    getCountTypesDeferred = $q.defer();
    getCountTypesDeferred.resolve(servedCountTypesJSON);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(servedCompanyReasonCodesJSON);

    getFeaturesDeferred = $q.defer();
    getFeaturesDeferred.resolve(getFeaturesJSON);

    getThresholdDeferred = $q.defer();
    getThresholdDeferred.resolve(getThresholdJSON);

    dateUtility = $injector.get('dateUtility');

    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(getStoreInstanceMenuItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemsMasterList').and.returnValue(getMasterItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(getUpdatedStoreStatusDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemTypes').and.returnValue(getItemTypesDeferred.promise);
    spyOn(storeInstanceFactory, 'getCharacteristics').and.returnValue(getCharacteristicsDeferred.promise);
    spyOn(storeInstanceFactory, 'getCountTypes').and.returnValue(getCountTypesDeferred.promise);
    spyOn(storeInstanceFactory, 'getReasonCodeList').and.returnValue(getCompanyReasonCodesDeferred.promise);
    spyOn(storeInstanceFactory, 'getFeaturesList').and.returnValue(getFeaturesDeferred.promise);
    spyOn(storeInstanceFactory, 'getThresholdList').and.returnValue(getThresholdDeferred.promise);

  }));

  function initController(action) {
    StoreInstancePackingCtrl = controller('StoreInstancePackingCtrl', {
      $scope: scope,
      $routeParams: {
        storeId: storeId,
        action: ( action ? action : 'dispatch')
      }
    });
  }

  describe('when the controller initializes', function () {

    describe('during the dispatch process', function () {

      beforeEach(function () {
        initController();
        getStoreDetailsDeferred.resolve(servedStoreInstanceDetailsJSON);
        scope.$digest();
      });

      it('should get the store details', function () {
        expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(storeId);
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeDetails).toEqual(servedStoreInstanceDetailsJSON);
      });

      it('should call getItemTypes', function () {
        expect(storeInstanceFactory.getItemTypes).toHaveBeenCalled();
      });

      it('should call getStoreInstanceItems', function () {
        expect(storeInstanceFactory.getStoreInstanceItemList).toHaveBeenCalledWith(storeId);
      });

      it('should call getFeatures', function () {
        expect(storeInstanceFactory.getFeaturesList).toHaveBeenCalled();
      });

      it('should cal getThresholdList', function () {
        expect(storeInstanceFactory.getThresholdList).toHaveBeenCalled();
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

    describe('during the replenish process', function () {

      beforeEach(function () {
        initController('replenish');
        getStoreDetailsDeferred.resolve(servedStoreInstanceDetailsJSON);
        scope.$digest();
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
        expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(scope.storeDetails.replenishStoreInstanceId, expectedPayload);
      });

      it('should call getItemsMasterList', function () {
        var formattedDate = dateUtility.formatDateForAPI(servedStoreInstanceDetailsJSON.scheduleDate);
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 2,
          startDate: formattedDate,
          endDate: formattedDate
        };
        expect(storeInstanceFactory.getItemsMasterList).toHaveBeenCalledWith(expectedPayload);
      });

    });

    describe('during the end-instance process', function () {

      beforeEach(function () {
        initController('end-instance');
        getStoreDetailsDeferred.resolve(servedStoreInstanceDetailsJSON);
        scope.$digest();
      });

      it('should call getCharacteristics', function () {
        expect(storeInstanceFactory.getReasonCodeList).toHaveBeenCalled();
      });

      it('should call getStoreInstanceMenuItems with Regular and Inventory filters', function () {
        var formattedDate = dateUtility.formatDateForAPI(servedStoreInstanceDetailsJSON.scheduleDate);
        var expectedPayload = {
          itemTypeId: 1, // this is 1 because we are requesting regular items.
          characteristicId: 1, // this is 1 for inventory items
          date: formattedDate
        };
        expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(storeId, expectedPayload);
      });

      it('should call getItemsMasterList', function () {
        var formattedDate = dateUtility.formatDateForAPI(servedStoreInstanceDetailsJSON.scheduleDate);
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 1, // this is 1 for inventory items
          startDate: formattedDate,
          endDate: formattedDate
        };
        expect(storeInstanceFactory.getItemsMasterList).toHaveBeenCalledWith(expectedPayload);
      });

    });

  });

  describe('formatStoreInstanceItemsPayload', function () {
    beforeEach(function () {
      initController();
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
      var result = StoreInstancePackingCtrl.createPayload();
      expect(result.response.length).toEqual(expectedLength);
    });

    it('should only keep id, itemMasterId, and quantity for menuItems', function () {
      var result = StoreInstancePackingCtrl.createPayload();
      var expectdItem = {
        id: 1,
        itemMasterId: 2,
        quantity: 3
      };
      expect(result.response[0]).toEqual(expectdItem);
    });
    it('should only keep itemMasterId and quantity for emptyMenuItems', function () {
      var result = StoreInstancePackingCtrl.createPayload();
      var expectdItem = {
        itemMasterId: 5,
        quantity: 9
      };
      expect(result.response[2]).toEqual(expectdItem);
    });
  });

  describe('filtered master menu items', function () {

    beforeEach(function() {
      initController();
    });

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

  describe('if a user can proceed', function () {

    beforeEach(function() {
      initController();
    });

    it('should allow the user to proceed if there are menu items in the view', function () {
      scope.menuItems = [{itemMasterId: 1}, {itemMasterId: 2}, {itemMasterId: 3}];
      scope.$digest();
      var canProceed = scope.canProceed();
      expect(canProceed).toBeTruthy();
    });

    it('should allow the user to proceed if there are menu items in the view', function () {
      scope.emptyMenuItems = [{
        quantity: 9,
        nonsenseKey: 4,
        masterItem: {id: 5}
      }];
      scope.$digest();
      var canProceed = scope.canProceed();
      expect(canProceed).toBeTruthy();
    });

    it('should not allow the user to proceed if there are no items in the view', function () {
      scope.emptyMenuItems = [];
      scope.menuItems = [];
      scope.$digest();
      var canProceed = scope.canProceed();
      expect(canProceed).toBeFalsy();
    });

  });

  describe('checking an action state', function () {

    it('should return true if the state passed matches the action state of the controller', function () {
      initController();
      var isDispatch = scope.isActionState('dispatch');
      expect(isDispatch).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller', function () {
      initController();
      var isDispatch = scope.isActionState('replenish');
      expect(isDispatch).toBeFalsy();
    });

    it('should return true if the state passed matches the action state of the controller', function () {
      initController('replenish');
      var isReplenish = scope.isActionState('replenish');
      expect(isReplenish).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller', function () {
      initController();
      var isReplenish = scope.isActionState('replenish');
      expect(isReplenish).toBeFalsy();
    });

  });

  describe('variance calculation', function () {
    var mockItem;
    beforeEach(function() {
      initController();
      scope.variance = 50;
      mockItem = {
        quantity: 1000,
        menuQuantity: 10
      };
    });

    it('should set item.exceedsVariance to true if threshold exceeds variance', function () {
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(true);
    });
    it('should set item.exceedsVariance to false if threshold is equal to variance', function () {
      mockItem = {
        quantity: 10,
        menuQuantity: 10
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
    it('should set item.exceedsVariance to false if threshold is less than variance', function () {
      mockItem = {
        quantity: 11,
        menuQuantity: 10
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
    it('should item.exceedsVariance to false if picked < required quantity', function () {
      mockItem = {
        quantity: 9,
        menuQuantity: 10
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
    it('should accept null or undefined values', function () {
      mockItem = {
        quantity: null,
        menuQuantity: null
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
    it('should accept undefined values', function () {
      mockItem = {};
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
    it('should accept string values', function () {
      mockItem = {
        quantity: '900',
        menuQuantity: '10'
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(true);
    });
    it('should use calculated totalQuantity if state is redispatch', function () {
      initController('redispatch');
      mockItem = {
        quantity: 3,
        inboundQuantity: 100,
        ullageQuantity: 2,
        menuQuantity: 10
      };
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(true);
    });
  });


});
