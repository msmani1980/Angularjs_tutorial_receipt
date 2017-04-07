'use strict';

describe('Service: storeInstancePackingFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstancePackingFactory;
  var storeInstanceFactory;
  var storeInstanceService;
  var itemsService;
  var recordsService;
  var companyReasonCodesService;
  var featureThresholdsService;
  var companyPreferencesService;

  beforeEach(inject(function (_storeInstancePackingFactory_, $injector) {
    storeInstancePackingFactory = _storeInstancePackingFactory_;

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceService = $injector.get('storeInstanceService');
    itemsService = $injector.get('itemsService');
    recordsService = $injector.get('recordsService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');
    featureThresholdsService = $injector.get('featureThresholdsService');
    companyPreferencesService = $injector.get('companyPreferencesService');

    spyOn(storeInstanceFactory, 'getStoreDetails');
    spyOn(recordsService, 'getItemTypes');
    spyOn(recordsService, 'getCharacteristics');
    spyOn(recordsService, 'getCountTypes');
    spyOn(storeInstanceService, 'updateStoreInstanceStatus');
    spyOn(storeInstanceService, 'createStoreInstanceItem');
    spyOn(storeInstanceService, 'createStoreInstanceItems');
    spyOn(storeInstanceService, 'updateStoreInstanceItem');
    spyOn(storeInstanceService, 'updateStoreInstanceItems');
    spyOn(storeInstanceService, 'updateStoreInstanceItemsBulk');
    spyOn(storeInstanceService, 'deleteStoreInstanceItem');
    spyOn(storeInstanceService, 'getStoreInstanceMenuItems');
    spyOn(storeInstanceService, 'getStoreInstanceItemList');
    spyOn(storeInstanceService, 'getStoreInstanceCalculatedInbounds');
    spyOn(companyReasonCodesService, 'getAll');
    spyOn(itemsService, 'getItemsList');
    spyOn(featureThresholdsService, 'getThresholdList');
    spyOn(companyPreferencesService, 'getCompanyPreferences');
  }));

  describe('storeInstanceService calls', function () {
    it('should call updateStoreInstanceStatus', function () {
      storeInstancePackingFactory.updateStoreInstanceStatus();
      expect(storeInstanceService.updateStoreInstanceStatus).toHaveBeenCalled();
    });

    it('should call createStoreInstanceItem', function () {
      storeInstancePackingFactory.createStoreInstanceItem();
      expect(storeInstanceService.createStoreInstanceItem).toHaveBeenCalled();
    });

    it('should call updateStoreInstanceItem', function () {
      storeInstancePackingFactory.updateStoreInstanceItem();
      expect(storeInstanceService.updateStoreInstanceItem).toHaveBeenCalled();
    });

    it('should call createStoreInstanceItems', function () {
      storeInstancePackingFactory.createStoreInstanceItems();
      expect(storeInstanceService.createStoreInstanceItems).toHaveBeenCalled();
    });

    it('should call updateStoreInstanceItem', function () {
      storeInstancePackingFactory.updateStoreInstanceItems();
      expect(storeInstanceService.updateStoreInstanceItems).toHaveBeenCalled();
    });

    it('should call updateStoreInstanceItemsBulk', function () {
      storeInstancePackingFactory.updateStoreInstanceItemsBulk();
      expect(storeInstanceService.updateStoreInstanceItemsBulk).toHaveBeenCalled();
    });

    it('should call deleteStoreInstanceItem', function () {
      storeInstancePackingFactory.deleteStoreInstanceItem();
      expect(storeInstanceService.deleteStoreInstanceItem).toHaveBeenCalled();
    });

    it('should call getStoreInstanceMenuItems', function () {
      storeInstancePackingFactory.getStoreInstanceMenuItems();
      expect(storeInstanceService.getStoreInstanceMenuItems).toHaveBeenCalled();
    });

    it('should call getStoreInstanceItemList', function () {
      storeInstancePackingFactory.getStoreInstanceItemList();
      expect(storeInstanceService.getStoreInstanceItemList).toHaveBeenCalled();
    });

    it('should call getStoreInstanceCalculatedInbounds', function () {
      storeInstancePackingFactory.getCalculatedInboundQuantities();
      expect(storeInstanceService.getStoreInstanceCalculatedInbounds).toHaveBeenCalled();
    });
  });

  describe('companyReasonCodesService calls', function () {
    it('should call getReasonCodeList', function () {
      storeInstancePackingFactory.getReasonCodeList();
      expect(companyReasonCodesService.getAll).toHaveBeenCalled();
    });
  });

  describe('itemsService calls', function () {
    it('should call getItemsMasterList', function () {
      storeInstancePackingFactory.getItemsMasterList({});
      expect(itemsService.getItemsList).toHaveBeenCalledWith({}, true);
    });
  });

  describe('storeInstanceFactory calls', function () {
    it('should call getStoreDetails', function () {
      storeInstancePackingFactory.getStoreDetails();
      expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalled();
    });
  });

  describe('featureThresholdsService calls', function () {
    it('should call getStoreDetails', function () {
      storeInstancePackingFactory.getThresholdList();
      expect(featureThresholdsService.getThresholdList).toHaveBeenCalled();
    });
  });

  describe('companyPreferencesService calls', function () {
    it('should call getCompanyPreferences', function () {
      storeInstancePackingFactory.getCompanyPreferences({}, 123);
      expect(companyPreferencesService.getCompanyPreferences).toHaveBeenCalled();
    });
  });

});
