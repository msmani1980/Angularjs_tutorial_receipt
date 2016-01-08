'use strict';

describe('Service: cashBagService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/cash-bag.json'));

  var cashBagService,
    $httpBackend,
    cashBagListResponseJSON,
    cashBagResponseJSON;

  //headers = {
  //  companyId: 362,
  //  'Accept': 'application/json, text/plain, */*',
  //  'userId': 1,
  //  sessionToken: '9e85ffbb3b92134fbf39a0c366bd3f12f0f5'
  //};

  beforeEach(inject(function (_cashBagService_, $injector) {
    inject(function (_servedCashBagList_, _servedCashBag_) {
      cashBagListResponseJSON = _servedCashBagList_;
      cashBagResponseJSON = _servedCashBag_;
    });

    $httpBackend = $injector.get('$httpBackend');

    cashBagService = _cashBagService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!cashBagService).toBe(true);
  });

  describe('API calls', function () {

    describe('getCashBagList', function () {

      it('should be accessible in the service', function () {
        expect(!!cashBagService.getCashBagList).toBe(true);
      });

      var cashBagListData;
      beforeEach(function () {
        $httpBackend.whenGET(/cash-bags/).respond(cashBagListResponseJSON);

        cashBagService.getCashBagList().then(function (dataFromAPI) {
          cashBagListData = dataFromAPI;
        });

        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(cashBagListData.cashBags)).toBe('[object Array]');
      });

      it('should have isSubmitted property', function () {
        expect(cashBagListData.cashBags[0].isSubmitted).not.toBe(null);
      });

      it('should have retailCompanyId property', function () {
        expect(cashBagListData.cashBags[0].retailCompanyId).not.toBe(null);
      });

      it('should have cashbagSubmittedBy property', function () {
        expect(cashBagListData.cashBags[0].cashbagSubmittedBy).not.toBe(undefined);
      });
    });

    describe('api call parameters', function () {
      it('should have a company id as payload', function () {
        var companyId = 413;
        var regex = new RegExp('cash-bags\\?\.\*retailCompanyId=' + companyId, 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        cashBagService.getCashBagList(companyId, {});
        $httpBackend.flush();
      });

      it('should take an additional payload parameter', function() {
        var cashBagNumber = '123';
        var payload = { cashBagNumber: cashBagNumber };
        var regex = new RegExp('cash-bags\\?\.\*cashBagNumber=' + cashBagNumber, 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        cashBagService.getCashBagList('413', payload);
        $httpBackend.flush();
      });

      it('should not need a payload parameter', function() {
        var companyId = '413';
        var regex = new RegExp('cash-bags\\?\.\*retailCompanyId=' + companyId, 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        cashBagService.getCashBagList(companyId);
        $httpBackend.flush();
      });

    });

    describe('getCashBag', function () {

      it('should be accessible in the service', function () {
        expect(!!cashBagService.getCashBag).toBe(true);
      });

      var cashBagData;

      beforeEach(function () {
        var cashBagId = 95;
        var regex = new RegExp('cash-bags/' + cashBagId, 'g');
        $httpBackend.expectGET(regex).respond(cashBagResponseJSON);

        cashBagService.getCashBag(cashBagId).then(function (dataFromAPI) {
          cashBagData = dataFromAPI;
        });

        $httpBackend.flush();
      });

      it('should be an object', function () {
        expect(Object.prototype.toString.call(cashBagData)).toBe('[object Object]');
      });

      it('should have id property', function () {
        expect(cashBagData.id).not.toBe(null);
      });

    });

    describe('updateCashBag', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.updateCashBag).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/cash-bags/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        cashBagService.updateCashBag(95, { cashBag: 'fakeCashBagPayload' });
        $httpBackend.expectPUT(/cash-bags/);
        $httpBackend.flush();
      });
    });

    describe('deleteCashBag', function() {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.deleteCashBag).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenDELETE(/cash-bags/).respond({ done: true });
      });

      it('should DELETE a cash bag from API', function() {
        cashBagService.deleteCashBag();
        $httpBackend.expectDELETE(/cash-bags/);
        $httpBackend.flush();
      });
    });

    describe('createCashBag', function () {

      it('should be accessible in the service', function () {
        expect(!!cashBagService.createCashBag).toBe(true);
      });

      var cashBagData;

      beforeEach(function () {
        var cashBag = {
          scheduleDate: '20150611',
          scheduleNumber: '105',
          cashBagCurrencies: []
        };
        $httpBackend.expectPOST(/cash-bags/).respond(cashBagResponseJSON);

        cashBagService.createCashBag(cashBag).then(function (dataFromAPI) {
          cashBagData = dataFromAPI;
        });

        $httpBackend.flush();
      });

      it('should be an object', function () {
        expect(Object.prototype.toString.call(cashBagData)).toBe('[object Object]');
      });

      it('should have id property', function () {
        expect(cashBagData.id).not.toBe(null);
      });

    });

  });

});
