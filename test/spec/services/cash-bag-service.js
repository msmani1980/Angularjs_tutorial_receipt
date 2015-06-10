'use strict';

describe('Service: cashBagService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));


  var cashBagService,
    $httpBackend,
    responseJSON,
    headers = {companyId:362,"Accept":"application/json, text/plain, */*","userId":1};

  beforeEach(inject(function (_cashBagService_, $injector) {
    inject(function (_servedCashBag_) {
      responseJSON = _servedCashBag_;
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

  it('should have a cashBagService function accessible from controller', function () {
    expect(!!cashBagService.getCashBagList).toBe(true);
  });

  describe('API calls', function () {
    var cashBagData;

    describe('getCashBagList', function () {

      beforeEach(function () {
        $httpBackend.whenGET(/cash-bags/,headers).respond(responseJSON);

        cashBagService.getCashBagList().then(function (dataFromAPI) {
          cashBagData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(cashBagData.cashBags)).toBe('[object Array]');
      });

      it('should have isSubmitted property', function(){
        expect(cashBagData.cashBags[0].isSubmitted).not.toBe(null);
      });

      it('should have retailCompanyId property', function(){
        expect(cashBagData.cashBags[0].retailCompanyId).not.toBe(null);
      });

      it('should have cashbagSubmittedBy property', function(){
        expect(cashBagData.cashBags[0].cashbagSubmittedBy).not.toBe(undefined);
      });
    });

    describe('api call parameters', function() {
      it('should have a company id as payload', function () {
        var companyId = 413;
        // TODO: fix regex to not include limit=50
        var regex = new RegExp('cash-bags\\?limit=50&retailCompanyId=' + companyId, 'g');
        $httpBackend.expectGET(regex, headers).respond(200, '');
        cashBagService.getCashBagList(companyId);
        $httpBackend.flush();
      });
    });

  });


});
