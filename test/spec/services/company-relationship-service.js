//TODO: Add Tests

'use strict';

describe('Service: companyRelationshipService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationship.json', 'served/company-relationship-list.json', 'served/company-relationship-type-list.json'));

  var companyRelationshipService,
    $httpBackend,
    companyRelationshipListResponseJSON,
    companyRelationshipTypesResponseJSON;

  beforeEach(inject(function (_companyRelationshipService_, $injector) {
    inject(function (_servedCompanyRelationship_, _servedCompanyRelationshipList_, _servedCompanyRelationshipTypeList_) {
      companyRelationshipListResponseJSON = _servedCompanyRelationshipList_;
      companyRelationshipTypesResponseJSON = _servedCompanyRelationshipTypeList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/companies/).respond(companyRelationshipListResponseJSON);
    $httpBackend.whenGET(/company-relation/).respond(companyRelationshipTypesResponseJSON);
    companyRelationshipService = _companyRelationshipService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyRelationshipService).toBe(true);

  });

  describe('API Calls:', function () {
    var companyRelationshipListByCompanyData;
    var companyRelationshipTypeData;

    describe('getCompanyRelationshipListByCompany', function () {
      beforeEach(function () {
        var payload = {
          someKey: 'someValue'
        };
        companyRelationshipService.getCompanyRelationshipListByCompany(payload).then(function (companyRelationshipListFromAPI) {
          companyRelationshipListByCompanyData = companyRelationshipListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(angular.isArray(companyRelationshipListByCompanyData.companyRelationships)).toBe(true);
      });

      it('should have a companyName property', function () {
        expect(companyRelationshipListByCompanyData.companyRelationships[0].companyName).toBe('British Airways');
      });
    });

    describe('getCompanyRelationshipTypeList', function () {
      beforeEach(function () {
        companyRelationshipService.getCompanyRelationshipTypeList().then(function (companyRelationshipTypeListFromAPI) {
          companyRelationshipTypeData = companyRelationshipTypeListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(angular.isArray(companyRelationshipTypeData.response)).toBe(true);
      });

      it('should have a companyTypeName property', function () {
        expect(companyRelationshipTypeData.response[0].companyTypeName).toBe('Retail');
      });
    });

    describe('getCompanyRelationshipList', function () {
      beforeEach(function () {

        var relativeCompanyId = 413;
        var regex = new RegExp('/companies/' + relativeCompanyId + '/relationships', 'g');
        $httpBackend.whenGET(regex).respond({});
      });
      it('should return GET data from company-relationship API', function () {
        companyRelationshipService.getCompanyRelationshipList();
        $httpBackend.expectGET(/relationships/);
        $httpBackend.flush();
      });
    });

    describe('getCompanyRelationship', function () {
      beforeEach(function () {
        var id = 1;
        var companyId = 413;
        var regex = new RegExp('/companies/' + companyId + '/relationships/' + id, 'g');
        $httpBackend.whenGET(regex).respond({id: 1});
      });

      it('should GET data to company-relationship API', function () {
        companyRelationshipService.getCompanyRelationship({
          id: 1,
          companyId: 413
        });
        $httpBackend.expectGET(/relationships/);
        $httpBackend.flush();
      });

    });

    describe('updateCompanyRelationship', function () {
      beforeEach(function () {
        $httpBackend.whenPUT(/relationships/).respond({
          done: true
        });
      });

      it('it should POST data to company-relationship API', function () {
        companyRelationshipService.updateCompanyRelationship({
          companyRelationshipData: 'fakeCompanyRelationshipPayload'
        });
        $httpBackend.expectPUT(/relationships/);
        $httpBackend.flush();
      });
    });

    describe('createCompanyRelationship', function () {
      var companyRelationshipData;

      beforeEach(function () {
        var companyId = 417;
        var relativeCompanyId = 420;
        var regex = new RegExp('/companies/' + companyId + '/relationships', 'g');
        var mockPayload = {
          'companyId': companyId,
          'relativeCompanyId': relativeCompanyId,
          'startDate': '09/20/2015',
          'endDate': '09/21/2015'
        };

        var mockDataFromService = {
          'relativeCompanyId': relativeCompanyId,
          'startDate': '20150920',
          'endDate': '20150921'
        };

        $httpBackend.expectPOST(regex, mockDataFromService).respond(201, {'id': 77});

        companyRelationshipService.createCompanyRelationship(mockPayload).then(function (dataFromAPI) {
          companyRelationshipData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an object', function () {
        expect(Object.prototype.toString.call(companyRelationshipData)).toBe('[object Object]');
      });

      it('should have an id property', function () {
        expect(companyRelationshipData.id).toEqual(jasmine.any(Number));
      });

    });

    describe('updateCompanyRelationship', function () {
      beforeEach(function () {
        $httpBackend.whenPUT(/relationships/).respond({
          done: true
        });
      });

      it('it should POST data to company-relationship API', function () {
        companyRelationshipService.updateCompanyRelationship({
          companyRelationshipData: 'fakeCompanyRelationshipPayload'
        });
        $httpBackend.expectPUT(/relationships/);
        $httpBackend.flush();
      });
    });

    describe('deleteCompanyRelationship', function () {
      beforeEach(function () {
        $httpBackend.whenDELETE(/relationships/).respond({
          done: true
        });
      });

      it('it should DELETE data to company-relationship API', function () {
        companyRelationshipService.deleteCompanyRelationship({
          companyRelationshipData: 'fakeCompanyRelationshipPayload'
        });
        $httpBackend.expectDELETE(/relationships/);
        $httpBackend.flush();
      });
    });
  });
});
