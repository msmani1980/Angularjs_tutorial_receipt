'use strict';

describe('Service: itemsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemsFactory;
  var itemsService;
  var allergensService;
  var itemTypesService;
  var priceTypesService;
  var characteristicsService;
  var unitsService;
  var companyDiscountService;

  beforeEach(inject(function (_itemsFactory_, $injector) {
    itemsFactory = _itemsFactory_;

    itemsService = $injector.get('itemsService');
    spyOn(itemsService, 'getItem').and.stub();
    spyOn(itemsService, 'getItemsList').and.stub();
    spyOn(itemsService, 'createItem').and.stub();
    spyOn(itemsService, 'updateItem').and.stub();
    spyOn(itemsService, 'removeItem').and.stub();

    allergensService = $injector.get('allergensService');
    spyOn(allergensService, 'getAllergensList').and.stub();

    itemTypesService = $injector.get('itemTypesService');
    spyOn(itemTypesService, 'getItemTypesList').and.stub();

    priceTypesService = $injector.get('priceTypesService');
    spyOn(priceTypesService, 'getPriceTypesList').and.stub();

    characteristicsService = $injector.get('characteristicsService');
    spyOn(characteristicsService, 'getCharacteristicsList').and.stub();

    unitsService = $injector.get('unitsService');
    spyOn(unitsService, 'getDimensionList').and.stub();
    spyOn(unitsService, 'getVolumeList').and.stub();
    spyOn(unitsService, 'getWeightList').and.stub();

    companyDiscountService = $injector.get('companyDiscountService');
    spyOn(companyDiscountService, 'getDiscountList').and.stub();

  }));

  it('should exist', function () {
    expect(!!itemsFactory).toBe(true);
  });

  describe('API Calls', function () {
    var payload = {
      fake: 'data'
    };

    it('should call itemsService when calling getItem', function () {
      itemsFactory.getItem(payload);
      expect(itemsService.getItem).toHaveBeenCalledWith(payload);
    });

    it('should call itemsService when calling getItemsList', function () {
      itemsFactory.getItemsList(payload, false);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(payload, false);
    });

    it('should call itemsService when calling createItem', function () {
      itemsFactory.createItem(payload);
      expect(itemsService.createItem).toHaveBeenCalledWith(payload);
    });

    it('should call itemsService when calling updateItem', function () {
      itemsFactory.updateItem(payload, false);
      expect(itemsService.updateItem).toHaveBeenCalledWith(payload, false);
    });

    it('should call itemsService when calling removeItem', function () {
      itemsFactory.removeItem(payload);
      expect(itemsService.removeItem).toHaveBeenCalledWith(payload);
    });

    it('should call allergensService when calling getAllergensList', function () {
      itemsFactory.getAllergensList(payload);
      expect(allergensService.getAllergensList).toHaveBeenCalledWith(payload);
    });

    it('should call itemTypesService when calling getItemTypesList', function () {
      itemsFactory.getItemTypesList(payload);
      expect(itemTypesService.getItemTypesList).toHaveBeenCalledWith(payload);
    });

    it('should call priceTypesService when calling getPriceTypesList', function () {
      itemsFactory.getPriceTypesList(payload);
      expect(priceTypesService.getPriceTypesList).toHaveBeenCalledWith(payload);
    });

    it('should call characteristicsService when calling getCharacteristicsList', function () {
      itemsFactory.getCharacteristicsList(payload);
      expect(characteristicsService.getCharacteristicsList).toHaveBeenCalledWith(payload);
    });

    it('should call unitsService when calling getDimensionList', function () {
      itemsFactory.getDimensionList(payload);
      expect(unitsService.getDimensionList).toHaveBeenCalledWith(payload);
    });

    it('should call unitsService when calling getVolumeList', function () {
      itemsFactory.getVolumeList(payload);
      expect(unitsService.getVolumeList).toHaveBeenCalledWith(payload);
    });

    it('should call unitsService when calling getWeightList', function () {
      itemsFactory.getWeightList(payload);
      expect(unitsService.getWeightList).toHaveBeenCalledWith(payload);
    });

    it('should call companyDiscountService when calling getDiscountList', function () {
      itemsFactory.getDiscountList(payload);
      expect(companyDiscountService.getDiscountList).toHaveBeenCalledWith(payload);
    });

  });
});
