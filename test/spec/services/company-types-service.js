'use strict';

fdescribe('Service: companyTypesService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company-types.json'));

  var companyTypesService,
    responseFromAPI,
    $httpBackend;

  beforeEach(inject(function (_companyTypesService_, $injector) {
    inject(function (_servedCompanyTypes_) {
      responseFromAPI = _servedCompanyTypes_;
    });
    $httpBackend = $injector.get('$httpBackend');
    companyTypesService = _companyTypesService_;
  }));

  it('should exist', function () {
    expect(!!companyTypesService).toBe(true);
  });

  it('should have a getCompanyTypes function', function () {
    expect(!!companyTypesService.getCompanyTypes).toBe(true);
  });

  describe('API calls', function () {

    beforeEach(function () {
      $httpBackend.whenGET(/company-types/).respond(responseFromAPI);
    });

    it('should make a request to /company-types', function () {
      companyTypesService.getCompanyTypes();
      $httpBackend.flush();
      $httpBackend.expectGET(/company-types/);
    });

    it('should return a object containing a CompanyTypes array', function () {
      companyTypesService.getCompanyTypes().then(function (dataFromAPI) {
        expect(Object.prototype.toString.call(dataFromAPI)).toBe('[object Array]');
      });
      $httpBackend.flush();
    });

  });

});
