'use strict';

describe('Service: cashBagService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/cash-bag.json', 'served/cash-bag-carrier-instances.json'));

  var cashBagService,
    $httpBackend,
    cashBagListResponseJSON,
    cashBagResponseJSON,
    cashBagCarrierInstancesJSON;

  //headers = {
  //  companyId: 362,
  //  'Accept': 'application/json, text/plain, */*',
  //  'userId': 1,
  //  sessionToken: '9e85ffbb3b92134fbf39a0c366bd3f12f0f5'
  //};

  beforeEach(inject(function (_cashBagService_, $injector) {
    inject(function (_servedCashBagList_, _servedCashBag_, _servedCashBagCarrierInstances_) {
      cashBagListResponseJSON = _servedCashBagList_;
      cashBagResponseJSON = _servedCashBag_;
      cashBagCarrierInstancesJSON = _servedCashBagCarrierInstances_;
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

      describe('getCashBagCarrierInstances', function () {
        var cashBagCarrierInstancesData;
        beforeEach(function () {
          $httpBackend.whenGET(/cash-bags\/1\/carrier-instances/).respond(cashBagCarrierInstancesJSON);

          cashBagService.getCashBagList().then(function (dataFromAPI) {
            cashBagCarrierInstancesData = dataFromAPI;
          });

          $httpBackend.flush();
        });

        it('should GET carrier instances from API', function () {
          expect(cashBagCarrierInstancesData).not.toBe(null);
        });
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

    describe('reallocateCashBag', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.reallocateCashBag).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/cash-bags\/95\/reallocate/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        cashBagService.reallocateCashBag(95, 2);
        $httpBackend.expectPUT(/cash-bags\/95\/reallocate/);
        $httpBackend.flush();
      });
    });

    describe('mergeCashBag', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.mergeCashBag).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/cash-bags\/95\/merge/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        cashBagService.mergeCashBag(95, 2);
        $httpBackend.expectPUT(/cash-bags\/95\/merge/);
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

    describe('update cash bag currency', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.updateCashBagCurrency).toBe(true);
      });

      it('should PUT cash bag currency', function () {
        var cashBagCurrencyId = 'fakeId';
        $httpBackend.expectPUT(/cashbag-currencies\/fakeId/).respond(200, {});

        cashBagService.updateCashBagCurrency(cashBagCurrencyId).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('get cash bag cash list', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.getCashBagCashList).toBe(true);
      });

      it('should make GET call with cash bag id', function () {
        var cashBagId = 'fakeId';
        $httpBackend.expectGET(/cash-bags\/fakeId\/cash/).respond(200, {});

        cashBagService.getCashBagCashList(cashBagId, {}).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('get cash bag cash currency', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.getCashBagCash).toBe(true);
      });

      it('should make GET call with cash bag id', function () {
        var cashBagId = 'fakeId';
        var currencyId = 'fakeCurrencyId';
        $httpBackend.expectGET(/cash-bags\/fakeId\/cash\/fakeCurrencyId/).respond(200, {});

        cashBagService.getCashBagCash(cashBagId, currencyId).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('create cash bag cash currency', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.createCashBagCash).toBe(true);
      });

      it('should make GET call with cash bag id', function () {
        var cashBagId = 'fakeId';
        $httpBackend.expectPOST(/cash-bags\/fakeId\/cash/).respond(200, {});

        cashBagService.createCashBagCash(cashBagId, {}).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('update cash bag cash currency', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.updateCashBagCash).toBe(true);
      });

      it('should make GET call with cash bag id', function () {
        var cashBagId = 'fakeId';
        var currencyId = 'fakeCurrencyId';
        $httpBackend.expectPUT(/cash-bags\/fakeId\/cash\/fakeCurrencyId/).respond(200, {});

        cashBagService.updateCashBagCash(cashBagId, currencyId, {}).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('delete cash bag cash currency', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.deleteCashBagCash).toBe(true);
      });

      it('should make DELETE call with cash bag id', function () {
        var cashBagId = 'fakeId';
        var currencyId = 'fakeCurrencyId';
        $httpBackend.expectDELETE(/cash-bags\/fakeId\/cash\/fakeCurrencyId/).respond(200, {});

        cashBagService.deleteCashBagCash(cashBagId, currencyId).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('verify cash bag', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.verifyCashBag).toBe(true);
      });

      it('should make PUT call with cash bag id and verify type', function () {
        var cashBagId = 'fakeId';
        var verifyType = 'CASH';
        $httpBackend.expectPUT(/cashbags\/fakeId\/verify\/CASH/).respond(200, {});

        cashBagService.verifyCashBag(cashBagId, verifyType).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('checkCashBagVerification', function () {
      it('should be accessible in the service', function () {
        expect(!!cashBagService.checkCashBagVerification).toBe(true);
      });

      it('should make GET call with cash bag id', function () {
        var cashBagId = 'fakeId';
        $httpBackend.expectGET(/cashbags\/fakeId/).respond(200, {});

        cashBagService.checkCashBagVerification(cashBagId).then(function (response) {
          expect(response).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

  });

});
