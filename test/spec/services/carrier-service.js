// TODO: Add in test cases for business logic regarding station constraints like start / end date
'use strict';

describe('Carrier Service', function () {

  var carrierService,
    $httpBackend,
    carrierTypesJSON,
    carrierNumbersJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/carrier-types.json'));
  beforeEach(module('served/carrier-numbers.json'));

  beforeEach(inject(function (_carrierService_, $injector) {
    inject(function (_servedCarrierTypes_, _servedCarrierNumbers_) {
      carrierTypesJSON = _servedCarrierTypes_;
      carrierNumbersJSON = _servedCarrierNumbers_;
    });
    carrierService = _carrierService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(carrierService).toBeDefined();
  });

  describe('API calls', function () {

    describe('getCarrierTypes', function () {
      it('should be accessible', function () {
        expect(!!carrierService.getCarrierTypes).toBe(true);
      });

      var carrierTypesData;
      beforeEach(function () {
        $httpBackend.whenGET(/carrier-types$/).respond(carrierTypesJSON);

        carrierService.getCarrierTypes().then(function (dataFromAPI) {
          carrierTypesData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(carrierTypesData.response)).toBe('[object Array]');
      });

      it('should have a company id as payload', function () {
        var companyId = 413;
        var regex = new RegExp('/companies/' + companyId + '/carrier-types', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        carrierService.getCarrierTypes(companyId);
        $httpBackend.flush();
      });

      it('should have companyId property', function () {
        expect(carrierTypesData.response[0].companyId).not.toBe(null);
      });

      it('should have carrierType property', function () {
        expect(carrierTypesData.response[0].carrierType).not.toBe(null);
      });

      it('should have carrierTypeId property', function () {
        expect(carrierTypesData.response[0].carrierTypeId).not.toBe(null);
      });
    });

    describe('getCarrierNumbers', function () {
      it('should be accessible', function () {
        expect(!!carrierService.getCarrierNumbers).toBe(true);
      });

      var carrierNumbersData;
      beforeEach(function () {
        $httpBackend.whenGET(/carrier-numbers/).respond(carrierNumbersJSON);

        carrierService.getCarrierNumbers().then(function (dataFromAPI) {
          carrierNumbersData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(carrierNumbersData.response)).toBe('[object Array]');
      });

      it('should have a company id as payload', function () {
        var companyId = 413;
        var regex = new RegExp('/companies/' + companyId + '/carrier-types/', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        carrierService.getCarrierNumbers(companyId, 2);
        $httpBackend.flush();
      });

      it('should have a carrier type as payload', function () {
        var carrierType = 20;
        var regex = new RegExp('/carrier-types/' + carrierType + '/carrier-numbers', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        carrierService.getCarrierNumbers(413, carrierType);
        $httpBackend.flush();
      });

      it('should have companyId property', function () {
        expect(carrierNumbersData.response[0].companyId).not.toBe(null);
      });

      it('should have carrierNumber property', function () {
        expect(carrierNumbersData.response[0].carrierNumber).not.toBe(null);
      });
    });

    describe('getCarrierNumber', function () {
      it('should make a GET request when calling getStore', function () {
        var fakeId = 1;
        var regex = new RegExp('/carrier-types/0/carrier-numbers/' + fakeId, 'g');

        $httpBackend.expectGET(regex).respond({done: true, id: fakeId});
        carrierService.getCarrierNumber(403, fakeId).then(function (response) {
          expect(response.id).toBe(fakeId);
        });
        $httpBackend.flush();
      });
    });

  });
});
