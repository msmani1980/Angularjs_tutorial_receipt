'use strict';

describe('Service: stockTakeFactory', function() {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockTakeFactory;
  var catererStationService;
  var stockDashboardService;
  var stockTakeService;
  var itemsService;
  var recordsService;
  var GlobalMenuService;

  beforeEach(inject(function(_stockTakeFactory_, $injector) {
    stockTakeFactory = _stockTakeFactory_;
    catererStationService = $injector.get('catererStationService');
    stockDashboardService = $injector.get('stockDashboardService');
    stockTakeService = $injector.get('stockTakeService');
    itemsService = $injector.get('itemsService');
    recordsService = $injector.get('recordsService');
    GlobalMenuService = $injector.get('GlobalMenuService');

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stockDashboardService, 'getStockDashboardItems');
    spyOn(stockTakeService, 'getStockTake');
    spyOn(stockTakeService, 'createStockTake');
    spyOn(stockTakeService, 'updateStockTake');
    spyOn(stockTakeService, 'importFromExcel');
    spyOn(itemsService, 'getItemsList');
    spyOn(recordsService, 'getItemTypes');
    spyOn(recordsService, 'getCharacteristics');
  }));

  describe('catererStationService calls', function() {
    it('should call getCatererStation', function() {
      stockTakeFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('stockDashboardService calls', function() {
    it('should call getItemsList with a param', function() {
      var csid = 1;
      stockTakeFactory.getItemsByCateringStationId(csid);
      expect(stockDashboardService.getStockDashboardItems).toHaveBeenCalledWith(csid);
    });
  });

  describe('stockTakeService calls', function() {
    it('should call getStockTake with id', function() {
      var id = 123;
      stockTakeFactory.getStockTake(id);
      expect(stockTakeService.getStockTake).toHaveBeenCalledWith(id);
    });

    it('should call createStockTake with payload', function() {
      var payload = {
        id: 123
      };
      stockTakeFactory.createStockTake(payload);
      expect(stockTakeService.createStockTake).toHaveBeenCalledWith(payload);
    });

    it('should call updateStockTake with id and payload', function() {
      var payload = {
        test: 123
      };
      var id = 123;
      stockTakeFactory.updateStockTake(id, payload);
      expect(stockTakeService.updateStockTake).toHaveBeenCalledWith(id, payload);
    });

    it('should call importFromExcel', function() {
      var id = 123;
      stockTakeService.importFromExcel(id, null);
      expect(stockTakeService.importFromExcel).toHaveBeenCalled();
    });
  });

  describe('itemService calls', function() {
    it('should call getItems with a param', function() {
      var companyId = 403;
      stockTakeFactory.getItemsMasterList(companyId);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(companyId, true);
    });
  });

  describe('recordsService calls', function() {
    it('should call getItemTypes', function() {
      stockTakeFactory.getItemTypes();
      expect(recordsService.getItemTypes).toHaveBeenCalled();
    });
    it('should call getCharacteristics', function() {
      stockTakeFactory.getCharacteristics();
      expect(recordsService.getCharacteristics).toHaveBeenCalled();
    });
  });

});
