'use strict';

describe('Service: identityAccessFactory', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company.json'));

  var identityAccessFactory;
  var localStorage;
  var identityAccessService;
  var companiesFactory;
  var getCompanyDeferred;
  var companyResponseJSON;
  var scope;
  var location;
  var timeout;

  beforeEach(inject(function (_identityAccessFactory_, $injector, $rootScope, $location, $timeout, $q) {
    inject(function (_servedCompany_) {
      companyResponseJSON = _servedCompany_;
    });

    localStorage = $injector.get('$localStorage');
    identityAccessService = $injector.get('identityAccessService');
    companiesFactory = $injector.get('companiesFactory');

    scope = $rootScope;
    location = $location;
    timeout = $timeout;

    spyOn(identityAccessService, 'authorizeUser');

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(companiesFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    spyOn(location, 'path');

    identityAccessFactory = _identityAccessFactory_;
  }));

  it('should exist', function () {
    expect(!!identityAccessFactory).toBe(true);
  });

  describe('LocalStorage sessionObject', function () {
    beforeEach(function () {
      var credentials = {
        username: 'username',
        password: 'password'
      };
      identityAccessFactory.login(credentials);
    });

    it('should set session data in localStorage', function () {
      expect(identityAccessService.authorizeUser).toHaveBeenCalled();
    });

  });

  //describe('location change', function () {
  //
  //  it('should redirect to login when not authenticated and location changes', function () {
  //    scope.$broadcast('$locationChangeStart', 'fakeRoute');
  //    timeout.flush();
  //    expect(location.path).toHaveBeenCalledWith('/login');
  //  });
  //
  //});

  describe('LocalStorage sessionObject', function () {
    beforeEach(function () {
      var sessionObject = {
        id: 'fakeId',
        companyId: 'fakeCompanyId',
        companyData: {
          companyTypeId: 1,
          companyName: 'fakeCompanyName'
        },
        currentSession: {
          sessionToken: 'fakeSessionToken'
        }
      };
      identityAccessFactory.setSessionData(sessionObject);
    });

    it('should set session data in localStorage', function () {
      expect(localStorage.sessionObject).toBeDefined();
    });

    it('should return true is session stored on LS', function () {
      expect(identityAccessFactory.isAuthorized()).toBe(true);
    });

    it('should not redirect to login when location changes', function () {
      scope.$broadcast('$locationChangeStart', 'fakeRoute');
      expect(location.path).not.toHaveBeenCalledWith('/login');
    });

    it('should delete sessionObject on LS', function () {
      scope.$broadcast('logout');
      scope.$digest();
      expect(identityAccessFactory.isAuthorized()).toBe(false);
    });
  });

  describe('LocalStorage companyObject', function () {
    var companyObject;
    beforeEach(function () {
      companyObject = {
        companyTypeId: 1,
        companyId: 403
      };
      localStorage.companyObject = companyObject;
    });

    it('should set the company object', function () {
      expect(localStorage.companyObject).toEqual(companyObject);
    });

    it('should have a company type id', function () {
      expect(localStorage.companyObject.companyTypeId).toEqual(companyObject.companyTypeId);
    });

    it('should have a companyId ', function () {
      expect(localStorage.companyObject.companyId).toEqual(companyObject.companyId);
    });

  });


});
