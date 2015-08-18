'use strict';

describe('Service: stockTakeService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  var stockTakeService,
    $httpBackend,
    testObject,
    dataFromAPI,
    stockTakeListJSON;

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stock-take-list.json'));

  // Inject the service and responshandler
  beforeEach(inject(function ($injector,_servedStockTakeList_) {

    stockTakeListJSON = _servedStockTakeList_;
    stockTakeService = $injector.get('stockTakeService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // Item API
  describe('the getStockTakeList request', function () {

    beforeEach(function(){
      $httpBackend.expectGET(/stock-management\/stock-takes/);
      $httpBackend.whenGET(/stock-management\/stock-takes/).respond(stockTakeListJSON);
      stockTakeService.getStockTakeList().then(function (getResponse) {
        dataFromAPI = getResponse;
        testObject = dataFromAPI.response[0];
      });
      $httpBackend.flush();
    });

    it('should get a response from the API', function () {
      expect(dataFromAPI).toBeDefined();
    });

    it('should get data from the API containing the response object', function () {
      expect(dataFromAPI.response).toBeDefined();
    });

    it('should have return at least one oject inside of response', function () {
      expect(dataFromAPI.response.length).toBeGreaterThan(0);
    });

    describe('stock take object', function() {

      it('should exist', function () {
        expect(testObject).toBeDefined();
      });

      it('should have an id', function () {
        expect(testObject.id).toBeDefined();
        expect(testObject.id).toEqual(jasmine.any(Number));
      });

      it('should have an catererStationId', function () {
        expect(testObject.catererStationId).toBeDefined();
        expect(testObject.catererStationId).toEqual(jasmine.any(Number));
      });

      it('should have an isSubmitted flag', function () {
        expect(testObject.isSubmitted).toBeDefined();
        expect(testObject.isSubmitted).toEqual(jasmine.any(Boolean));
      });

    });

  });

  describe('getStockTake', function () {
    it('should be accessible in the service', function () {
      expect(stockTakeService.getStockTake).toBeDefined();
    });
    beforeEach(function () {
      $httpBackend.whenGET(/stock-management\/stock-takes/).respond({done: true});
    });
    it('should make GET request to API', function () {
      stockTakeService.getStockTake(38);
      $httpBackend.expectGET(/stock-management\/stock-takes/);
      $httpBackend.flush();
    });
  });
  describe('createStockTake', function(){
    it('should be accessible in the service', function(){
      expect(stockTakeService.createStockTake).toBeDefined();
    });
    beforeEach(function () {
      $httpBackend.whenPOST(/stock-management\/stock-takes/).respond({done: true});
    });
    it('should make POST request to API', function () {
      stockTakeService.createStockTake({});
      $httpBackend.expectPOST(/stock-management\/stock-takes/);
      $httpBackend.flush();
    });
  });
  describe('updateStockTake', function(){
    it('should be accessible in the service', function(){
      expect(stockTakeService.updateStockTake).toBeDefined();
    });
    beforeEach(function () {
      $httpBackend.whenPUT(/stock-management\/stock-takes/).respond({done: true});
    });
    it('should make PUT request to API', function () {
      stockTakeService.updateStockTake({});
      $httpBackend.expectPUT(/stock-management\/stock-takes/);
      $httpBackend.flush();
    });
  });

});
