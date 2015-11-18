'use strict';

describe('Controller: StoreInstancePackingCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-details.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/threshold-list.json'));
  beforeEach(module('served/count-types.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-item-list.json'));
  beforeEach(module('served/characteristics.json'));
  beforeEach(module('served/company-reason-codes.json'));

  var StoreInstancePackingCtrl;
  var scope;
  var controller;
  var storeInstancePackingFactory;
  var mockStoreInstanceId;

  var storeDetailsDeferred;
  var itemTypesDeferred;
  var thresholdListDeferred;
  var countTypesDeferred;
  var masterItemsListDeferred;
  var menuItemsListDeferred;
  var instanceItemsListDeferred;
  var characteristicsDeferred;
  var reasonCodesDeferred;
  var saveItemDeferred;


  var storeDetailsResponseJSON;
  var itemTypesResponseJSON;
  var thresholdListResponseJSON;
  var countTypesResponseJSON;
  var masterItemsListResponseJSON;
  var menuItemsListResponseJSON;
  var instanceItemsListResponseJSON;
  var characteristicsResponseJSON;
  var reasonCodesResponseJSON;
  //var dateUtility;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceDetails_, _servedItemTypes_, _servedThresholdList_, _servedCountTypes_,
                     _servedMasterItemList_, _servedStoreInstanceMenuItems_, _servedStoreInstanceItemList_, _servedCharacteristics_, _servedCompanyReasonCodes_) {
      storeDetailsResponseJSON = _servedStoreInstanceDetails_;
      itemTypesResponseJSON = _servedItemTypes_;
      thresholdListResponseJSON = _servedThresholdList_;
      countTypesResponseJSON = _servedCountTypes_;
      masterItemsListResponseJSON = _servedMasterItemList_;
      menuItemsListResponseJSON = _servedStoreInstanceMenuItems_;
      instanceItemsListResponseJSON = _servedStoreInstanceItemList_;
      characteristicsResponseJSON = _servedCharacteristics_;
      reasonCodesResponseJSON = _servedCompanyReasonCodes_;
    });

    scope = $rootScope.$new();
    controller = $controller;
    mockStoreInstanceId = 123;
    storeInstancePackingFactory = $injector.get('storeInstancePackingFactory');

    storeDetailsDeferred = $q.defer();
    storeDetailsDeferred.resolve(storeDetailsResponseJSON);

    itemTypesDeferred = $q.defer();
    itemTypesDeferred.resolve(itemTypesResponseJSON);

    thresholdListDeferred = $q.defer();
    thresholdListDeferred.resolve(thresholdListResponseJSON);

    countTypesDeferred = $q.defer();
    countTypesDeferred.resolve(countTypesResponseJSON);

    masterItemsListDeferred = $q.defer();
    masterItemsListDeferred.resolve(masterItemsListResponseJSON);

    menuItemsListDeferred = $q.defer();
    menuItemsListDeferred.resolve(menuItemsListResponseJSON);

    instanceItemsListDeferred = $q.defer();
    instanceItemsListDeferred.resolve(instanceItemsListResponseJSON);

    characteristicsDeferred = $q.defer();
    characteristicsDeferred.resolve(characteristicsResponseJSON);

    reasonCodesDeferred = $q.defer();
    reasonCodesDeferred.resolve(reasonCodesResponseJSON);

    saveItemDeferred = $q.defer();
    saveItemDeferred.resolve({});

    //  dateUtility = $injector.get('dateUtility');
    spyOn(storeInstancePackingFactory, 'getStoreDetails').and.returnValue(storeDetailsDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getItemTypes').and.returnValue(itemTypesDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getThresholdList').and.returnValue(thresholdListDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getCountTypes').and.returnValue(countTypesDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getItemsMasterList').and.returnValue(masterItemsListDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getStoreInstanceMenuItems').and.returnValue(menuItemsListDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getStoreInstanceItemList').and.returnValue(instanceItemsListDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getCharacteristics').and.returnValue(characteristicsDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getReasonCodeList').and.returnValue(reasonCodesDeferred.promise);
    spyOn(storeInstancePackingFactory, 'updateStoreInstanceItem').and.returnValue(saveItemDeferred);
    spyOn(storeInstancePackingFactory, 'createStoreInstanceItem').and.returnValue(saveItemDeferred);
    spyOn(storeInstancePackingFactory, 'deleteStoreInstanceItem').and.returnValue(saveItemDeferred);
    spyOn(storeInstancePackingFactory, 'updateStoreInstanceStatus');
  }));

  function initController(action) {
    StoreInstancePackingCtrl = controller('StoreInstancePackingCtrl', {
      $scope: scope,
      $routeParams: {
        storeId: mockStoreInstanceId,
        action: ( action ? action : 'dispatch')
      }
    });
  }

  describe('initialization', function () {

    describe('init all shared and dispatch API calls', function () {
      beforeEach(function () {
        initController();
        scope.$digest();
      });

      it('should getStoreDetails and attach it to scope', function () {
        expect(storeInstancePackingFactory.getStoreDetails).toHaveBeenCalledWith(mockStoreInstanceId);
      });

      it('should get regular item type ID', function () {
        expect(storeInstancePackingFactory.getItemTypes).toHaveBeenCalled();
        expect(scope.regularItemTypeId).toBeDefined();
        expect(scope.regularItemTypeId).toEqual(1); // Regular item from mock JSON
      });

      it('should get inventory characteristic Id', function () {
        expect(storeInstancePackingFactory.getCharacteristics).toHaveBeenCalled();
        expect(scope.characteristicFilterId).toBeDefined();
        expect(scope.characteristicFilterId).toEqual(1); // Inventory characteristic from mock JSON
      });

      it('should get a threshold variance', function () {
        expect(storeInstancePackingFactory.getThresholdList).toHaveBeenCalledWith('STOREDISPATCH');
        expect(scope.variance).toBeDefined();
      });

      it('should get a list of count types', function () {
        expect(storeInstancePackingFactory.getCountTypes).toHaveBeenCalled();
        expect(scope.countTypes).toEqual(countTypesResponseJSON)
      });

      it('should get items master list', function () {
        expect(storeInstancePackingFactory.getItemsMasterList).toHaveBeenCalled();
        expect(scope.masterItemsList).toEqual(masterItemsListResponseJSON.masterItems);
      });

      it('should get store instance menu items for current store instance', function () {
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 1,
          date: '20150813'
        };
        expect(storeInstancePackingFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedPayload);
      });

      it('should get store instance items for current store instance', function () {
        expect(storeInstancePackingFactory.getStoreInstanceItemList).toHaveBeenCalledWith(mockStoreInstanceId);
      });

    });

    describe('replenish init API calls', function () {
      beforeEach(function () {
        initController('replenish');
        scope.$digest();
      });

      it('should get upliftable characteristic Id', function () {
        expect(storeInstancePackingFactory.getCharacteristics).toHaveBeenCalled();
        expect(scope.characteristicFilterId).toBeDefined();
        expect(scope.characteristicFilterId).toEqual(2); // Upliftable characteristic from mock JSON
      });
    });

    describe('redispatch init API calls', function () {
      beforeEach(function () {
        initController('redispatch');
        scope.$digest();
      });

      it('should get a list of ullage reason codes', function () {
        expect(storeInstancePackingFactory.getReasonCodeList).toHaveBeenCalled();
        expect(scope.ullageReasonCodes).toBeDefined();
      });

      it('should get store instance items for previous store instance', function () {
        var prevInstanceId = 18; // from mock JSON
        expect(storeInstancePackingFactory.getStoreInstanceItemList).toHaveBeenCalledWith(prevInstanceId);
      });
    });
  });

  describe('items merging', function () {

    describe('merge items for dispatch / replenish', function () {
      var mockItemsResponseFromAPI;
      var menuItems;
      var storeInstanceItems;
      beforeEach(function () {
        initController();
        scope.$digest();

        menuItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              menuQuantity: 1,
              itemMasterId: 1
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              menuQuantity: 2,
              itemMasterId: 2
            }
          ]
        };
        storeInstanceItems = {
          response: [
            {
              itemCode: 'ITM3',
              menuQuantity: 3,
              quantity: 3,
              countTypeId: 1
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              quantity: 4,
              itemMasterId: 2,
              countTypeId: 1
            }
          ]
        };

        scope.pickListItems = [];
      });

      it('should add all menu items to pick list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.pickListItems[0].menuQuantity).toEqual(1);
        expect(scope.pickListItems[1].menuQuantity).toEqual(2);
      });

      it('should add all store instance items to pick list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, {}, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.pickListItems[0].pickedQuantity).toEqual('3');
        expect(scope.pickListItems[1].pickedQuantity).toEqual('4');
      });

      it('should merge store instance items that are in common with menu items', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(3);
        expect(scope.pickListItems[1].menuQuantity).toEqual(2);
        expect(scope.pickListItems[1].pickedQuantity).toEqual('4');
      });

    });

    describe('merge items for end-instance', function () {
      var mockItemsResponseFromAPI;
      var menuItems;
      var storeInstanceItems;
      beforeEach(function () {
        initController('end-instance');
        scope.$digest();
        menuItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              menuQuantity: 1,
              itemMasterId: 1
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              menuQuantity: 2,
              itemMasterId: 2
            }
          ]
        };
        storeInstanceItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              quantity: 3,
              itemMasterId: 1,
              countTypeId: 14
            },
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              quantity: 4,
              ullageReasonCode: 48,
              itemMasterId: 1,
              countTypeId: 7
            }
          ]
        };

        scope.pickListItems = [];
        scope.offloadListItems = [];
      });

      it('should add items to offload list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(0);
        expect(scope.offloadListItems.length).toEqual(2);
      });

      it('should merge offload quantities', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
        expect(scope.offloadListItems[0].inboundQuantity).toEqual('3');
      });

      it('should merge ullage quantities', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
        expect(scope.offloadListItems[0].ullageQuantity).toBeDefined();
      });
    });

    describe('merge items for redispatch', function () {
      var mockItemsResponseFromAPI;
      var menuItems;
      var storeInstanceItems;
      var prevInstanceItems;
      beforeEach(function () {
        initController('redispatch');
        scope.$digest();
        menuItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              menuQuantity: 1,
              itemMasterId: 1
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              menuQuantity: 2,
              itemMasterId: 2
            }
          ]
        };
        storeInstanceItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              quantity: 3,
              itemMasterId: 1,
              countTypeId: 1
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              quantity: 4,
              itemMasterId: 2,
              countTypeId: 3 // warehouse close
            }
          ]
        };
        prevInstanceItems = {
          response: [
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              quantity: 5,
              itemMasterId: 1,
              countTypeId: 14 // offload
            },
            {
              itemName: 'item1',
              itemCode: 'ITM1',
              quantity: 6,
              ullageReasonCode: 48,
              itemMasterId: 1,
              countTypeId: 7 // ullage
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              quantity: 7,
              itemMasterId: 2,
              countTypeId: 13 // warehouse close
            }
          ]
        };
        scope.pickListItems = [];
        scope.offloadListItems = [];
      });

      it('should add all menu items to pick list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, [], []];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(0);
      });

      it('should add all current store instance items to pick list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, [], storeInstanceItems, []];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(0);
      });

      it('should only add all offload items to offload list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, [], prevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(1);
      });

      it('should add all warehouse close items to pick list', function () {
        mockItemsResponseFromAPI = [{masterItems: []}, menuItems, [], prevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(1);
        expect(scope.pickListItems[1].inboundQuantity).toEqual('7');
      });
    });
  });

  describe('save packing data', function () {

    describe('save for dispatch/replenish', function () {
      beforeEach(function () {
        initController();
        scope.$digest();

        scope.pickListItems = [{
          itemMasterId: 1,
          pickedQuantity: 1,
          pickedId: 1
        }, {
          itemMasterId: 2,
          pickedQuantity: 2
        }, {
          itemMasterId: 2,
          pickedQuantity: 0
        }];

        StoreInstancePackingCtrl.itemsToDeleteArray = [{
          id: 3,
          storeInstanceId: 4
        }];
      });

      it('should call DELETE for items in delete list', function () {
        scope.save();
        expect(storeInstancePackingFactory.deleteStoreInstanceItem).toHaveBeenCalledWith(4, 3);
      });


      it('should call CREATE for new items', function () {
        scope.save();
        var expectedPayload = {
          itemMasterId: 2,
          quantity: 2,
          countTypeId: 1
        };
        expect(storeInstancePackingFactory.createStoreInstanceItem).toHaveBeenCalledWith(mockStoreInstanceId, expectedPayload);
      });

      it('should call UPDATE for existing items', function () {
        scope.save();
        var expectedPayload = {
          itemMasterId: 1,
          quantity: 1,
          countTypeId: 1,
          id: 1
        };
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(mockStoreInstanceId, 1, expectedPayload);
      });

      it('should update status after save', function () {
        var expectedNextStep = '2'; // ready for seals
        scope.shouldUpdateStatus = true;
        scope.save();
        scope.$digest();
        expect(storeInstancePackingFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(mockStoreInstanceId, expectedNextStep);
      });

    });

    describe('save for end-instance', function () {
      beforeEach(function () {
        initController('end-instance');
        scope.$digest();

        scope.pickListItems = [{
          itemMasterId: 1,
          pickedQuantity: 1,
          pickedId: 1
        }];
        scope.offloadListItems = [{
          itemMasterId: 4,
          inboundQuantity: 2,
          ullageQuantity: 3,
          ullageReason: {id:48},
          inboundId: 2,
          ullageId: 3
        }];
      });

      it('should save ullage and inbound quantities separately', function () {
        scope.save();
        var expectedUllagePayload = {
          itemMasterId: 4,
          quantity: 3,
          ullageReasonCode: 48,
          countTypeId: 7, // ullage
          id: 3
        };
        var expectedInboundPayload = {
          itemMasterId: 4,
          quantity: 2,
          countTypeId: 14, // offload
          id: 2
        };
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(mockStoreInstanceId, 2, expectedInboundPayload);
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(mockStoreInstanceId, 3, expectedUllagePayload);

      });
    });

    describe('save for redispatch', function () {
      var prevStoreInstance = 18; // froms tore details mock
      beforeEach(function () {
        initController('redispatch');
        scope.$digest();
        scope.pickListItems = [{
          itemMasterId: 1,
          pickedQuantity: 1,
          inboundQuantity: 2,
          pickedId: 1,
          inboundId: 2

        }];
        scope.offloadListItems = [{
          itemMasterId: 3,
          inboundQuantity: 3,
          inboundId: 3
        }];
      });
      it('should save offload items to prev instance', function () {
        scope.save();
        var expectedPayload = {
          itemMasterId: 3,
          quantity: 3,
          countTypeId: 14, // offload
          id: 3
        };
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(prevStoreInstance, 3, expectedPayload);
      });

      it('should save pick list items to current instance', function () {
        scope.save();
        var expectedPayload = {
          itemMasterId: 1,
          quantity: 1,
          countTypeId: 1, // warehouse open
          id: 1
        };
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(mockStoreInstanceId, 1, expectedPayload);
      });

      it('should save warehouse close items to prev instance', function () {
        scope.save();
        var expectedPayload = {
          itemMasterId: 1,
          quantity: 2,
          countTypeId: 13, // warehouse close
          id: 2
        };
        expect(storeInstancePackingFactory.updateStoreInstanceItem).toHaveBeenCalledWith(prevStoreInstance, 2, expectedPayload);
      });

      it('should update status for current instance and prev instance', function () {
        it('should update status after save', function () {
          var expectedNextStep = '2'; // ready for seals
          var expectedNextStepForPrevInstance = '7'; // ready for seals
          scope.shouldUpdateStatus = true;
          scope.save();
          scope.$digest();
          expect(storeInstancePackingFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(mockStoreInstanceId, expectedNextStep);
          expect(storeInstancePackingFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(prevStoreInstance, expectedNextStepForPrevInstance);
        });
      });
    });
  });

  describe('Items List Array Manipulations', function () {

    beforeEach(function () {
      initController('redispatch');
      scope.$digest();
      scope.newPickListItems = [];
      scope.newOffloadListItems = [];
    });

    describe('adding items', function () {
      it('should add multiple empty item to pick/offload list for given number', function () {
        scope.addPickListNum = 3;
        scope.addItems();
        expect(scope.newPickListItems.length).toEqual(3);

        scope.addOffloadNum = 5;
        scope.addOffloadItems();
        expect(scope.newOffloadListItems.length).toEqual(5);
      });
    });

   describe('removing items', function () {
      it('should remove new items from newPickListItems', function () {
        scope.newPickListItems = [{id:1, isNewItem: true}, {id: 2, isNewItem: true}];
        scope.removeRecord(scope.newPickListItems[0]);
        expect(scope.newPickListItems.length).toEqual(1);
        expect(scope.newPickListItems[0].id).toEqual(2);
      });

      it('should remove existing items and add them to itemsToDelete array', function () {
        scope.itemsToDeleteArray = [];
        scope.pickListItems = [{
          itemMasterId: 1,
          pickedQuantity: 1,
          pickedId: 1,
          isNewItem: false
        }, {
          itemMasterId: 2,
          pickedQuantity: 2,
          pickedId: 4,
          isNewItem: false
        }];
        scope.removeRecord(scope.pickListItems[1]);
        expect(scope.pickListItems.length).toEqual(1);
        expect(StoreInstancePackingCtrl.itemsToDeleteArray.length).toEqual(1);
      });

      it('should remove existing items and separate quantities in itemsToDelete array', function () {
        scope.itemsToDeleteArray = [];
        scope.pickListItems = [{
          itemMasterId: 2,
          pickedQuantity: 2,
          ullageQuantity: 3,
          pickedId: 4,
          ullageId: 6,
          isNewItem: false
        }];
        scope.removeRecord(scope.pickListItems[0]);
        expect(scope.pickListItems.length).toEqual(0);
        expect(StoreInstancePackingCtrl.itemsToDeleteArray.length).toEqual(2);
      });

    });

  });

  describe('variance helper functions', function () {
    var mockItem;
    beforeEach(function () {
      initController();
      scope.$digest();
      scope.variance = 20;
      mockItem = {
        menuQuantity: 10,
        pickedQuantity: 10,
        isMenuItem: true
      };
    });
    it('should not mark items with pickedQuantity == menuQuantity', function () {
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });

    it('should mark items with pickedQuantity >> menuQuantity', function () {
      mockItem.pickedQuantity = 1000;
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(true);
    });

    it('should not mark items with pickedQuantity < menuQuantity', function () {
      mockItem.pickedQuantity = 9;
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });

    it('should not mark items with low variance', function () {
      mockItem.pickedQuantity = 11;
      StoreInstancePackingCtrl.calculateVariance(mockItem);
      expect(mockItem.exceedsVariance).toEqual(false);
    });
  });

});

// TODO: left to test:
// add new items
// delete items
// save items + payload
// picked calculation
// variance calculation
//

//describe('merging pick list items', function () {
//
//});
//
//describe('merging offload items', function () {
//
//});
//
//describe('merging all redispatch items', function () {
//
//});

