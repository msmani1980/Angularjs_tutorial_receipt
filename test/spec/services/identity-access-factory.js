'use strict';

describe('Service: identityAccessFactory', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/authorize-user.json'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/company-formats.json'));
  beforeEach(module('served/company-types.json'));
  beforeEach(module('served/all-user-companies.json'));

  var identityAccessFactory;
  var localStorage;
  var identityAccessService;
  var companiesFactory;
  var companyFactory;
  var eulaService;
  var companyFormatService;
  var getCompanyDeferred;
  var getCompanyTypesDeferred;
  var authorizeUserDeferred;
  var getUserCompaniesDeferred;
  var getCompanyFormatListDeferred;
  var getCompanyFormatListJSON;
  var getUserCompaniesJSON;
  var authorizeUserJSON;
  var companyResponseJSON;
  var companyTypesJSON;
  var scope;
  var location;
  var timeout;
  var lodash;

  beforeEach(inject(function($injector, $rootScope, $location, $timeout, $q) {
    companyResponseJSON = $injector.get('servedCompany');
    companyTypesJSON = $injector.get('servedCompanyTypes');
    authorizeUserJSON = $injector.get('servedAuthorizeUser');
    getUserCompaniesJSON = $injector.get('servedAllUserCompanies');
    getCompanyFormatListJSON = $injector.get('servedCompanyFormats');

    localStorage = $injector.get('$localStorage');
    identityAccessService = $injector.get('identityAccessService');
    companiesFactory = $injector.get('companiesFactory');
    companyFactory = $injector.get('companyFactory');
    eulaService = $injector.get('eulaService');
    companyFormatService = $injector.get('companyFormatService');

    lodash = $injector.get('lodash');
    scope = $rootScope;
    location = $location;
    timeout = $timeout;

    authorizeUserDeferred = $q.defer();
    authorizeUserDeferred.resolve(authorizeUserJSON);
    spyOn(identityAccessService, 'authorizeUser').and.returnValue(authorizeUserDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(companyFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCompanyTypesDeferred = $q.defer();
    getCompanyTypesDeferred.resolve(companyTypesJSON);
    spyOn(companyFactory, 'getCompanyTypes').and.returnValue(getCompanyTypesDeferred.promise);

    getCompanyFormatListDeferred = $q.defer();
    getCompanyFormatListDeferred.resolve(getCompanyFormatListJSON);
    spyOn(companyFormatService, 'getCompanyFormatList').and.returnValue(getCompanyFormatListDeferred.promise);

    getUserCompaniesDeferred = $q.defer();
    getUserCompaniesDeferred.resolve(getUserCompaniesJSON);
    spyOn(identityAccessService, 'getUserCompanies').and.returnValue(getUserCompaniesDeferred.promise);

    spyOn(location, 'path');
    spyOn(identityAccessService, 'sendEmail');

    identityAccessFactory = $injector.get('identityAccessFactory');
  }));

  describe('LocalStorage sessionObject', function() {
    beforeEach(function() {
      var credentials = {
        username: 'username',
        password: 'password'
      };
      identityAccessFactory.login(credentials);
    });

    it('should call authorize user API', function() {
      expect(identityAccessService.authorizeUser).toHaveBeenCalled();
    });

    it('should call authorize user API', function() {
      scope.$digest();
      expect(identityAccessFactory.getSessionObject().sessionToken).toBeDefined();
    });

  });

  describe('required API to get company data', function() {
    beforeEach(function() {
      var credentials = {
        username: 'username',
        password: 'password'
      };
      identityAccessFactory.login(credentials);
      scope.$digest();
    });

    it('should call getCompany API', function() {
      expect(companyFactory.getCompany).toHaveBeenCalled();
    });

    it('should call getCompanyTypes API', function() {
      expect(companyFactory.getCompanyTypes).toHaveBeenCalled();
    });

    it('should call getUserCompanies API', function() {
      expect(identityAccessService.getUserCompanies).toHaveBeenCalled();
    });

    it('should call companyFormatService.getCompanyFormatList API', function() {
      scope.$digest();
      expect(companyFormatService.getCompanyFormatList).toHaveBeenCalled();
    });

    it('should have user company list on the session object', function() {
      scope.$digest();
      expect(identityAccessFactory.getSessionObject().userCompanies.length).toBeGreaterThan(0);
    });

    it('should filter out inactive companies', function () {
      scope.$digest();
      var inactiveCompany = lodash.findWhere(authorizeUserJSON.companiesView, { active: 'f' });
      var inactiveUserCompany = lodash.findWhere(identityAccessFactory.getSessionObject().userCompanies, { id: inactiveCompany.id });

      expect(inactiveUserCompany).not.toBeDefined();
    });

    it('should not filter out active companies', function () {
      scope.$digest();
      var activeCompany = lodash.findWhere(authorizeUserJSON.companiesView, { active: 't' });
      var activeUserCompany = lodash.findWhere(identityAccessFactory.getSessionObject().userCompanies, { id: activeCompany.id });

      expect(activeUserCompany).toBeDefined();
    });

    describe('company date format list', function() {
      it('should have the list in the session object', function() {
        scope.$digest();
        expect(identityAccessFactory.getSessionObject().companyFormatList.DATE).toBeDefined();
      });

      it('should have DATE element', function() {
        scope.$digest();
        expect(identityAccessFactory.getSessionObject().companyFormatList.DATE.toUpperCase()).toBe('MM/DD/YYYY');
      });
    });

  });

  describe('location change', function() {

    it('should redirect to login when not authenticated and location changes', function() {
      scope.$broadcast('$locationChangeStart', 'fakeRoute');
      timeout.flush();
      expect(location.path).toHaveBeenCalledWith('/login');
    });

  });

  describe('LocalStorage sessionObject', function() {
    beforeEach(function() {
      var sessionObject = {
        id: 'fakeId',
        companyId: 'fakeCompanyId',
        username: 'fakeUser',
        companyData: {
          companyTypeId: 1,
          companyName: 'fakeCompanyName'
        },
        currentSession: {
          sessionToken: 'fakeSessionToken'
        },
        userCompanies: [{
	      id: 643,
	      companyId: 643,
	      type: {
	        companyTypeName: 'Retail',
	        companyName: 'easyJet'
	      },
	      companyName: 'easyJet',
	      companyTypeName: 'Retail',
        }],
        companyTypes: [{
  	      	id: 1,
  	      	companyTypeName: 'Retail',
          },{
        	  id: 5,
        	  companyTypeName: 'Cash Handler',
          }]
      };
      identityAccessFactory.setSessionData(sessionObject);
    });

    it('should set session data in localStorage', function() {
      expect(localStorage.sessionObject).toBeDefined();
    });
    
    it('should have companyTypeName on LS', function() {
    	 scope.$digest();
         expect(identityAccessFactory.getSessionObject().companyTypes[0].companyTypeName).toBeDefined();
    });
    
    it('should return true is session stored on LS', function() {
      expect(identityAccessFactory.isAuthorized()).toBe(true);
    });

    it('should not redirect to login when location changes', function() {
      scope.$broadcast('$locationChangeStart', 'fakeRoute');
      expect(location.path).not.toHaveBeenCalledWith('/login');
    });

    it('should delete sessionObject on LS', function() {
      scope.$broadcast('logout');
      scope.$digest();
      expect(identityAccessFactory.isAuthorized()).toBe(false);
    });
  });

  describe('LocalStorage companyObject', function() {
    var companyObject;
    beforeEach(function() {
      companyObject = {
        companyTypeId: 1,
        companyId: 403
      };
      localStorage.companyObject = companyObject;
    });

    it('should set the company object', function() {
      expect(localStorage.companyObject).toEqual(companyObject);
    });

    it('should have a company type id', function() {
      expect(localStorage.companyObject.companyTypeId).toEqual(companyObject.companyTypeId);
    });

    it('should have a companyId ', function() {
      expect(localStorage.companyObject.companyId).toEqual(companyObject.companyId);
    });

  });

  describe('send recovery email API', function() {
    it('should call sendEmail from identity access service', function() {
      identityAccessFactory.sendRecoveryEmail('username', 'fakeContent', 'fakeEmail', 'fakeUsername');
      expect(identityAccessService.sendEmail).toHaveBeenCalled();
    });

    it('should pass empty string username if username is not defined', function() {
      identityAccessFactory.sendRecoveryEmail('username', 'fakeContent', 'fakeEmail');
      expect(identityAccessService.sendEmail).toHaveBeenCalledWith(true, 'fakeContent', 'fakeEmail', '');

      identityAccessFactory.sendRecoveryEmail('username', 'fakeContent', 'fakeEmail', null);
      expect(identityAccessService.sendEmail).toHaveBeenCalledWith(true, 'fakeContent', 'fakeEmail', '');
    });

    it('should pass true if username is selected', function() {
      identityAccessFactory.sendRecoveryEmail('username', 'fakeContent', 'fakeEmail', 'fakeUser');
      expect(identityAccessService.sendEmail).toHaveBeenCalledWith(true, 'fakeContent', 'fakeEmail',
        'fakeUser');

      identityAccessFactory.sendRecoveryEmail('password', 'fakeContent', 'fakeEmail', 'fakeUser');
      expect(identityAccessService.sendEmail).toHaveBeenCalledWith(false, 'fakeContent', 'fakeEmail',
        'fakeUser');
    });
  });

  describe('checkForEULA', function() {
    beforeEach(function() {
      var sessionObject = {
        id: 'fakeId',
        companyId: 'fakeCompanyId',
        username: 'fakeUser',
        eulaRecent: false,
        companyData: {
          companyTypeId: 1,
          companyName: 'fakeCompanyName'
        },
        currentSession: {
          sessionToken: 'fakeSessionToken'
        }
      };
      spyOn(eulaService, 'showEULAConfirmation');
      identityAccessFactory.checkForEULA(sessionObject);
    });

    it('should call login', function() {
      expect(eulaService.showEULAConfirmation).toHaveBeenCalled();
    });
  });

});
