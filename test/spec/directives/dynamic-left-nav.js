'use strict';

describe('Directive: dynamicLeftNav', function () {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

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
    it('should have a leaveViewNav method attached to the scope', function () {
      expect(isolatedScope.leaveViewNav).toBeDefined();
    });
    it('should have a leaveViewClose function defined', function () {
      expect(isolatedScope.leaveViewClose).toBeDefined();
    });
    it('should be able to call leaveViewNav()', function () {
      spyOn(isolatedScope, 'leaveViewNav').and.callThrough();
      isolatedScope.leaveViewNav('some-path');
      expect(isolatedScope.leaveViewNav).toHaveBeenCalled();
    });
    it('should contain a leavePathNav variable', function () {
      isolatedScope.leaveViewNav('test-path');
      expect(isolatedScope.leavePathNav).toBeDefined();
    });
    it('should return the leavePathNav variable, after being passed into leaveViewNav', function () {
      isolatedScope.leaveViewNav('test-path');
      expect(isolatedScope.leavePathNav).toContain('test-path');
    });
    it('should contain the function leaveViewClose()', function () {
      isolatedScope.leaveViewClose();
      expect(isolatedScope.leaveViewClose).toBeDefined();
    });
    it('should be able to call leaveViewClose()', function () {
      spyOn(isolatedScope, 'leaveViewClose').and.callThrough();
      isolatedScope.leaveViewClose();
      expect(isolatedScope.leaveViewClose).toHaveBeenCalled();
    });
    it('should contain a leavePathNav variable after leaveViewNav is called and closed', function () {
      isolatedScope.leaveViewNav('test-path');
      isolatedScope.leaveViewClose();
      expect(isolatedScope.leavePathNav).toBeDefined();
    });
    it('should return the leavePath variable, after being passed into leaveView and closed', function () {
      isolatedScope.leaveViewNav('test-path');
      isolatedScope.leaveViewClose();
      expect(isolatedScope.leavePathNav).toContain('test-path');
    });
  });

  describe('when the controller is accessed, it', function () {
    it('should have a setModalElement function defined', function () {
      expect(controller.setModalElement).toBeDefined();
    });
    it('should have a setModalElement function set modelElement', function () {
      controller.setModalElement();
      expect(controller.modalElement).toBeDefined();
    });
    it('should have a showModal function defined', function () {
      expect(controller.showModal).toBeDefined();
    });
    it('should have a hideModal function defined', function () {
      expect(controller.hideModal).toBeDefined();
    });
    it('should have a navigateTo function defined', function () {
      expect(controller.navigateTo).toBeDefined();
    });
    it('should have a checkIfEditing function defined', function () {
      expect(controller.checkIfEditing).toBeDefined();
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

  describe('when the is-editing attribute is set', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
      element = angular.element('<dynamic-left-nav is-editing="1"></dynamic-left-nav>');
      element = $compile(element)(scope);
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));
    it('should have have a isEditing attribute', function () {
      expect(element.attr('is-editing')).toBeDefined();
    });
    it('should match the title variable passed to the directive', function () {
      expect(element.attr('is-editing')).toEqual(isolatedScope.isEditing);
    });
  });

});
