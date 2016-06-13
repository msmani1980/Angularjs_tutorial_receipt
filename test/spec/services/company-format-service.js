'use strict';

describe('Service: companyFormatService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyFormatService;
  var $httpBackend;
  beforeEach(inject(function (_companyFormatService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    companyFormatService = _companyFormatService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyFormatService).toBe(true);
  });

  describe('API requests', function () {

    it('should GET the company format list', function () {
      $httpBackend.expectGET(/company-formats/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      companyFormatService.getCompanyFormatList().then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should GET a company format', function () {
      $httpBackend.expectGET(/company-formats/).respond(200, { fakeResponseKey: 'fakeResponseValue' });

      companyFormatService.getCompanyFormat('fakeId').then(function (response) {
        expect(response.fakeResponseKey).toBe('fakeResponseValue');
      });

      $httpBackend.flush();
    });

    it('should POST a company format', function () {
      $httpBackend.expectPOST(/company-formats/).respond(201, { fakeResponseKey: 'POST' });

      companyFormatService.createCompanyFormat().then(function (response) {
        expect(response.fakeResponseKey).toBe('POST');
      });

      $httpBackend.flush();
    });

    it('should PUT a company format', function () {
      var companyFormatId = 123;
      $httpBackend.expectPUT(/company-formats\/\d+/).respond(200, { fakeResponseKey: companyFormatId });

      companyFormatService.updateCompanyFormat(companyFormatId).then(function (response) {
        expect(response.fakeResponseKey).toBe(companyFormatId);
      });

      $httpBackend.flush();
    });

    it('should delete a company format', function () {
      var companyFormatId = 123;
      $httpBackend.expectDELETE(/company-formats/).respond(200, { fakeResponseKey: companyFormatId });

      companyFormatService.deleteCompanyFormat(companyFormatId).then(function (response) {
        expect(response.fakeResponseKey).toBe(companyFormatId);
      });

      $httpBackend.flush();
    });

  });

});
