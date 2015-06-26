'use strict';
describe('Directive: leftNavigation', function () {
  var element,
    scope,
    controller;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));
  beforeEach(inject(function ($compile) {
    element = angular.element(
      '<left-navigation base-path="retail-items"></left-navigation>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('leftNavigation');
  }));

  describe('When the leftNavigation directive is compiled, it',
    function () {
      it('should inject the directive', function () {
        expect(element).toBeDefined();
      });
      it('should contain an element with a navbar class', function () {
        expect(element.find('.navbar')).toBeDefined();
      });
      it('should contain a ul navbar with (5) li elements', function () {
        expect(element.find('.navbar li').length).toBe(5);
      });
      it('should contain a ul navbar with (5) left-nav-option elements',
        function () {
          expect(element.find('.navbar .left-nav-option').length).toBe(
            5);
        });
      it('should contain a ul navbar with (5) p elements',
        function () {
          expect(element.find('.left-nav-option p').length).toBe(
            5);
        });
      it('should contain a left-nav-option with (5) icon elements',
        function () {
          expect(element.find('.left-nav-option i').length).toBe(
            5);
        });
      it('should contain a ul navbar with (10) icon elements',
        function () {
          expect(element.find('.navbar li i').length).toBe(
            10);
        });
      it('should contain a left-nav-option with (5) lg class',
        function () {
          expect(element.find('.left-nav-option.lg').length).toBe(
            5);
        });
      it('should have the leave-view-modal-nav element',
        function () {
          expect(element.find('#leave-view-modal-nav')).toBeDefined();
        });
      it('should have a list item with an ng-click of leave-view-nav',
        function () {
          var navLi = angular.element(element.find(
            '.navbar li')[0]);
          expect(navLi.attr('ng-click')).toContain(
            'leaveViewNav');
        });
      it('should contain an element with a modal class', function () {
        expect(element.find('.modal')).toBeDefined();
      });
      it('should contain an element with a fade class', function () {
        expect(element.find('.fade')).toBeDefined();
      });
      it('should have a modal-content element', function () {
        expect(element.find('.modal-content')).toBeDefined();
      });
      it('should have a modal-body element', function () {
        expect(element.find('.modal-body')).toBeDefined();
      });
      it('should have a modal-footer element', function () {
        expect(element.find('.modal-footer')).toBeDefined();
      });
      it('should have a leave button', function () {
        expect(element.find('.btn-default')).toBeDefined();
      });
      it('should have a leave button that contains text', function () {
        expect(element.find('.btn-default').text()).toContain(
          'Discard Changes');
      });
      it('should have a save button', function () {
        expect(element.find('.btn-default')).toBeDefined();
      });
      it('should have a save button that contains text', function () {
        expect(element.find('.btn-primary').text()).toContain(
          'Continue Editing');
      });
    });

  describe('directive isolated scope', function () {
    var isolatedScope;
    beforeEach(inject(function () {
      isolatedScope = element.isolateScope();
    }));
    it('should have a leaveViewNav method attached to the scope',
      function () {
        expect(isolatedScope.leaveViewNav).toBeDefined();
      });
    it(
      'should have a leaveViewClose function defined',
      function () {
        expect(isolatedScope.leaveViewClose).toBeDefined();
      });
    it('should be able to call leaveViewNav()', function () {
      spyOn(isolatedScope, 'leaveViewNav').and.callThrough();
      isolatedScope.leaveViewNav();
      expect(isolatedScope.leaveViewNav).toHaveBeenCalled();
    });
    it('should contain a leavePathNav variable', function () {
      isolatedScope.leaveViewNav('test-path');
      expect(isolatedScope.leavePathNav).toBeDefined();
    });
    it(
      'should return the leavePathNav variable, after being passed into leaveViewNav',
      function () {
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
    it(
      'should contain a leavePathNav variable after leaveViewNav is called and closed',
      function () {
        isolatedScope.leaveViewNav('test-path');
        isolatedScope.leaveViewClose();
        expect(isolatedScope.leavePathNav).toBeDefined();
      });
    it(
      'should return the leavePath variable, after being passed into leaveView and closed',
      function () {
        isolatedScope.leaveViewNav('test-path');
        isolatedScope.leaveViewClose();
        expect(isolatedScope.leavePathNav).toContain('test-path');
      });
  });

  describe('when the base-path attribute is passed, it', function () {
    var isolatedScope;
    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<left-navigation base-path="retail-items"></left-navigation>'
      );
      element = $compile(element)(scope);
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));
    it('should have have a base path attribute',
      function () {
        expect(element.attr('base-path')).toBeDefined();
      });
    it('should match the basePath variable passed to the directive',
      function () {
        expect(element.attr('base-path')).toEqual(isolatedScope.basePath);
      });
    it('should have a itemListPath variable',
      function () {
        expect(isolatedScope.itemListPath).toBeDefined();
      });
    it('should have a itemCreatePath variable',
      function () {
        expect(isolatedScope.itemCreatePath).toBeDefined();
      });
    it('should have a manageCategoriesPath variable',
      function () {
        expect(isolatedScope.manageCategoriesPath).toBeDefined();
      });
    it('should have a itemListPath variable that contains /item-list',
      function () {
        expect(isolatedScope.itemListPath).toContain('/item-list');
      });
    it(
      'should have a itemCreatePath variable that contains /item-create',
      function () {
        expect(isolatedScope.itemCreatePath).toContain('/item-create');
      });
    it(
      'should have a manageCategoriesPath variable that contains /item-create',
      function () {
        expect(isolatedScope.manageCategoriesPath).toContain(
          'categories');
      });
  });

  describe(
    'when the base-path attribute is passed with stock-owner-items, it',
    function () {
      var isolatedScope;
      beforeEach(inject(function ($compile) {
        element = angular.element(
          '<left-navigation base-path="stock-owner-items"></left-navigation>'
        );
        element = $compile(element)(scope);
        scope.$digest();
        isolatedScope = element.isolateScope();
      }));
      it(
        'should have a itemListPath variable that contains /stock-owner-item-list',
        function () {
          expect(isolatedScope.itemListPath).toContain(
            '/stock-owner-item-list');
        });
      it(
        'should have a itemCreatePath variable that contains /stock-owner-item-create',
        function () {
          expect(isolatedScope.itemCreatePath).toContain('/stock-owner-item-create');
        });
      it(
        'should have a manageCategoriesPath variable that contains /stock-owner-item',
        function () {
          expect(isolatedScope.manageCategoriesPath).toContain('/ember/#/retail-items/categories');
        });
    });

  describe(
    'when the base-path attribute is passed with menu-relationship, it',
    function () {
      var isolatedScope;
      beforeEach(inject(function ($compile) {
        element = angular.element(
          '<left-navigation base-path="menu-relationship"></left-navigation>'
        );
        element = $compile(element)(scope);
        scope.$digest();
        isolatedScope = element.isolateScope();
      }));
      it(
        'should have a menuRelationshipListPath variable that contains /menu-relationship-list',
        function () {
          expect(isolatedScope.menuRelationshipListPath).toContain(
            '/menu-relationship-list');
        });
      it(
        'should have a menuRelationshipCreatePath variable that contains /stock-owner-item-create',
        function () {
          expect(isolatedScope.menuRelationshipCreatePath).toContain(
            '/menu-relationship-create');
        });
    });

  describe('when the controller is accessed, it',
    function () {
      it(
        'should have a setModalElement function defined',
        function () {
          expect(controller.setModalElement).toBeDefined();
        });
      it(
        'should have a setModalElement function set modelElement',
        function () {
          controller.setModalElement();
          expect(controller.modalElement).toBeDefined();
        });
      it(
        'should have a showModal function defined',
        function () {
          expect(controller.showModal).toBeDefined();
        });
      it(
        'should have a hideModal function defined',
        function () {
          expect(controller.hideModal).toBeDefined();
        });
      it(
        'should have a navigateTo function defined',
        function () {
          expect(controller.navigateTo).toBeDefined();
        });
      it(
        'should have a checkIfEditing function defined',
        function () {
          expect(controller.checkIfEditing).toBeDefined();
        });
    });
});
