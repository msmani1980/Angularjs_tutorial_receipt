'use strict';

describe('Service: itemImportService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemImportService,
    $httpBackend;

  beforeEach(inject(function (_itemImportService_, $injector) {
    itemImportService = _itemImportService_;
    $httpBackend = $injector.get('$httpBackend');
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should do something', function () {
    expect(!!itemImportService).toBe(true);
  });

  describe('API calls', function () {
    describe('importItems', function () {
      it('should be accessible in the service', function () {
        expect(itemImportService.importItems).toBeDefined();
      });

      beforeEach(function () {
        $httpBackend.whenPOST(/retail-items\/import/).respond({done: true});
      });
      it('should POST data to item import API', function () {
        itemImportService.importItems([2,3,4]);
        $httpBackend.expectPOST(/retail-items\/import/);
        $httpBackend.flush();
      });
    });
  });

});
