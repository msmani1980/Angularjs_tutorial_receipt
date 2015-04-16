'use strict';

describe('Service: companyPreferences', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyPreferences,
    $httpBackend,
    preferencesRequestHandler;
  beforeEach(inject(function (_companyPreferences_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    preferencesRequestHandler = $httpBackend.whenGET('https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies')
      .respond({
        'response': [{
          createdOn: '2014-08-19',
          currencyCode: 'USD',
          currencyId: 1,
          currencyName: 'U.S. Dollar',
          currencySymbol: '$',
          decimalPrecision: 2,
          id: 1
        }]
      });
    companyPreferences = _companyPreferences_;
  }));

  it('should do something', function () {
    expect(!!companyPreferences).toBe(true);
  });

});
