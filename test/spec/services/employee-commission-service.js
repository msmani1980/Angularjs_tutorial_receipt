'use strict';

describe('Service: employeeCommissionService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));

  var employeeCommissionService,
    $httpBackend;

  beforeEach(inject(function (_employeeCommissionService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    employeeCommissionService = _employeeCommissionService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!employeeCommissionService).toBe(true);
  });

  describe('API requests', function () {

    it('should GET commission list', function () {
      $httpBackend.expectGET(/employee-commissions/).respond(200, {fakeResponseKey: 'fakeResponseValue'});

      employeeCommissionService.getCommissionList().then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });
      $httpBackend.flush();
    });

    it('should GET a single commission', function () {
      var commissionId = 166;
      $httpBackend.expectGET(/employee-commissions\/\d+/).respond(200, {fakeResponseKey: commissionId});

      employeeCommissionService.getCommission(commissionId).then(function (response) {
        expect(response.fakeResponseKey).toBe(commissionId);
      });
      $httpBackend.flush();
    });

    it('should POST a commission', function () {
      $httpBackend.expectPOST(/employee-commissions/).respond(201, {fakeResponseKey: 'POST'});

      employeeCommissionService.createCommission().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });
      $httpBackend.flush();
    });

    it('should PUT a commission', function () {
      var commissionId = 166;
      $httpBackend.expectPUT(/employee-commissions/).respond(200, {fakeResponseKey: commissionId});

      employeeCommissionService.updateCommission().then(function (response) {
        expect(response.fakeResponseKey).toBe(commissionId);
      });
      $httpBackend.flush();
    });

    it('should deleteCommission a commission', function () {
      var commissionId = 166;
      $httpBackend.expectDELETE(/employee-commissions/).respond(200, {fakeResponseKey: commissionId});

      employeeCommissionService.deleteCommission(commissionId).then(function (response) {
        expect(response.fakeResponseKey).toBe(commissionId);
      });
      $httpBackend.flush();
    });

  });


});
