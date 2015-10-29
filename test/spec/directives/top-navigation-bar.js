'use strict';

describe('Directive: topNavigationBar', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var identityAccessFactory;

  beforeEach(inject(function ($rootScope, $injector) {
    identityAccessFactory = $injector.get('identityAccessFactory');
    spyOn(identityAccessFactory, 'isAuthorized').and.returnValue(false);

    scope = $rootScope.$new();
  }));

  describe('Not authorized behaviour', function () {

    beforeEach(inject(function ($compile) {
      identityAccessFactory.isAuthorized.and.returnValue(false);
      element = angular.element('<top-navigation-bar></top-navigation-bar>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should call isAuthorized on Link', function () {
      expect(identityAccessFactory.isAuthorized).toHaveBeenCalled();
    });

    it('should load the template and attach it to scope', function () {
      expect(element.find('.navbar-fixed-top.ts5-logo').length).toBe(1);
    });

    it('should not have any buttons when not authorized', function () {
      expect(element.find('button').length).toBe(0);
    });

    it('should have login menu if authorized event received', function () {
      scope.$broadcast('authorized');
      scope.$digest();
      expect(element.find('menu-dropdown').length).toBe(1);
    });

  });

  describe('Authorized behaviour', function () {

    beforeEach(inject(function ($compile) {
      identityAccessFactory.isAuthorized.and.returnValue(true);
      element = angular.element('<top-navigation-bar></top-navigation-bar>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have buttons', function () {
      expect(element.find('button').length).toBe(1);
    });

    it('should have login menu', function () {
      expect(element.find('menu-dropdown').length).toBe(1);
    });

    it('should not have login menu if isAuthorized changed', function () {
      element.scope().isAuthorized = false;
      scope.$digest();
      expect(element.find('menu-dropdown').length).toBe(0);
    });

    it('should not have login menu if logout event received', function () {
      scope.$broadcast('logout');
      scope.$digest();
      expect(element.find('menu-dropdown').length).toBe(0);
    });

    it('should have logout button', function () {
      expect(element.find('.login-btn').length).toBe(1);
    });

    it('should emit on click', function () {
      spyOn(scope, '$emit');
      element.find('.login-btn').trigger('click');
      expect(scope.$emit).toHaveBeenCalledWith('logout');
    });

  });

});
