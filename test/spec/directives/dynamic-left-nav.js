'use strict';

describe('Directive: dynamicLeftNav', function () {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/company-types.json'));

  var element;
  var scope;
  var controller;
  var location;
  var globalMenuService;
  var identityAccessFactory;
  var mainMenuService;
  var companyJSON;
  var companyTypesJSON;
  var menuService;
  var isMenuCashbagRestrictUseDeferred;
  var isShowManageCashBagDeferred;
  var isShowCashBagSubmissionDeferred;

  beforeEach(inject(function (_$rootScope_, _$location_, $injector, $compile, $q) {
    scope = _$rootScope_;
    location = _$location_;
    globalMenuService = $injector.get('globalMenuService');
    identityAccessFactory = $injector.get('identityAccessFactory');
    mainMenuService = $injector.get('mainMenuService');
    menuService = $injector.get('menuService');

    companyJSON = $injector.get('servedCompany');
    companyTypesJSON = $injector.get('servedCompanyTypes');

    spyOn(globalMenuService, 'getCompanyData').and.returnValue(companyJSON);
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({ companyTypes: companyTypesJSON });

    isMenuCashbagRestrictUseDeferred = $q.defer();
    isMenuCashbagRestrictUseDeferred.resolve(true);
  	isShowManageCashBagDeferred = $q.defer();
  	isShowManageCashBagDeferred.resolve(false);
  	isShowCashBagSubmissionDeferred = $q.defer();
  	isShowCashBagSubmissionDeferred.resolve(false);
    spyOn(menuService, 'isMenuCashbagRestrictUse').and.returnValue(isMenuCashbagRestrictUseDeferred.promise);
    spyOn(menuService, 'isShowManageCashBag').and.returnValue(isShowManageCashBagDeferred.promise);
    spyOn(menuService, 'isShowCashBagSubmission').and.returnValue(isShowCashBagSubmissionDeferred.promise);

    element = angular.element('<dynamic-left-nav></dynamic-left-nav>');
    element = $compile(element)(scope);    scope.$digest();
    controller = element.controller('dynamicLeftNav');
    scope.$digest();
  }));

  describe('directive isolated scope', function () {
    var isolatedScope;
    beforeEach(inject(function () {
      isolatedScope = element.isolateScope();
    }));

    it('should have a leaveViewNav function defined', function () {
      scope.$digest();
      expect(isolatedScope.leaveViewNav).toBeDefined();
    });

    it('should be able to call leaveViewNav()', function () {
      spyOn(isolatedScope, 'leaveViewNav').and.callThrough();
      isolatedScope.leaveViewNav('some-path');
      scope.$digest();
      expect(isolatedScope.leaveViewNav).toHaveBeenCalled();
    });

    it('should end the user to ember using leaveViewNav() and call sendToEmber()', function () {
      spyOn(isolatedScope, 'leaveViewNav').and.callThrough();
      spyOn(isolatedScope, 'sendToEmber');
      isolatedScope.leaveViewNav('/ember/#/promotions');
      scope.$digest();
      expect(isolatedScope.sendToEmber).toHaveBeenCalledWith('/ember/#/promotions');
    });

  });

  describe('when the title attribute is set', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
      var companyCHJSON = angular.copy(companyJSON);
      companyCHJSON.companyTypeId = 5;

      globalMenuService.getCompanyData.and.returnValue(companyCHJSON);
      identityAccessFactory.getSessionObject.and.returnValue({ companyTypes: companyTypesJSON });

      element = angular.element('<dynamic-left-nav title="Cash Management"></dynamic-left-nav>');
      element = $compile(element)(scope);
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));

    it('should have have a title attribute', function () {
      expect(element.attr('title')).toBeDefined();
    });

    it('should match the title variable passed to the directive', function () {
      expect(element.attr('title')).toEqual(isolatedScope.title);
    });

    it('should have a menuItems variable in scope', function () {
      expect(isolatedScope.menuItems).toBeDefined();
    });

    it('should have 1 item in the menuItems array scope variable', function () {
      scope.$digest();
      expect(isolatedScope.menuItems.length).toEqual(1);
    });
  });

  describe('when no title attribute is set', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
      var companyCHJSON = angular.copy(companyJSON);
      companyCHJSON.companyTypeId = 5;
      globalMenuService.getCompanyData.and.returnValue(companyCHJSON);
      identityAccessFactory.getSessionObject.and.returnValue({ companyTypes: companyTypesJSON });
      element = angular.element('<dynamic-left-nav></dynamic-left-nav>');
      element = $compile(element)(scope);
      spyOn(location, 'path').and.returnValue('/cash-bag-list');
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));

    it('should have a menuItems variable in scope', function () {
      expect(isolatedScope.menuItems).toBeDefined();
    });

    it('should have 1 item in the menuItems array scope variable', function () {
      scope.$digest();
      expect(isolatedScope.menuItems.length).toEqual(1);
    });
  });

});
