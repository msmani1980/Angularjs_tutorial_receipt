'use strict';

describe('Service: storeInstanceFactory', function() {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/store.json'));
  beforeEach(module('served/carrier-number.json'));
  beforeEach(module('served/station.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/menu-master-list.json'));
  beforeEach(module('served/features.json'));
  beforeEach(module('served/threshold-list.json'));

  // instantiate service
  var storeInstanceFactory;
  var catererStationService;
  var globalMenuService;
  var companyId = 403;
  var schedulesService;
  var carrierService;
  var storeInstanceService;
  var menuMasterService;
  var storesService;
  var stationsService;
  var itemsService;
  var recordsService;
  var companyReasonCodesService;
  var featureThresholdsService;
  var storeInstanceValidationService;

  var getStationDeferred;
  var getCarrierNumberDeferred;
  var getStoreDeferred;
  var getStoreInstanceDeferred;
  var getStoreStatusDeferred;
  var getMenuMasterListDeferred;
  var getFeaturesListDeferred;
  var getThresholdListDeferred;

  var servedStoreInstanceJSON;
  var servedStoreJSON;
  var servedCarrierNumberJSON;
  var servedStationJSON;
  var servedStoreStatusJSON;
  var servedMenuMasterListJSON;
  var servedFeaturesListJSON;
  var servedThresholdListJSON;

  var scope;

  beforeEach(inject(function(_servedStoreInstance_, _storeInstanceFactory_, $injector, $q, $rootScope) {

    inject(function(_servedStoreInstance_, _servedStore_, _servedCarrierNumber_, _servedStation_,
      _servedStoreStatus_, _servedMenuMasterList_, _servedFeatures_, _servedThresholdList_) {
      servedStoreInstanceJSON = _servedStoreInstance_;
      servedStoreJSON = _servedStore_;
      servedCarrierNumberJSON = _servedCarrierNumber_;
      servedStationJSON = _servedStation_;
      servedStoreStatusJSON = _servedStoreStatus_;
      servedMenuMasterListJSON = _servedMenuMasterList_;
      servedFeaturesListJSON = _servedFeatures_;
      servedThresholdListJSON = _servedThresholdList_;
    });

    scope = $rootScope.$new();
    storeInstanceFactory = _storeInstanceFactory_;

    getStationDeferred = $q.defer();
    getStationDeferred.resolve(servedStationJSON);

    getCarrierNumberDeferred = $q.defer();
    getCarrierNumberDeferred.resolve(servedCarrierNumberJSON);

    getStoreDeferred = $q.defer();
    getStoreDeferred.resolve(servedStoreJSON);

    getStoreInstanceDeferred = $q.defer();
    getStoreInstanceDeferred.resolve(servedStoreInstanceJSON);

    getStoreStatusDeferred = $q.defer();
    getStoreStatusDeferred.resolve(servedStoreStatusJSON);

    getMenuMasterListDeferred = $q.defer();
    getMenuMasterListDeferred.resolve(servedMenuMasterListJSON);

    getFeaturesListDeferred = $q.defer();
    getFeaturesListDeferred.resolve(servedFeaturesListJSON);

    getThresholdListDeferred = $q.defer();
    getThresholdListDeferred.resolve(servedThresholdListJSON);

    itemsService = $injector.get('itemsService');
    catererStationService = $injector.get('catererStationService');
    stationsService = $injector.get('stationsService');
    globalMenuService = $injector.get('globalMenuService');
    schedulesService = $injector.get('schedulesService');
    carrierService = $injector.get('carrierService');
    storeInstanceService = $injector.get('storeInstanceService');
    menuMasterService = $injector.get('menuMasterService');
    storesService = $injector.get('storesService');
    recordsService = $injector.get('recordsService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');
    featureThresholdsService = $injector.get('featureThresholdsService');
    storeInstanceValidationService = $injector.get('storeInstanceValidationService');

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(itemsService, 'getItemsList');
    spyOn(globalMenuService.company, 'get').and.returnValue(companyId);
    spyOn(schedulesService, 'getSchedules');
    spyOn(stationsService, 'getStation').and.returnValue(getStationDeferred.promise);
    spyOn(carrierService, 'getCarrierNumbers');
    spyOn(carrierService, 'getCarrierNumber').and.returnValue(getCarrierNumberDeferred.promise);
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(storeInstanceService, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);
    spyOn(storeInstanceService, 'createStoreInstance');
    spyOn(storeInstanceService, 'updateStoreInstance');
    spyOn(storeInstanceService, 'deleteStoreInstance');
    spyOn(storeInstanceService, 'getStoreInstanceMenuItems');
    spyOn(storeInstanceService, 'getStoreInstanceItemList');
    spyOn(storeInstanceService, 'getStoreInstanceItem');
    spyOn(storeInstanceService, 'createStoreInstanceItem');
    spyOn(storeInstanceService, 'updateStoreInstanceItem');
    spyOn(storeInstanceService, 'updateStoreInstanceItemsBulk');
    spyOn(storeInstanceService, 'deleteStoreInstanceItem');
    spyOn(storeInstanceService, 'updateStoreInstanceStatus');
    spyOn(menuMasterService, 'getMenuMasterList').and.returnValue(getMenuMasterListDeferred.promise);
    spyOn(storesService, 'getStoresList');
    spyOn(storesService, 'getStore').and.returnValue(getStoreDeferred.promise);
    spyOn(recordsService, 'getStoreStatusList').and.returnValue(getStoreStatusDeferred.promise);
    spyOn(recordsService, 'getItemTypes');
    spyOn(recordsService, 'getCharacteristics');
    spyOn(recordsService, 'getCountTypes');
    spyOn(recordsService, 'getFeatures');
    spyOn(featureThresholdsService, 'getThresholdList');
    spyOn(companyReasonCodesService, 'getAll');
    spyOn(storeInstanceValidationService, 'validateStoreInstance');

  }));

  describe('storesService calls', function() {
    it('should call getStoresList', function() {
      storeInstanceFactory.getStoresList();
      expect(storesService.getStoresList).toHaveBeenCalled();
    });
  });

  describe('menuMasterService calls', function() {
    it('should call getMenuMasterList', function() {
      var query = {
        startDate: '09102015'
      };
      storeInstanceFactory.getMenuMasterList(query);
      expect(menuMasterService.getMenuMasterList).toHaveBeenCalledWith(query);
    });
  });

  describe('itemsService calls', function() {
    it('should call getItemsList with fetchMasterFlag set to true', function() {
      var mockPayload = {
        foo: 'bars'
      };
      storeInstanceFactory.getItemsMasterList(mockPayload);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(mockPayload, true);
    });
  });

  describe('storeInstanceService calls', function() {
    var id = 123;
    var itemId = 345;
    var mockPayload = {
      foo: 'bars'
    };
    it('should call getStoreInstancesList', function() {
      storeInstanceFactory.getStoreInstancesList(mockPayload);
      expect(storeInstanceService.getStoreInstancesList).toHaveBeenCalledWith(mockPayload);
    });

    it('should call getStoreInstance', function() {
      storeInstanceFactory.getStoreInstance(id);
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(id);
    });

    it('should call createStoreInstance', function() {
      storeInstanceFactory.createStoreInstance(mockPayload);
      expect(storeInstanceService.createStoreInstance).toHaveBeenCalledWith(mockPayload);
    });

    it('should call updateStoreInstance', function() {
      storeInstanceFactory.updateStoreInstance(id, mockPayload);
      expect(storeInstanceService.updateStoreInstance).toHaveBeenCalledWith(id, mockPayload);
    });

    it('should call deleteStoreInstance', function() {
      storeInstanceFactory.deleteStoreInstance(id);
      expect(storeInstanceService.deleteStoreInstance).toHaveBeenCalledWith(id);
    });

    it('should call getStoreInstanceMenuItems', function() {
      storeInstanceFactory.getStoreInstanceMenuItems(id, mockPayload);
      expect(storeInstanceService.getStoreInstanceMenuItems).toHaveBeenCalledWith(id, mockPayload);
    });

    it('should call getStoreInstanceItemList', function() {
      storeInstanceFactory.getStoreInstanceItemList(id, mockPayload);
      expect(storeInstanceService.getStoreInstanceItemList).toHaveBeenCalledWith(id, mockPayload);
    });

    it('should call getStoreInstanceItem', function() {
      storeInstanceFactory.getStoreInstanceItem(id, itemId);
      expect(storeInstanceService.getStoreInstanceItem).toHaveBeenCalledWith(id, itemId);
    });

    it('should call updateStoreInstanceItem', function() {
      storeInstanceFactory.updateStoreInstanceItem(id, itemId, mockPayload);
      expect(storeInstanceService.updateStoreInstanceItem).toHaveBeenCalledWith(id, itemId, mockPayload);
    });

    it('should call updateStoreInstanceItemsBulk', function() {
      storeInstanceFactory.updateStoreInstanceItemsBulk(id, mockPayload);
      expect(storeInstanceService.updateStoreInstanceItemsBulk).toHaveBeenCalledWith(id, mockPayload);
    });

    it('should call deleteStoreInstanceItem', function() {
      storeInstanceFactory.deleteStoreInstanceItem(id, itemId);
      expect(storeInstanceService.deleteStoreInstanceItem).toHaveBeenCalledWith(id, itemId);
    });

    it('should call updateStoreInstanceStatus', function() {
      var statusId = 1;
      storeInstanceFactory.updateStoreInstanceStatus(id, statusId);
      expect(storeInstanceService.updateStoreInstanceStatus).toHaveBeenCalledWith(id, statusId, undefined, false);
    });
  });

  describe('globalMenuService calls', function() {
    it('should get company', function() {
      storeInstanceFactory.getCompanyId();
      expect(globalMenuService.company.get).toHaveBeenCalled();
    });
  });

  describe('catererStationService calls', function() {
    it('should call getStation', function() {
      storeInstanceFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('schedulesService calls', function() {
    it('should call getSchedules', function() {
      storeInstanceFactory.getSchedules(companyId);
      expect(schedulesService.getSchedules).toHaveBeenCalledWith(companyId);
    });
  });

  describe('carrierService calls', function() {
    it('should call getCarrierNumbers', function() {
      var carrierTypeId = 1;
      storeInstanceFactory.getCarrierNumbers(companyId, 1);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId, carrierTypeId);
    });

    it('should call getAllCarrierNumbers', function() {
      var carrierTypeId = 0;
      storeInstanceFactory.getAllCarrierNumbers(companyId);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId, carrierTypeId);
    });
  });

  describe('getStoreDetails', function() {
    var storeId;
    var storeDetails;
    var parentId = 3; // replenishStoreInstanceId from store-instance.json
    beforeEach(function() {
      storeId = 1;
      storeInstanceFactory.getStoreDetails(storeId).then(function(dataFromAPI) {
        storeDetails = dataFromAPI;
      });

      scope.$digest();
    });

    it('should GET store details from storesService', function() {
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(storeId);
    });

    it('should GET parent store details from storesService using replenishStoreInstanceId', function() {
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(parentId);
    });

    it('should GET store instance number from storesService', function() {
      expect(storesService.getStore).toHaveBeenCalled();
    });

    it('should GET tail number from carrierService', function() {
      expect(carrierService.getCarrierNumber).toHaveBeenCalled();
    });

    it('should GET CatererStation from stationsService', function() {
      expect(stationsService.getStation).toHaveBeenCalled();
    });

    it('should GET MenuMasterList from menuMasterService', function() {
      expect(menuMasterService.getMenuMasterList).toHaveBeenCalled();
    });

    describe('formatResponseCollection', function() {
      it('should return JSON object', function() {
        expect(typeof storeDetails).toBe('object');
      });

      it('should contain LMP station name', function() {
        expect(storeDetails.LMPStation).toBeDefined();
      });

      it('should contain scheduleId', function() {
        expect(storeDetails.scheduleId).toBeDefined();
      });

      it('should contain scheduleDate', function() {
        expect(storeDetails.scheduleDate).toBeDefined();
      });

      it('should properly format scheduleDate', function() {
        expect(storeDetails.scheduleDate).toBe('09/30/2015');
      });

      it('should contain scheduleNumber', function() {
        expect(storeDetails.scheduleNumber).toBeDefined();
      });

      it('should contain tail number if id is defined', function() {
        expect(storeDetails.carrierNumber).toBeDefined();
      });

      it('should contain store number', function() {
        expect(storeDetails.storeNumber).toBeDefined();
      });

      it('should contain current status object', function() {
        expect(storeDetails.currentStatus).toBeDefined();
      });

      it('should contain a menuList array', function() {
        expect(storeDetails.menuList).toBeDefined();
      });

      it('should contain a replenishStoreInstanceId', function() {
        expect(storeDetails.replenishStoreInstanceId).toEqual(parentId);
      });

      it('should contain a parentStoreInstance property', function() {
        expect(storeDetails.parentStoreInstance).toBeDefined();
      });

      it('should contain a tampered property', function() {
        expect(storeDetails.tampered).toBeDefined();
      });

      it('should contain a note property', function() {
        expect(storeDetails.note).toBeDefined();
      });

      it('should contain storeId property', function() {
        expect(storeDetails.storeId).toBeDefined();
      });

      describe('when there is no parent Id', function() {

        beforeEach(function() {
          storeInstanceFactory.getStoreDetails(storeId).then(function(dataFromAPI) {
            delete dataFromAPI.parentStoreInstance;
            delete dataFromAPI.replenishStoreInstanceId;
            storeDetails = dataFromAPI;
          });

          scope.$digest();
        });

        it('should not set the parentStoreInstance', function() {
          expect(storeDetails.parentStoreInstance).toBeUndefined();
        });

        it('should not set the replenishStoreInstanceId', function() {
          expect(storeDetails.replenishStoreInstanceId).toBeUndefined();
        });

      });

    });

  });

  describe('recordsService calls', function() {
    it('should call getStoreStatus', function() {
      storeInstanceFactory.getStoreStatusList();
      expect(recordsService.getStoreStatusList).toHaveBeenCalled();
    });

    it('should call getCountTypes', function() {
      storeInstanceFactory.getCountTypes();
      expect(recordsService.getCountTypes).toHaveBeenCalled();
    });
  });

  describe('companyReasonCodesService API calls', function() {
    it('should call getAll', function() {
      var payload = { id: 'fakeId' };
      storeInstanceFactory.getReasonCodeList(payload);
      expect(companyReasonCodesService.getAll).toHaveBeenCalledWith(payload);
    });
  });

  describe('validateStoreInstance API calls', function() {
    it('should call validateStoreInstance', function() {
      var payload = { ids: [1, 2] };
      storeInstanceFactory.validateStoreInstance(payload);
      expect(storeInstanceValidationService.validateStoreInstance).toHaveBeenCalledWith(payload);
    });
  });

});
