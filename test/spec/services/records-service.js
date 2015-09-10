'use strict';

describe('Service: commissionDataService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/commission-payable-types.json', 'served/crew-base-types.json', 'served/discount-types.json'));

  var recordsService,
    $httpBackend,
    commissionDataTypesResponseJSON,
    crewBaseTypesResponseJSON,
    discountTypesResponseJSON;

  beforeEach(inject(function (_recordsService_, $injector) {
    inject(function (_servedCommissionPayableTypes_, _servedCrewBaseTypes_, _servedDiscountTypes_) {
      commissionDataTypesResponseJSON = _servedCommissionPayableTypes_;
      crewBaseTypesResponseJSON = _servedCrewBaseTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
    });

    $httpBackend = $injector.get('$httpBackend');
    recordsService = _recordsService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!recordsService).toBe(true);
  });

  describe('API calls', function () {
    describe('getCrewBaseTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getCrewBaseTypes).toBe(true);
      });

      var crewBaseTypes;
      beforeEach(function () {
        $httpBackend.whenGET(/crew-base-types/).respond(crewBaseTypesResponseJSON);
        recordsService.getCrewBaseTypes().then(function (dataFromAPI) {
          crewBaseTypes = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(crewBaseTypes)).toBe('[object Array]');
      });
    });

    describe('getCommissionPayableTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getCommissionPayableTypes).toBe(true);
      });

      var commissionTypes;
      beforeEach(function () {
        $httpBackend.whenGET(/commission-payable-types/).respond(commissionDataTypesResponseJSON);
        recordsService.getCommissionPayableTypes().then(function (dataFromAPI) {
          commissionTypes = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(commissionTypes)).toBe('[object Array]');
      });
    });

    describe('getCommissionPayableTypes', function () {
      it('should be accessible in the service', function () {
        expect(!!recordsService.getDiscountTypes).toBe(true);
      });

      var discountTypes;
      beforeEach(function () {
        $httpBackend.whenGET(/discount-types/).respond(discountTypesResponseJSON);
        recordsService.getDiscountTypes().then(function (dataFromAPI) {
          discountTypes = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(discountTypes)).toBe('[object Array]');
      });
    });

  });
});
