'use strict';

fdescribe('Controller: StoreInstancePackingCtrl', function () {

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

});

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

