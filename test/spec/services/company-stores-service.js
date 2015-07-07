'use strict';

describe('Service: companyStoresService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyStoresService,
    urlRegex,
    $httpBackend;
  beforeEach(inject(function (_GlobalMenuService_, $injector) {
    companyStoresService = $injector.get('companyStoresService');
    $httpBackend = $injector.get('$httpBackend');
    urlRegex = new RegExp('api/companies/'+_GlobalMenuService_.company.get()+'/stores', 'g');
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
        companyStoresService.getStores();
        $httpBackend.expectGET(urlRegex).respond(200, '');
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
        companyStoresService.createStore(mockPayload);
        $httpBackend.expectPOST(urlRegex, mockPayload).respond(201, '');
        $httpBackend.flush();
      });

    });

  });

});
