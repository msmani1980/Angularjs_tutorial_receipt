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
  beforeEach(module('served/company-preferences.json'));
  beforeEach(module('served/calculated-inbounds.json'));

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
  var companyPreferencesDeferred;
  var calculatedInboundsDeferred;

  var storeDetailsResponseJSON;
  var itemTypesResponseJSON;
  var thresholdListResponseJSON;
  var countTypesResponseJSON;
  var masterItemsListResponseJSON;
  var menuItemsListResponseJSON;
  var instanceItemsListResponseJSON;
  var characteristicsResponseJSON;
  var reasonCodesResponseJSON;
  var companyPreferencesResponseJSON;
  var calculatedInboundsResponseJSON;

  //var dateUtility;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceDetails_, _servedItemTypes_, _servedThresholdList_, _servedCountTypes_,
                     _servedMasterItemList_, _servedStoreInstanceMenuItems_, _servedStoreInstanceItemList_, _servedCharacteristics_,
                     _servedCompanyReasonCodes_, _servedCompanyPreferences_, _servedCalculatedInbounds_) {
      storeDetailsResponseJSON = _servedStoreInstanceDetails_;
      itemTypesResponseJSON = _servedItemTypes_;
      thresholdListResponseJSON = _servedThresholdList_;
      countTypesResponseJSON = _servedCountTypes_;
      masterItemsListResponseJSON = _servedMasterItemList_;
      menuItemsListResponseJSON = _servedStoreInstanceMenuItems_;
      instanceItemsListResponseJSON = _servedStoreInstanceItemList_;
      characteristicsResponseJSON = _servedCharacteristics_;
      reasonCodesResponseJSON = _servedCompanyReasonCodes_;
      companyPreferencesResponseJSON = _servedCompanyPreferences_;
      calculatedInboundsResponseJSON = _servedCalculatedInbounds_;
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

    companyPreferencesDeferred = $q.defer();
    companyPreferencesDeferred.resolve(companyPreferencesResponseJSON);

    calculatedInboundsDeferred = $q.defer();
    calculatedInboundsDeferred.resolve(calculatedInboundsResponseJSON);

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
    spyOn(storeInstancePackingFactory, 'getCompanyPreferences').and.returnValue(companyPreferencesDeferred.promise);
    spyOn(storeInstancePackingFactory, 'getCalculatedInboundQuantities').and.returnValue(companyPreferencesDeferred.promise);
    spyOn(storeInstancePackingFactory, 'createStoreInstanceItems').and.returnValue(saveItemDeferred.promise);
    spyOn(storeInstancePackingFactory, 'updateStoreInstanceItems').and.returnValue(saveItemDeferred.promise);

  }));

  function initController(action) {
    StoreInstancePackingCtrl = controller('StoreInstancePackingCtrl', {
      $scope: scope,
      $routeParams: {
        storeId: mockStoreInstanceId,
        action: (action ? action : 'dispatch')
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

      describe('initialize variance', function () {
        it('should get a threshold variance', function () {
          expect(storeInstancePackingFactory.getThresholdList).toHaveBeenCalledWith('STOREDISPATCH');
          expect(scope.variance).toBeDefined();
        });
        it('should set variance closest to today', function () {
          expect(scope.variance).toEqual(5.26); // closes variance to today on threshold-list.json
        });
      });

      it('should get a list of count types', function () {
        expect(storeInstancePackingFactory.getCountTypes).toHaveBeenCalled();
        expect(scope.countTypes).toEqual(countTypesResponseJSON);
      });

      it('should get items master list', function () {
        expect(storeInstancePackingFactory.getItemsMasterList).toHaveBeenCalled();
        expect(scope.masterItemsList).toEqual(masterItemsListResponseJSON.masterItems);
      });

      it('should get store instance menu items', function () {
        expect(storeInstancePackingFactory.getStoreInstanceMenuItems).toHaveBeenCalled();
      });

      it('should get store instance items for current store instance', function () {
        expect(storeInstancePackingFactory.getStoreInstanceItemList).toHaveBeenCalledWith(mockStoreInstanceId, { showEpos: true });
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
        expect(storeInstancePackingFactory.getStoreInstanceItemList).toHaveBeenCalledWith(prevInstanceId, { showEpos: true });
      });

      it('should get company preferences', function () {
        expect(storeInstancePackingFactory.getCompanyPreferences).toHaveBeenCalled();
        expect(scope.shouldDefaultInboundToEpos).toBeDefined();
      });

      it('should get calculated Inbound Quantities', function () {
        var prevInstanceId = 18; // from mock JSON
        expect(storeInstancePackingFactory.getCalculatedInboundQuantities).toHaveBeenCalledWith(prevInstanceId, {});
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
            },
            {
              itemName: 'item2',
              itemCode: 'ITM2',
              menuQuantity: 3,
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

      it('should add all unique menu items to pick list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.pickListItems[0].itemMasterId).toEqual(1);
        expect(scope.pickListItems[1].itemMasterId).toEqual(2);
      });

      it('should sum duplicate menu items', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems[1].menuQuantity).toEqual(5);
      });

      it('should add all store instance items to pick list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, {}, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.pickListItems[0].pickedQuantity).toEqual('3');
        expect(scope.pickListItems[1].pickedQuantity).toEqual('4');
      });

      it('should merge store instance items that are in common with menu items', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(3);
        expect(scope.pickListItems[1].menuQuantity).toEqual(5);
        expect(scope.pickListItems[1].pickedQuantity).toEqual('4');
      });

      it('should copy final menu quantities to dispatched quantities', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems[0].pickedQuantity).toEqual(1);
        expect(scope.pickListItems[1].pickedQuantity).toEqual(5);
      });

    });

    describe('merge items for end-instance', function () {
      var mockItemsResponseFromAPI;
      var menuItems;
      var redispatchParentMenuItems;
      var storeInstanceItems;
      var calculatedEposInboundQuantities;
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
        redispatchParentMenuItems = {
          response: [
            {
              itemName: 'item6',
              itemCode: 'ITM6',
              menuQuantity: 1,
              itemMasterId: 6
            },
            {
              itemName: 'item7',
              itemCode: 'ITM7',
              menuQuantity: 2,
              itemMasterId: 7
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

        calculatedEposInboundQuantities = {
          response: [
            {
              id: 1,
              quantity: 100
            }
          ]
        };

        scope.pickListItems = [];
        scope.offloadListItems = [];
      });

      it('should add items to offload list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(0);
        expect(scope.offloadListItems.length).toEqual(2);
      });

      it('should merge offload quantities', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
        expect(scope.offloadListItems[0].inboundQuantity).toEqual('3');
      });

      it('should merge ullage quantities', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
        expect(scope.offloadListItems[0].ullageQuantity).toBeDefined();
      });

      it('should not add items to Offload list that are not part of store instance menu', function () {
        var itemThatIsNotInMenu = {
          itemName: 'item10',
          itemCode: 'ITM10',
          quantity: 5,
          itemMasterId: 10,
          countTypeId: 2
        };

        storeInstanceItems.response.push(itemThatIsNotInMenu);
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}, {}, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
      });

      it('should not add items to Offload list that are not part of store instance menu or parent store instance menu', function () {
        var itemThatIsNotInMenu = {
          itemName: 'item10',
          itemCode: 'ITM10',
          quantity: 5,
          itemMasterId: 10,
          countTypeId: 2
        };
        var itemThatIsInParentStoreInstanceMenu = {
          itemName: 'item7',
          itemCode: 'ITM7',
          quantity: 2,
          itemMasterId: 7,
          countTypeId: 1
        };
        storeInstanceItems.response.push(itemThatIsNotInMenu);
        storeInstanceItems.response.push(itemThatIsInParentStoreInstanceMenu);
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}, {}, redispatchParentMenuItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(3);
      });

      it('should not add FAClose items that do not overlap with existing items', function () {
        var faCloseItem = {
          itemName: 'item3',
          itemCode: 'ITM3',
          quantity: 4,
          itemMasterId: 3,
          countTypeId: 2  // FAClose count type
        };
        storeInstanceItems.response.push(faCloseItem);
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
      });

      it('should not add FAOpen items that do not overlap with existing items', function () {
        var faOpenItem = {
          itemName: 'item3',
          itemCode: 'ITM3',
          quantity: 4,
          itemMasterId: 3,
          countTypeId: 12  // FAOpen count type
        };
        storeInstanceItems.response.push(faOpenItem);
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(2);
      });

      it('should merge calculated epos inbound counts in company preference is set to true and data exists', function () {
        scope.shouldDefaultInboundToEpos = true;
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}, calculatedEposInboundQuantities];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems[0].inboundQuantity).toEqual(100);
      });

      it('should merge epos FAClose counts if inbound company preference is set to false', function () {
        scope.shouldDefaultInboundToEpos = false;
        var faOpenItem = {
          itemName: 'item3',
          itemCode: 'ITM3',
          quantity: 300,
          itemMasterId: 1,
          countTypeId: 2  // FAClose count type
        };
        storeInstanceItems.response[0] = faOpenItem;
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, calculatedEposInboundQuantities];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems[0].inboundQuantity).toEqual(300);
      });

      it('should default inbound quantity to 0 if there is no data', function () {
        scope.shouldDefaultInboundToEpos = true;
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}, {}];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(parseInt(scope.offloadListItems[0].inboundQuantity)).toEqual(0);
      });

      it('should not merge inbound quantities if new values have been saved to storeInstanceItems', function () {
        scope.shouldDefaultInboundToEpos = true;
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, storeInstanceItems, calculatedEposInboundQuantities];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(parseInt(scope.offloadListItems[0].inboundQuantity)).toEqual(3);
      });
    });

    describe('merge items for redispatch', function () {
      var mockItemsResponseFromAPI;
      var menuItems;
      var storeInstanceItems;
      var prevInstanceItems;
      var calculatedEposInboundQuantities;
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
        calculatedEposInboundQuantities = {
          response: [
            {
              id: 3,
              quantity: 100
            }
          ]
        };

        scope.pickListItems = [];
        scope.offloadListItems = [];
      });

      it('should add all menu items to pick list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, [], {}, []];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(0);
      });

      it('should add all current store instance items to pick list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, [], storeInstanceItems, {}, []];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(0);
      });

      it('should only add all offload items to offload list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, [], {}, prevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(1);
      });

      it('should add all warehouse close items to pick list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, [], {}, prevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems.length).toEqual(2);
        expect(scope.offloadListItems.length).toEqual(1);
        expect(scope.pickListItems[1].inboundQuantity).toEqual('7');
      });

      it('should add expired items to offload list', function () {
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, [], {}, prevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems.length).toEqual(1);
      });

      it('should merge calculated epos inbound counts in pick list if company preference is set to true and data exists', function () {
        scope.shouldDefaultInboundToEpos = true;
        var pickListItem = {
          itemName: 'item3',
          itemCode: 'ITM3',
          menuQuantity: 2,
          itemMasterId: 3
        };
        menuItems.response.push(pickListItem);
        var noInboundQuantityPrevInstanceItems = {
          response: [{
            itemName: 'item1',
            itemCode: 'ITM1',
            quantity: 6,
            ullageReasonCode: 48,
            itemMasterId: 3,
            countTypeId: 7 // ullage
          }]
        };
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}, calculatedEposInboundQuantities, noInboundQuantityPrevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.pickListItems[2].inboundQuantity).toEqual(100);
      });

      it('should merge calculated epos inbound counts offload list if there are no pick list matches and prior criteria is met', function () {
        scope.shouldDefaultInboundToEpos = true;
        var noInboundQuantityPrevInstanceItems = {
          response: [{
            itemName: 'item1',
            itemCode: 'ITM1',
            quantity: 6,
            ullageReasonCode: 48,
            itemMasterId: 3,
            countTypeId: 7 // ullage
          }]
        };
        mockItemsResponseFromAPI = [{ masterItems: [] }, menuItems, {}, calculatedEposInboundQuantities, noInboundQuantityPrevInstanceItems];
        StoreInstancePackingCtrl.mergeAllItems(mockItemsResponseFromAPI);
        expect(scope.offloadListItems[0].inboundQuantity).toEqual(100);
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

      it('should set save in progress flag to prevent multiple submits', function () {
        scope.save();
        expect(StoreInstancePackingCtrl.isSaveInProgress).toEqual(true);
      });

      it('should call DELETE for items in delete list', function () {
        scope.save();
        expect(storeInstancePackingFactory.deleteStoreInstanceItem).toHaveBeenCalledWith(4, 3);
      });

      it('should call CREATE for new items', function () {
        scope.save();
        var expectedPayload = [
          { countTypeId: 1, quantity: 2, itemMasterId: 2 },
          { countTypeId: 1, quantity: 0, itemMasterId: 2 }
        ];
        expect(storeInstancePackingFactory.createStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedPayload);
      });

      it('should call UPDATE for existing items', function () {
        scope.save();
        var expectedPayload = [{
          itemMasterId: 1,
          quantity: 1,
          countTypeId: 1,
          id: 1
        }];
        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedPayload);
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
          ullageReason: { id:48 },
          inboundId: 2,
          ullageId: 3
        }];
      });

      it('should save ullage and inbound quantities separately', function () {
        scope.save();
        var expectedUllagePayload = [
          { countTypeId: 7, quantity: 3, itemMasterId: 4, ullageReasonCode: 48, id: 3 },
          { countTypeId: 14, quantity: 2, itemMasterId: 4, id: 2 }
        ];
        var expectedInboundPayload = [
          { countTypeId: 7, quantity: 3, itemMasterId: 4, ullageReasonCode: 48, id: 3 },
          { countTypeId: 14, quantity: 2, itemMasterId: 4, id: 2 }
        ];

        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedInboundPayload);
        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedUllagePayload);

      });

      it('should save ullage reason as null if ullageQuantity is 0', function () {
        scope.offloadListItems = [{
          itemMasterId: 4,
          inboundQuantity: 2,
          ullageQuantity: 0,
          ullageReason: { id: 50 },
          inboundId: 2,
          ullageId: 3
        }];
        scope.save();
        var expectedUllagePayload = [
          { countTypeId: 7, quantity: 0, itemMasterId: 4, ullageReasonCode: null, id: 3 },
          { countTypeId: 14, quantity: 2, itemMasterId: 4, id: 2 }
        ];

        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedUllagePayload);
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
          oldPickedQuantity: 2,
          inboundQuantity: 2,
          oldInboundQuantity: 3,
          pickedId: 1,
          inboundId: 2,
          isNewItem: false,
          shouldDisplayOffloadData: true
        }];
        scope.offloadListItems = [{
          itemMasterId: 3,
          inboundQuantity: 3,
          oldInboundQuantity: 0,
          inboundId: 3,
          isNewItem: false
        }];
      });

      it('should save offload items to prev instance', function () {
        scope.save();
        var expectedPayload = [{
          itemMasterId: 3,
          quantity: 3,
          countTypeId: 14, // offload
          id: 3
        }];
        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(prevStoreInstance, expectedPayload);
      });

      it('should save pick list items to current instance', function () {
        scope.save();
        var expectedPayload = [{
          itemMasterId: 1,
          quantity: 1,
          countTypeId: 1, // warehouse open
          id: 1
        }];
        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(mockStoreInstanceId, expectedPayload);
      });

      it('should save warehouse close items to prev instance', function () {
        scope.save();
        var expectedPayload = [{
          itemMasterId: 1,
          quantity: 2,
          countTypeId: 13, // warehouse close
          id: 2
        }];
        expect(storeInstancePackingFactory.updateStoreInstanceItems).toHaveBeenCalledWith(prevStoreInstance, expectedPayload);
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
        scope.newPickListItems = [{ id:1, isNewItem: true }, { id: 2, isNewItem: true }];
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

  describe('shouldDisableUllage helper function', function () {
    var ullageReasonDamaged;
    beforeEach(function () {
      initController();
      scope.$digest();
      ullageReasonDamaged = {
        companyId: 403,
        companyReasonCodeName: 'Damaged',
        companyReasonTypeId: 19,
        description: 'Ullage',
        endDat: '2050-01-01',
        id: 48,
        isActive: true,
        reasonTypeId: 15,
        reasonTypeName: 'Ullage',
        startDate: '2015-05-05'
      };
    });

    it('should reset item.ullageReason if ullageQuantity is 0', function () {
      var itemWithZeroUllageQuantity = {
        countTypeId: 1,
        inboundQuantity: 20,
        isEposDataOverwritten: false,
        isInOffload: false,
        isMenuItem: true,
        isNewItem: false,
        itemDescription: 'Brwnie239-Brownie',
        itemMasterId: 10,
        itemName: 'Brownie',
        menuQuantity: 20,
        oldInboundQuantity: -10,
        ldPickedQuantity: 20,
        oldUllageQuantity: -1,
        pickedId: 201277,
        pickedQuantity: 20,
        shouldDisplayOffloadData: true,
        ullageQuantity: 0,
        ullageReason: ullageReasonDamaged
      };

      scope.shouldDisableUllage(itemWithZeroUllageQuantity);
      expect(itemWithZeroUllageQuantity.ullageQuantity).toEqual(0);
      expect(itemWithZeroUllageQuantity.ullageReason).toBeNull();
    });

    it('should reset item.ullageReason if ullageQuantity is null', function () {
      var itemWithNullUllageQuantity = {
        countTypeId: 1,
        inboundQuantity: 20,
        isEposDataOverwritten: false,
        isInOffload: false,
        isMenuItem: true,
        isNewItem: false,
        itemDescription: 'Brwnie239-Brownie',
        itemMasterId: 10,
        itemName: 'Brownie',
        menuQuantity: 20,
        oldInboundQuantity: -10,
        ldPickedQuantity: 20,
        oldUllageQuantity: -1,
        pickedId: 201277,
        pickedQuantity: 20,
        shouldDisplayOffloadData: true,
        ullageQuantity: null,
        ullageReason: ullageReasonDamaged
      };

      scope.shouldDisableUllage(itemWithNullUllageQuantity);
      expect(itemWithNullUllageQuantity.ullageQuantity).toEqual(0);
      expect(itemWithNullUllageQuantity.ullageReason).toBeNull();
    });

    it('should reset item.ullageReason and ite.ullageQuantity if inboundQuantity is 0', function () {
      var itemWithZeroInboundQuantity = {
        countTypeId: 1,
        inboundQuantity: 0,
        isEposDataOverwritten: false,
        isInOffload: false,
        isMenuItem: true,
        isNewItem: false,
        itemDescription: 'Brwnie239-Brownie',
        itemMasterId: 10,
        itemName: 'Brownie',
        menuQuantity: 20,
        oldInboundQuantity: -10,
        ldPickedQuantity: 20,
        oldUllageQuantity: -1,
        pickedId: 201277,
        pickedQuantity: 20,
        shouldDisplayOffloadData: true,
        ullageQuantity: 2,
        ullageReason: ullageReasonDamaged
      };

      scope.shouldDisableUllage(itemWithZeroInboundQuantity);
      expect(itemWithZeroInboundQuantity.ullageQuantity).toEqual(0);
      expect(itemWithZeroInboundQuantity.ullageReason).toBeNull();
    });

    it('should reset item.ullageReason and ite.ullageQuantity if inboundQuantity is null', function () {
      var itemWithNullInboundQuantity = {
        countTypeId: 1,
        inboundQuantity: null,
        isEposDataOverwritten: false,
        isInOffload: false,
        isMenuItem: true,
        isNewItem: false,
        itemDescription: 'Brwnie239-Brownie',
        itemMasterId: 10,
        itemName: 'Brownie',
        menuQuantity: 20,
        oldInboundQuantity: -10,
        ldPickedQuantity: 20,
        oldUllageQuantity: -1,
        pickedId: 201277,
        pickedQuantity: 20,
        shouldDisplayOffloadData: true,
        ullageQuantity: 2,
        ullageReason: ullageReasonDamaged
      };

      scope.shouldDisableUllage(itemWithNullInboundQuantity);
      expect(itemWithNullInboundQuantity.ullageQuantity).toEqual(0);
      expect(itemWithNullInboundQuantity.ullageReason).toBeNull();
    });

    it('should do nothing to item if has valid ullage and inbound fields', function () {
      var validUllageItem = {
        countTypeId: 1,
        inboundQuantity: 20,
        isEposDataOverwritten: false,
        isInOffload: false,
        isMenuItem: true,
        isNewItem: false,
        itemDescription: 'Brwnie239-Brownie',
        itemMasterId: 10,
        itemName: 'Brownie',
        menuQuantity: 20,
        oldInboundQuantity: -10,
        ldPickedQuantity: 20,
        oldUllageQuantity: -1,
        pickedId: 201277,
        pickedQuantity: '20',
        shouldDisplayOffloadData: true,
        ullageQuantity: 2,
        ullageReason: ullageReasonDamaged
      };

      scope.shouldDisableUllage(validUllageItem);
      expect(validUllageItem).toEqual(validUllageItem);
    });
  });

  describe('item filtering', function () {
    beforeEach(function () {
      initController();
      scope.$digest();

      scope.itemFilterText = 'Test Filter';
      scope.filterPackingList();
    });
    it('should only update search filter on click of search button', function () {

      expect(scope.filterItemDetails).toEqual(scope.itemFilterText);
      scope.itemFilterText = 'New Test Filter';
      expect(scope.filterItemDetails).not.toEqual(scope.itemFilterText);
    });

    it('should clear all search variables on clear button', function () {
      scope.clearFilteredPackingList();
      expect(scope.itemFilterText).toEqual('');
      expect(scope.filterItemDetails).toEqual('');
    });
  });
  
  describe('getSalesCategoryName function', function() {
    it('should populate SalesCategoryName', function() {
	  expect(StoreInstancePackingCtrl.getSalesCategoryName(3)).toEqual('Test2');
	});

	it('should not load SalesCategoryName', function() {
	  expect(StoreInstancePackingCtrl.getSalesCategoryName(10)).toEqual('');
	});
  });
});
