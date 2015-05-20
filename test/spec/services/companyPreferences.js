'use strict';

describe('Service: companyPreferences', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-preferences.json'));


  // instantiate service
  var companyPreferences,
    $httpBackend,
    preferencesJSON;
  beforeEach(inject(function (_companyPreferences_, $injector) {
    inject(function (_servedCompanyPreferences_) {
      preferencesJSON = _servedCompanyPreferences_;
    });
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/company-preferences/).respond(preferencesJSON);
    companyPreferences = _companyPreferences_;
  }));

  it('should exist', function () {
    expect(!!companyPreferences).toBe(true);
  });

});
