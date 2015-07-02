//TODO: Add Tests

'use strict';

describe('Service: companyRelationshipService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationship.json', 'served/company-relationship-list.json', 'served/company-relationship-type-list.json'));

  var companyRelationshipService,
    $httpBackend,
    companyRelationshipResponseJSON,
    companyRelationshipListResponseJSON,
    companyRelationshipTypesResponseJSON;

  beforeEach(inject(function (_companyRelationshipService_, $injector) {
    inject(function (_servedCompanyRelationship_, _servedCompanyRelationshipList_, _servedCompanyRelationshipTypeList_) {
      companyRelationshipResponseJSON = _servedCompanyRelationship_;
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

  describe('API calls', function () {
    var companyRelationshipListByCompanyData;
    var companyRelationshipTypeData;
    var companyRelationshipData;

    describe('getCompanyRelationshipListByCompany', function () {
      beforeEach(function () {
        companyRelationshipService.getCompanyRelationshipListByCompany().then(function (companyRelationshipListFromAPI) {
          companyRelationshipListByCompanyData = companyRelationshipListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(angular.isArray(companyRelationshipListByCompanyData.companyRelationships)).toBe(true);
      });

      it('should have an array of company-relationship', function () {
        expect(companyRelationshipListByCompanyData.companyRelationships.length).toBeGreaterThan(0);
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

      it('should have an array of available company-relationship-type by company-type', function () {
        expect(companyRelationshipTypeData.response.length).toBeGreaterThan(0);
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

    //describe('createCompanyRelationship', function () {
    //  beforeEach(function () {
    //    var companyId = 417;
    //    var relativeCompanyId = 420;
    //    var regex = new RegExp('/companies/' + companyId + '/relationships', 'g');
    //    var data = {
    //      'companyId': companyId,
    //      'relativeCompanyId': relativeCompanyId,
    //      'startDate': '2015-09-20',
    //      'endDate': '2015-09-21'
    //    };
    //
    //    $httpBackend.whenPOST(regex).respond({'id': 77});
    //
    //    companyRelationshipService.createCompanyRelationship(data).then(function (response) {
    //      companyRelationshipData = response;
    //    });
    //    $httpBackend.flush();
    //  });
    //
    //  it('should be accessible in the service', function () {
    //    expect(!!companyRelationshipService.createCompanyRelationship).toBe(true);
    //  });
    //
    //  it('should POST data to company-relationship API', function () {
    //    expect(angular.isNumber(companyRelationshipData.id)).toBe(true);
    //  });
    //
    //  it('should return an id', function () {
    //    expect(companyRelationshipData.id).toEqual(jasmine.any(Number));
    //  });
    //
    //});
    //
    //describe('updateCompanyRelationship', function () {
    //  beforeEach(function () {
    //    var companyId = 413;
    //    var relationshipId = 1;
    //    var regex = new RegExp('/companies/' + companyId + '/relationships/' + relationshipId, 'g');
    //    $httpBackend.whenPUT(regex).respond({done: true});
    //  });
    //
    //  it('should PUT data to company-relationship API', function () {
    //    companyRelationshipService.updateCompanyRelationship({
    //      id: 1,
    //      companyId: 413
    //    }, {relativeCompanyId: 2});
    //    $httpBackend.expectPUT(/relationships/);
    //    //$httpBackend.flush();
    //  });
    //});
  });
});
