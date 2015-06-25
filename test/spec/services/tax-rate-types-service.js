'use strict';

describe('Service: taxRateTypesService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/tax-rate-types.json'));


  var taxRateTypesService,
    $httpBackend,
    taxRateTypesJSON;

  beforeEach(inject(function (_taxRateTypesService_, $injector) {
    inject(function (_servedTaxRateTypes_) {
      //taxRateTypesJSON = {
      //  response: _servedTaxRateTypes_ // NOTE: had to add convert it to a JSON so that it plays nice with $httpBackend
      //};
      taxRateTypesJSON = _servedTaxRateTypes_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/tax-rate-types/).respond(taxRateTypesJSON);
    taxRateTypesService = _taxRateTypesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!taxRateTypesService).toBe(true);
  });

  describe('getTaxRateTypes', function () {
    var fakeReponseData;
    beforeEach(function () {
      taxRateTypesService.getTaxRateTypes().then(function (dataFromAPI) {
        fakeReponseData = dataFromAPI;
      });
      $httpBackend.flush();
    });

    it('should be an array', function () {
      expect(angular.isArray(fakeReponseData)).toBe(true);
    });

    it('should have a name property', function () {
      expect(fakeReponseData[0].taxRateType).toBeDefined();
    });

  });

});
