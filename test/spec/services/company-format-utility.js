'use strict';

describe('Service: companyFormatUtility', function () {

  beforeEach(module('ts5App'));

  var companyFormatUtility;
  var globalMenuService;
  var mockedCompanyData;

  beforeEach(inject(function (_companyFormatUtility_, $injector) {
    globalMenuService = $injector.get('globalMenuService');

    mockedCompanyData = {
      formatList: {
        DATE: 'MM/DD/YYYY',
        CURRENCY: '%.2f'
      }
    };

    spyOn(globalMenuService, 'getCompanyData').and.returnValue(mockedCompanyData);
    companyFormatUtility = _companyFormatUtility_;
  }));

  it('should exist', function () {
    expect(!!companyFormatUtility).toBe(true);
  });

  describe('date format', function () {
    it('should return date format', function () {
      expect(companyFormatUtility.getDateFormat()).toBe(mockedCompanyData.formatList.DATE);
    });

    it('should return currency format', function () {
      expect(companyFormatUtility.getCurrencyFormat()).toBe(mockedCompanyData.formatList.CURRENCY);
    });

  });

});
