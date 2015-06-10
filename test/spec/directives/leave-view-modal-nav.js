'use strict';

describe('Directive: leaveViewModalNav', function () {

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
      '<leave-view-modal-nav></leave-view-modal-nav>');
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('leaveViewModalNav');
  }));

  describe('When the leave-view-modal-nav directive is compiled, it',
    function () {

      it('should inject the directive', function () {
        expect(element).toBeDefined();
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

      describe('When the directives controller is accessed, it', function () {
        it('should be defined', function () {
          expect(controller).toBeDefined();
        });

        it('should contain the function leaveViewNav()', function () {
          scope.leaveViewNav();
          expect(scope.leaveViewNav).toBeDefined();
        });

        it('should be able to call leaveViewNav()', function () {
          spyOn(scope, 'leaveViewNav').and.callThrough();
          scope.leaveViewNav();
          expect(scope.leaveViewNav).toHaveBeenCalled();
        });

        it('should contain a leavePath variable', function () {
          scope.leaveViewNav('test-path');
          expect(scope.leavePathNav).toBeDefined();
        });

        it(
          'should return the leavePathNav variable, after being passed into leaveViewNav',
          function () {
            scope.leaveViewNav('test-path');
            expect(scope.leavePathNav).toContain('test-path');
          });


        it('should contain the function leaveViewClose()', function () {
          scope.leaveViewClose();
          expect(scope.leaveViewClose).toBeDefined();
        });

        it('should be able to call leaveViewClose()', function () {
          spyOn(scope, 'leaveViewClose').and.callThrough();
          scope.leaveViewClose();
          expect(scope.leaveViewClose).toHaveBeenCalled();
        });

        it(
          'should contain a leavePath variable after leaveView is called and closed',
          function () {
            scope.leaveViewNav('test-path');
            scope.leaveViewClose();
            expect(scope.leavePathNav).toBeDefined();
          });

        it(
          'should return the leavePath variable, after being passed into leaveView and closed',
          function () {
            scope.leaveViewNav('test-path');
            scope.leaveViewClose();
            expect(scope.leavePathNav).toContain('test-path');
          });

      });


    });

});
