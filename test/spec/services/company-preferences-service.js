'use strict';

describe('Service: companyPreferencesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-preferences.json'));

  // instantiate service
  var companyPreferencesService,
    $httpBackend,
    preferencesJSON;
  beforeEach(inject(function (_companyPreferencesService_, _$httpBackend_) {
    inject(function (_servedCompanyPreferences_) {
      preferencesJSON = _servedCompanyPreferences_;
    });

    $httpBackend = _$httpBackend_;
    companyPreferencesService = _companyPreferencesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyPreferencesService).toBe(true);
  });

  describe('API calls', function () {
    var apiData;

    describe('getMenuList', function () {
      beforeEach(function () {
        $httpBackend.whenGET(/company-preferences/).respond(preferencesJSON);
        companyPreferencesService.getCompanyPreferences().then(function (menuListFromAPI) {
          apiData = menuListFromAPI;
        });

        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(apiData.preferences.length).toBeGreaterThan(0);
      });

      it('should have a featureCode name property', function () {
        expect(apiData.preferences[0].featureCode).toBe('EXR');
      });

      it('should have a choiceCode name property', function () {
        expect(apiData.preferences[0].choiceCode).toBe('BNK');
      });

    });
  });

});
