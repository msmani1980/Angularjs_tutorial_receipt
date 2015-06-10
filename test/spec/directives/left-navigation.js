'use strict';

describe('Directive: leftNavigation', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    scope,
    controller;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function ($compile) {
    element = angular.element(
      '<left-navigation></left-navigation>');
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

      it('should contain a ul navbar with (3) li elements', function () {
        expect(element.find('.navbar li').length).toBe(3);
      });

      it('should contain a ul navbar with (3) left-nav-option elements',
        function () {
          expect(element.find('.navbar .left-nav-option').length).toBe(
            3);
        });

      it('should contain a ul navbar with (3) p elements',
        function () {
          expect(element.find('.left-nav-option p').length).toBe(
            3);
        });

      it('should contain a left-nav-option with (3) icon elements',
        function () {
          expect(element.find('.left-nav-option i').length).toBe(
            3);
        });

      it('should contain a ul navbar with (6) icon elements',
        function () {
          expect(element.find('.navbar li i').length).toBe(
            6);
        });

      it('should contain a left-nav-option with (1) lg class',
        function () {
          expect(element.find('.left-nav-option.lg').length).toBe(
            1);
        });

      it('should have the leave-view-modal-nav directive injected',
        function () {
          expect(element.find('#leave-view-modal-nav')).toBeDefined();
        });

      it('should have a list item with an ng-click of leave-view-nav',
        function () {

          var navLi = angular.element(element.find(
            '.navbar li')[0]);

          expect(navLi.attr('ng-click')).toEqual(
            'leaveViewNav(\'\')');

        });

    });

});
