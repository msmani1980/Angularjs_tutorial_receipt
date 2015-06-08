'use strict';

describe('Service: companyCcTypesService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company-cc-types.json'));

  var companyCcTypesService,
    responseFromAPI,
    $httpBackend;

  beforeEach(inject(function (_companyCcTypesService_, $injector) {
    inject(function (_servedCompanyCcTypes_) {
      responseFromAPI = _servedCompanyCcTypes_;
    });
    $httpBackend = $injector.get('$httpBackend');
    companyCcTypesService = _companyCcTypesService_;
  }));

  it('should exist', function () {
    expect(!!companyCcTypesService).toBe(true);
  });

  it('should have a getCCtypes function', function () {
    expect(!!companyCcTypesService.getCCtypes).toBe(true);
  });

  describe('API calls', function () {

    beforeEach(function () {
      $httpBackend.whenGET(/company-credit-card-types/).respond(responseFromAPI);
    });

    it('should make a request to /company-credit-card-types', function () {
      companyCcTypesService.getCCtypes();
      $httpBackend.flush();
      $httpBackend.expectGET(/company-credit-card-types/);
    });

    it('should return a object containing a companyCCTypes array', function () {
      companyCcTypesService.getCCtypes().then(function (dataFromAPI) {
        expect(Object.prototype.toString.call(dataFromAPI.companyCCTypes)).toBe('[object Array]');
      });
      $httpBackend.flush();
    });

  });

});
