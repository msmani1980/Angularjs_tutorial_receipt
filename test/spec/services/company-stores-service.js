'use strict';

describe('Service: companyStoresService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyStoresService,
    $httpBackend;
  beforeEach(inject(function ($injector) {
    companyStoresService = $injector.get('companyStoresService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyStoresService).toBe(true);
  });

  describe('REST API calls', function() {

    describe('getStores', function () {

      it('should be accessible as a function', function () {
        expect(companyStoresService.getStores).toBeDefined();
        expect(Object.prototype.toString.call(companyStoresService.getStores)).toBe('[object Function]');
      });
      it('should make a GET request', function(){
        $httpBackend.expectGET(/stores/g).respond(200, '');
        companyStoresService.getStores();
        $httpBackend.flush();
      });
    });

    describe('createStore', function () {

      it('should be accessible as a function', function () {
        expect(companyStoresService.createStore).toBeDefined();
        expect(Object.prototype.toString.call(companyStoresService.createStore)).toBe('[object Function]');
      });
      it('should make a POST request', function(){
        var mockPayload = {
          endDate: '20150708',
          startDate: '20150708',
          storeNumber: 'poiuy09887'
        };
        $httpBackend.expectPOST(/stores/g, mockPayload).respond(201, '');
        companyStoresService.createStore(mockPayload);
        $httpBackend.flush();
      });

    });


    describe('deleteStore', function(){
      it('should be accessible as a function', function(){
        expect(companyStoresService.deleteStore).toBeDefined();
        expect(Object.prototype.toString.call(companyStoresService.deleteStore)).toBe('[object Function]');
      });
      it('should make a DELETE request', function(){
        $httpBackend.expectDELETE(/stores/g).respond(201, '');
        var mockPayload = {id:1};
        companyStoresService.deleteStore(mockPayload);
        $httpBackend.flush();
      });
    });

    describe('saveStore', function(){
      it('should be accessible as a function', function(){
        expect(companyStoresService.saveStore).toBeDefined();
        expect(Object.prototype.toString.call(companyStoresService.saveStore)).toBe('[object Function]');
      });
      it('should make a PUT request', function(){
        $httpBackend.expectPUT(/stores/g).respond(201, '');
        var mockPayload = {id:1};
        companyStoresService.saveStore(mockPayload);
        $httpBackend.flush();
      });
    });

  });

});
