'use strict';

describe('Factory: commissionFactory', function () {

  beforeEach(module('ts5App'));

  var commissionFactory,
    commissionDataService,
    recordsService,
    companyService,
    currenciesService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _commissionFactory_, _commissionDataService_, _recordsService_, _GlobalMenuService_, _companyService_, _currenciesService_) {
    commissionDataService = _commissionDataService_;
    recordsService = _recordsService_;
    companyService = _companyService_;
    currenciesService = _currenciesService_;


    spyOn(commissionDataService, 'getCommissionPayableData');
    spyOn(commissionDataService, 'getCommissionPayableList');
    spyOn(commissionDataService, 'createCommissionData');
    spyOn(commissionDataService, 'updateCommissionData');
    spyOn(commissionDataService, 'deleteCommissionData');
    spyOn(recordsService, 'getCrewBaseTypes');
    spyOn(recordsService, 'getCommissionPayableTypes');
    spyOn(recordsService, 'getDiscountTypes');
    spyOn(companyService, 'getCompany');
    spyOn(currenciesService, 'getCompanyGlobalCurrencies');


    rootScope = $rootScope;
    scope = $rootScope.$new();
    commissionFactory = _commissionFactory_;
  }));

  it('should be defined', function () {
    expect(!!commissionFactory).toBe(true);
  });

  describe('commissionDataService API', function () {
    it('should call commissionDataService on getCommissionPayableList', function () {
      commissionFactory.getCommissionPayableList({});
      expect(commissionDataService.getCommissionPayableList).toHaveBeenCalled();
    });
    it('should call commissionDataService on getCommissionPayableData', function () {
      commissionFactory.getCommissionPayableData(123);
      expect(commissionDataService.getCommissionPayableData).toHaveBeenCalledWith(123);
    });
    it('should call commissionDataService on createCommissionData', function () {
      commissionFactory.createCommissionData({});
      expect(commissionDataService.createCommissionData).toHaveBeenCalled();
    });
    it('should call commissionDataService on updateCommissionData', function () {
      commissionFactory.updateCommissionData(123, {});
      expect(commissionDataService.updateCommissionData).toHaveBeenCalled();
    });
    it('should call commissionDataService on deleteCommissionData', function () {
      commissionFactory.deleteCommissionData(123);
      expect(commissionDataService.deleteCommissionData).toHaveBeenCalledWith(123);
    });
  });

  describe('recordsService API', function () {
    it('should call recordsService on getCommissionPayableTypes', function () {
      commissionFactory.getCommissionPayableTypes();
      expect(recordsService.getCommissionPayableTypes).toHaveBeenCalled();
    });
    it('should call recordsService on getDiscountTypes', function () {
      commissionFactory.getDiscountTypes();
      expect(recordsService.getDiscountTypes).toHaveBeenCalled();
    });
  });

  describe('companyService API', function () {
    it('should call getCompany', function () {
      var mockId = 1;
      commissionFactory.getCompanyData(mockId);
      expect(companyService.getCompany).toHaveBeenCalledWith(mockId);
    });
  });

  describe('currenciesService API', function () {
    it('should call getDetailedCompanyCurrencies', function () {
      var mockId = 1;
      var expectedPayload = {id: 1};
      commissionFactory.getCurrency(mockId);
      expect(currenciesService.getCompanyGlobalCurrencies).toHaveBeenCalledWith(expectedPayload);
    });
  });

});
