'use strict';

describe('Service: companyFormatUtility', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-formats.json'));

  // instantiate service
  var companyFormatUtility;
  var identityAccessFactory;
  var companyFormatListJSON;
  var lodash;

  beforeEach(inject(function (_companyFormatUtility_, $injector) {
    identityAccessFactory = $injector.get('identityAccessFactory');
    companyFormatListJSON = $injector.get('servedCompanyFormats');
    lodash = $injector.get('lodash');

    var mockedSessionObject = {
      companyFormatList: companyFormatListJSON.response
    };
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue(mockedSessionObject);

    companyFormatUtility = _companyFormatUtility_;
  }));

  it('should exist', function () {
    expect(!!companyFormatUtility).toBe(true);
  });

  describe('date format', function () {
    it('should return date format', function () {
      var dateFormatObj = identityAccessFactory.getSessionObject().companyFormatList[0].format;
      expect(dateFormatObj.dataType).toBe('DATE');
      expect(companyFormatUtility.getDateFormat()).toBe(dateFormatObj.format);
    });

    it('should return currency format', function () {
      var currencyFormatObj = identityAccessFactory.getSessionObject().companyFormatList[1].format;
      expect(currencyFormatObj.dataType).toBe('CURRENCY');
      expect(companyFormatUtility.getCurrencyFormat()).toBe(currencyFormatObj.format);
    });

  });

});
