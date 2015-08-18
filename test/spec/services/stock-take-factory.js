'use strict';

describe('Service: stockTakeFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stockTakeFactory;
  var catererStationService;
  var itemsService;
  var stockTakeService;

  beforeEach(inject(function (_stockTakeFactory_, $injector) {
    stockTakeFactory = _stockTakeFactory_;
    catererStationService = $injector.get('catererStationService');
    itemsService = $injector.get('itemsService');
    stockTakeService = $injector.get('stockTakeService');

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(itemsService, 'getItemsByCateringStationId');
    spyOn(stockTakeService, 'getStockTake');
    spyOn(stockTakeService, 'createStockTake');
    spyOn(stockTakeService, 'updateStockTake');

  }));

  describe('catererStationService calls', function(){
    it('should call getCatererStation', function(){
      stockTakeFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('itemsService calls', function(){
    it('should call getItemsList with a param', function(){
      var csid = 1;
      stockTakeFactory.getItemsByCateringStationId(csid);
      expect(itemsService.getItemsByCateringStationId).toHaveBeenCalledWith(csid);
    });
  });

  describe('stockTakeService calls', function(){
    it('should call getStockTake with id', function(){
      var id = 123;
      stockTakeFactory.getStockTake(id);
      expect(stockTakeService.getStockTake).toHaveBeenCalledWith(id);
    });
    it('should call createStockTake with payload', function(){
      var payload = {id:123};
      stockTakeFactory.createStockTake(payload);
      expect(stockTakeService.createStockTake).toHaveBeenCalledWith(payload);
    });
    it('should call updateStockTake with id and payload', function(){
      var payload = {test:123};
      var id = 123;
      stockTakeFactory.updateStockTake(id, payload);
      expect(stockTakeService.updateStockTake).toHaveBeenCalledWith(id, payload);
    });
  });

});
