'use strict';

describe('Service: countriesService', function() {

  beforeEach(module('ts5App', 'served/country-list.json'));

  var countriesService;
  var countriesListJSON;
  var $httpBackend;

  beforeEach(inject(function(_countriesService_, $injector) {
    inject(function(_servedCountryList_) {
      countriesListJSON = _servedCountryList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/countries/).respond(countriesListJSON);
    countriesService = _countriesService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCountriesList', function() {
    var fakeReponseData;
    beforeEach(function() {
      countriesService.getCountriesList().then(function(dataFromAPI) {
        fakeReponseData = dataFromAPI;
      });
      $httpBackend.flush();
    });

    it('should be an Object', function() {
      expect(angular.isObject(fakeReponseData)).toBe(true);
    });

    it('should have a an array of countries', function() {
      expect(fakeReponseData.countries).toBeDefined();
    });

  });

});
