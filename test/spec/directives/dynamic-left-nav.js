'use strict';

describe('Directive: dynamicLeftNav', function () {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company.json'));

  var element,
    scope,
    controller,
    location;

  beforeEach(inject(function (_$rootScope_, _$location_) {
    scope = _$rootScope_;
    location = _$location_;
  }));
  beforeEach(inject(function ($compile) {
    element = angular.element('<dynamic-left-nav></dynamic-left-nav>');
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('dynamicLeftNav');
  }));

  describe('directive isolated scope', function () {
    var isolatedScope;
    beforeEach(inject(function () {
      isolatedScope = element.isolateScope();
    }));
    it('should have a leaveViewNav function defined', function () {
      expect(isolatedScope.leaveViewNav).toBeDefined();
    });
    it('should be able to call leaveViewNav()', function () {
      spyOn(isolatedScope, 'leaveViewNav').and.callThrough();
      isolatedScope.leaveViewNav('some-path');
      expect(isolatedScope.leaveViewNav).toHaveBeenCalled();
    });
  });

  describe('when the title attribute is set', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
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
    it('should have 3 items in the menuItems array scope variable', function () {
      expect(isolatedScope.menuItems.length).toEqual(3);
    });
  });

  describe('when no title attribute is set', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
      element = angular.element('<dynamic-left-nav></dynamic-left-nav>');
      element = $compile(element)(scope);
      spyOn(location, 'path').and.returnValue('/cash-bag-list');
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));
    it('should have a menuItems variable in scope', function () {
      expect(isolatedScope.menuItems).toBeDefined();
    });
    it('should have 3 items in the menuItems array scope variable', function () {
      expect(isolatedScope.menuItems.length).toEqual(3);
    });
  });

});
