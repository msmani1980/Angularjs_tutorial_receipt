'use strict';

describe('Service: companyFactory', function () {

  beforeEach(module('ts5App'));

  var companyFactory,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _companyFactory_) {
    companyFactory = _companyFactory_;

    spyOn(companyFactory, 'getCompany');
    spyOn(companyFactory, 'getCompanyList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
  }));

  it('should be defined', function () {
    expect(!!companyFactory).toBe(true);
  });

  describe('companyFactory API', function () {
    it('should call companyFactory on getCompany', function () {
      companyFactory.getCompany();
      expect(companyFactory.getCompany).toHaveBeenCalled();
    });

    it('should call companyFactory on getCompanyList', function () {
      companyFactory.getCompanyList();
      expect(companyFactory.getCompanyList).toHaveBeenCalled();
    });
  });
});
