'use strict';

describe('Directive: stockTakeReason', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element,
    controller,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function($compile) {
    element = angular.element('<stock-take-reason></stock-take-reason>');
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('stockTakeReason');
  }));

  describe('When the stock take modal directive is compiled, it',
    function() {

      it('should inject the directive', function() {
        expect(element).toBeDefined();
      });

      it('should contain an element with a modal class', function() {
        expect(element.find('.modal')).toBeDefined();
      });

      it('should contain an element with a fade class', function() {
        expect(element.find('.fade')).toBeDefined();
      });

      it('should have a modal-content element', function() {
        expect(element.find('.modal-content')).toBeDefined();
      });

      it('should have a modal-body element', function() {
        expect(element.find('.modal-body')).toBeDefined();
      });

      it('should have a modal-footer element', function() {
        expect(element.find('.modal-footer')).toBeDefined();
      });

      it('should have a leave button', function() {
        expect(element.find('.btn-default')).toBeDefined();
      });

    });

  describe('When the directives controller is accessed, it', function() {
    it('should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

});
