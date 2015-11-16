//TODO Complete test cases
'use strict';

describe('Controller: CompanyRelationshipListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company-list.json',
    'served/company-relationship-list.json',
    'served/company-relationship-type-list.json'
  ));

  var CompanyRelationshipListCtrl,
    scope,
    getCompanyListDeferred,
    getCompanyRelationshipListByCompanyDeferred,
    getCompanyRelationshipTypeListDeferred,
    companyRelationshipFactory,
    companyListJSON,
    companyRelationshipListByCompanyJSON,
    companyRelationshipTypeListJSON,
    location,
    createCompanyRelationship,
    updateCompanyRelationship,
    deleteCompanyRelationship,
    routeParams,
    httpBackend;

  beforeEach(inject(function ($q, $controller, $rootScope, _companyRelationshipFactory_, $location, $httpBackend) {
    inject(function (_servedCompanyList_, _servedCompanyRelationshipList_, _servedCompanyRelationshipTypeList_) {
      companyListJSON = _servedCompanyList_;
      companyRelationshipListByCompanyJSON = _servedCompanyRelationshipList_;
      companyRelationshipTypeListJSON = _servedCompanyRelationshipTypeList_;
    });

    httpBackend = $httpBackend;
    location = $location;
    scope = $rootScope.$new();
    routeParams = {id: 765};

    getCompanyListDeferred = $q.defer();
    getCompanyRelationshipListByCompanyDeferred = $q.defer();
    getCompanyRelationshipTypeListDeferred = $q.defer();

    createCompanyRelationship = $q.defer();
    createCompanyRelationship.resolve({});
    updateCompanyRelationship = $q.defer();
    updateCompanyRelationship.resolve({});
    deleteCompanyRelationship = $q.defer();
    deleteCompanyRelationship.resolve({});

    companyRelationshipFactory = _companyRelationshipFactory_;

    spyOn(companyRelationshipFactory, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipListByCompany').and.returnValue(getCompanyRelationshipListByCompanyDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipTypeList').and.returnValue(getCompanyRelationshipTypeListDeferred.promise);
    spyOn(companyRelationshipFactory, 'createCompanyRelationship').and.returnValue(createCompanyRelationship.promise);
    spyOn(companyRelationshipFactory, 'updateCompanyRelationship').and.returnValue(updateCompanyRelationship.promise);
    spyOn(companyRelationshipFactory, 'deleteCompanyRelationship').and.returnValue(deleteCompanyRelationship.promise);

    CompanyRelationshipListCtrl = $controller('CompanyRelationshipListCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    scope.companyRelationshipForm = {
      $valid: true,
      $setDirty: jasmine.createSpy('$setDirty'),
      $setPristine: jasmine.createSpy('$setPristine')
    };

    scope.$digest();

  }));

  function resolveDependencies() {
    httpBackend.expectGET(/./).respond(200);
    getCompanyListDeferred.resolve(companyListJSON);
    getCompanyRelationshipListByCompanyDeferred.resolve(companyRelationshipListByCompanyJSON);
    getCompanyRelationshipTypeListDeferred.resolve(companyRelationshipTypeListJSON);
    scope.$apply();
  }

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Company Relationships');
  });

  describe('companyRelationshipListData object in scope', function () {

    beforeEach(function() {
      resolveDependencies();
    });

    it('should resolve getCompanyListPromise', function () {
      expect(companyRelationshipFactory.getCompanyList).toHaveBeenCalled();
    });

    it('should resolve getCompanyRelationshipListByCompanyPromise', function () {
      expect(companyRelationshipFactory.getCompanyRelationshipListByCompany).toHaveBeenCalledWith(routeParams.id);
    });

    it('should resolve getCompanyRelationshipTypeListPromise', function () {
      expect(companyRelationshipFactory.getCompanyRelationshipTypeList).toHaveBeenCalledWith(companyListJSON.companies[0].companyTypeId);
    });

    it('should set company in scope', function () {
      expect(!!scope.company).toBe(true);
    });

    describe('companyList', function () {
      it('should be in scope', function () {
        expect(scope.companyList).toBeDefined();
      });

      it('should be an array', function () {
        expect(angular.isArray(scope.companyList)).toBe(true);
      });
    });

    it('should set companyRelationshipTypeList in scope', function () {
      expect(scope.companyRelationshipTypeList.length).toBe(3);
    });

    it('should add companyRelationship to companyRelationshipListData in scope', function () {
      scope.addCompanyRelationship(scope.company);
      expect(scope.companyRelationshipListData.length).toBe(1);
    });
  });

  describe('Edit companyRelationship', function () {

    beforeEach(function() {
      resolveDependencies();
    });

    it('should have a edit function', function () {
      expect(!!scope.editCompanyRelationship).toBe(true);
    });
  });

  describe('Delete companyRelationship', function () {

    beforeEach(function() {
      resolveDependencies();
    });

    it('should have a confirmDelete function', function () {
      expect(!!scope.showDeleteConfirmation).toBe(true);
    });

    it('should attach companyRelationship from companyRelationshipListData in scope', function () {
      scope.showDeleteConfirmation(scope.companyRelationshipListData[0]);
      expect(scope.companyRelationshipToDelete).toBe(scope.companyRelationshipListData[0]);
    });
  });

  describe('Submit scope function', function () {
    var companyRelationship;
    beforeEach(function () {
      resolveDependencies();
      companyRelationship = {
        'relativeCompanyId': 366,
        'startDate': '20150717',
        'endDate': '20150724'
      };
    });

    it('should not submit if form is invalid', function () {
      scope.companyRelationshipForm.$valid = false;
      scope.submit();
      expect(companyRelationshipFactory.createCompanyRelationship).not.toHaveBeenCalled();
    });

    it('should submit and create if form is valid', function () {
      scope.submit(true, companyRelationship);
      expect(companyRelationshipFactory.createCompanyRelationship).toHaveBeenCalled();
    });

    it('should submit if update form is valid', function () {
      companyRelationship.id = 1;
      scope.submit(true, companyRelationship);
      expect(companyRelationshipFactory.updateCompanyRelationship).toHaveBeenCalled();
    });

  });

  describe('the error handler', function () {

    var mockError;

    beforeEach(function() {

      mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'bogan',
          code: '000'
        }
      };
      getCompanyListDeferred.reject(mockError);
      scope.$apply();
    });

    it('should set error data ', function () {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should set the display flag to true', function () {
      expect(scope.displayError).toBeTruthy();
    });

  });


});
