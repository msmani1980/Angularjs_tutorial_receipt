'use strict';

describe('Directive: topNavigationBar', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/session-object.json'));
  beforeEach(module('served/company-relationship-list.json'));

  var scope;
  var directiveElement;
  var compile;
  var companyRelationshipFactory;
  var getCompanyRelationshipListByCompanyDeferred;
  var identityAccessFactory;
  var sessionObjectJSON;
  var companyRelationshipListJSON;
  var isolatedScope;

  function getCompiledElement() {
    var element = angular.element('<top-navigation-bar></top-navigation-bar>');
    var compiledElement = compile(element)(scope);
    scope.$digest();
    isolatedScope = compiledElement.children().scope();
    return compiledElement;
  }

  beforeEach(inject(function ($rootScope, $injector, $q, $compile) {
    identityAccessFactory = $injector.get('identityAccessFactory');
    companyRelationshipFactory = $injector.get('companyRelationshipFactory');

    spyOn(identityAccessFactory, 'isAuthorized').and.returnValue(false);
    spyOn(identityAccessFactory, 'logout').and.returnValue(202);
    spyOn(identityAccessFactory, 'setSelectedCompany').and.returnValue(true);

    sessionObjectJSON = $injector.get('servedSessionObject');
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue(sessionObjectJSON);

    getCompanyRelationshipListByCompanyDeferred = $q.defer();
    companyRelationshipListJSON = $injector.get('servedCompanyRelationshipList');
    getCompanyRelationshipListByCompanyDeferred.resolve(companyRelationshipListJSON);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipListByCompany').and.returnValue(getCompanyRelationshipListByCompanyDeferred.promise);

    compile = $compile;
    scope = $rootScope.$new();
  }));

  describe('Change User', function () {
    beforeEach(inject(function () {
      identityAccessFactory.isAuthorized.and.returnValue(true);
      directiveElement = getCompiledElement();
    }));

    it('should set the selected Company on identity access factory', function () {
      isolatedScope.setSelectedCompany();
      expect(identityAccessFactory.setSelectedCompany).toHaveBeenCalled();
    });

    it('should reload data on close modal', function () {
      isolatedScope.closeModal();
      expect(identityAccessFactory.getSessionObject).toHaveBeenCalled();
    });

    it('should only have one company selected', function () {
      isolatedScope.pickedCompany.Retail = { id: 'fakeRetailId' };
      isolatedScope.pickedCompany.fakeKey = { id: 'notUsed' };
      isolatedScope.selectCompany('Retail');
      expect(isolatedScope.pickedCompany.fakeKey).toBeUndefined();
    });

    it('should enable the save button', function () {
      isolatedScope.pickedCompany.Retail = { id: 'fakeRetailId' };
      isolatedScope.selectCompany('Retail');
      expect(isolatedScope.shouldDisableChangeCompany).toBeFalsy();
    });

    it('should get company relationship if cash handler is selected', function () {
      isolatedScope.pickedCompany['Cash Handler'] = { id: 18 };
      isolatedScope.selectCompany('Cash Handler');
      expect(companyRelationshipFactory.getCompanyRelationshipListByCompany).toHaveBeenCalled();
    });

    it('should correct companyName from relativeCompanyName', function () {
      isolatedScope.pickedCompany['Cash Handler'] = { id: 19, companyName: 'ICE Gatwick' };
      isolatedScope.selectCompany('Cash Handler');
      scope.$digest();
      expect(isolatedScope.cashHandlerRetailCompanyList[0].companyName).toBeDefined();
      expect(isolatedScope.cashHandlerRetailCompanyList[0].companyName).toEqual('British Airways');
      expect(isolatedScope.cashHandlerRetailCompanyList[1].companyName).toBeDefined();
      expect(isolatedScope.cashHandlerRetailCompanyList[1].companyName).toEqual('easyJet');
    });

    it('should filter out companies that are not retail or are not available to the user', function () {
      isolatedScope.pickedCompany['Cash Handler'] = { id: 'fakeRetailId', companyName: 'ICE Gatwick' };
      isolatedScope.selectCompany('Cash Handler');
      scope.$digest();
      expect(isolatedScope.cashHandlerRetailCompanyList.length).toEqual(2);
      expect(isolatedScope.cashHandlerRetailCompanyList[0].companyTypeName).toEqual('Retail');
      expect(isolatedScope.cashHandlerRetailCompanyList[1].companyTypeName).toEqual('Retail');
    });
  });

  describe('Not authorized behaviour', function () {
    beforeEach(inject(function () {
      identityAccessFactory.isAuthorized.and.returnValue(false);
      directiveElement = getCompiledElement();
    }));

    it('should call isAuthorized on Link', function () {
      expect(identityAccessFactory.isAuthorized).toHaveBeenCalled();
    });

    it('should load the template and attach it to scope', function () {
      expect(directiveElement.find('.navbar-fixed-top.ts5-logo').length).toBe(1);
    });

    it('should not have any buttons when not authorized', function () {
      expect(directiveElement.find('.logout-btn').length).toBe(0);
    });

    it('should have logout menu if authorized event received', function () {
      scope.$broadcast('authorized');
      scope.$digest();
      expect(directiveElement.find('.logout-btn').length).toBe(1);
    });

  });

  describe('Authorized behaviour', function () {

    beforeEach(inject(function () {
      identityAccessFactory.isAuthorized.and.returnValue(true);
      directiveElement = getCompiledElement();
    }));

    it('should have buttons', function () {
      expect(directiveElement.find('.logout-btn').length).toBe(1);
    });

    it('should have logout button', function () {
      expect(directiveElement.find('.logout-btn').length).toBe(1);
    });

    it('should not have logout button if isAuthorized changed', function () {
      directiveElement.scope().isAuthorized = false;
      scope.$digest();
      expect(directiveElement.find('.logout-btn').length).toBe(0);
    });

    it('should not have logout button if logout event received', function () {
      scope.$broadcast('logout');
      scope.$digest();
      expect(directiveElement.find('.logout-btn').length).toBe(0);
    });

    describe('logout', function () {
      it('should have logout button', function () {
        expect(directiveElement.find('.logout-btn').length).toBe(1);
      });

      it('should emit on click', function () {
        spyOn(scope, '$emit');
        directiveElement.find('.logout-btn').trigger('click');
        expect(scope.$emit).toHaveBeenCalledWith('logout');
      });

      it('should call logout API', function () {
        directiveElement.find('.logout-btn').trigger('click');
        expect(identityAccessFactory.logout).toHaveBeenCalled();
      });
    });

  });

});
