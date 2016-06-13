'use strict';

fdescribe('Service: companyFormatUility', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-formats.json'));

  // instantiate service
  var companyFormatUility;
  var identityAccessFactory;
  var companyFormatListJSON;
  var lodash;

  beforeEach(inject(function (_companyFormatUility_, $injector) {
    identityAccessFactory = $injector.get('identityAccessFactory');
    companyFormatListJSON = $injector.get('servedCompanyFormats');
    lodash = $injector.get('lodash');

    var mockedSessionObject = {
      companyFormatList: companyFormatListJSON.response
    };
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue(mockedSessionObject);

    companyFormatUility = _companyFormatUility_;
  }));

  it('should exist', function () {
    expect(!!companyFormatUility).toBe(true);
  });

  describe('date format', function () {
    it('should return date format', function () {
      var dateFormatObj = identityAccessFactory.getSessionObject().companyFormatList[0].format;
      expect(dateFormatObj.dataType).toBe('DATE');
      expect(companyFormatUility.getDateFormat()).toBe(dateFormatObj.format);
    });

    it('should return currency format', function () {
      var currencyFormatObj = identityAccessFactory.getSessionObject().companyFormatList[1].format;
      expect(currencyFormatObj.dataType).toBe('CURRENCY');
      expect(companyFormatUility.getCurrencyFormat()).toBe(currencyFormatObj.format);
    });

  });

});
