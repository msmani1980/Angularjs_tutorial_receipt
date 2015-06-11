'use strict';

describe('Controller: CompanyRelationshipCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationships.json'));

  var CompanyRelationshipCtrl,
    scope,
    getCompanyRelationshipListDeferred,
    companyRelationshipService,
    companyRelationshipListJSON,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _companyRelationshipService_, $location) {
    inject(function (_servedCompanyRelationships_) {
      companyRelationshipListJSON = _servedCompanyRelationships_;
    });
    location = $location;
    scope = $rootScope.$new();
    getCompanyRelationshipListDeferred = $q.defer();
    getCompanyRelationshipListDeferred.resolve(companyRelationshipListJSON);
    companyRelationshipService = _companyRelationshipService_;
    spyOn(companyRelationshipService, 'getCompanyRelationshipList').and.returnValue(getCompanyRelationshipListDeferred.promise);
    CompanyRelationshipCtrl = $controller('CompanyRelationshipCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Company Relationships')
  });

  it('should get the company relationship list from API', function () {
    expect(companyRelationshipService.getCompanyRelationshipList).toHaveBeenCalled();
  });

  describe('companyRelationshipList in scope', function () {
    it('should attach a companyRelationshipList after a API call to getCompanyRelationshipList', function () {
      expect(!!scope.companyRelationshipList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.companyRelationshipList[0].companyName).toBe('British Airways');
    });
  });

  describe('Action buttons', function () {
    var fakeMenuItem;

    beforeEach(function () {
      fakeMenuItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });
  });
});