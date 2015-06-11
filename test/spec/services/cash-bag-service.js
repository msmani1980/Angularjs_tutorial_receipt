'use strict';

describe('Service: cashBagService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag-list.json', 'served/cash-bag.json'));


  var cashBagService,
    $httpBackend,
    cashBagListResponseJSON,
    cashBagResponseJSON,
    headers = {
      companyId: 362,
      'Accept': 'application/json, text/plain, */*',
      'userId': 1
    };

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

      it('should be accessible in the controller', function () {
        expect(!!cashBagService.getCashBagList).toBe(true);
      });

      var cashBagListData;
      beforeEach(function () {
        $httpBackend.whenGET(/cash-bags/, headers).respond(cashBagListResponseJSON);

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
        // TODO: fix regex to not include limit=50
        var regex = new RegExp('cash-bags\\?limit=50&retailCompanyId=' + companyId, 'g');
        $httpBackend.expectGET(regex, headers).respond(200, '');
        cashBagService.getCashBagList(companyId, {});
        $httpBackend.flush();
      });

      it('should take an additional payload parameter', function() {
        var cashBagNumber = '123';
        var payload = {cashBagNumber: cashBagNumber};
        // TODO: fix regex to not include limit=50
        var regex = new RegExp('cashBagNumber=' + cashBagNumber, 'g');
        $httpBackend.expectGET(regex, headers).respond(200, '');
        cashBagService.getCashBagList('413', payload);
        $httpBackend.flush();
      });

      it('should not need a payload parameter', function() {
        var companyId = '413'
        // TODO: fix regex to not include limit=50
        var regex = new RegExp('cash-bags\\?limit=50&retailCompanyId=' + companyId, 'g');
        $httpBackend.expectGET(regex, headers).respond(200, '');
        cashBagService.getCashBagList(companyId);
        $httpBackend.flush();
      });

    });

    describe('getCashBag', function () {

      it('should be accessible in the controller', function () {
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

  });


});
