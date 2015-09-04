'use strict';

describe('Directive: errorDialog', function() {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var directiveScope;
  var compile;
  var controller;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    element = angular.element('<error-dialog></error-dialog>');
    element = compile(element)(scope);
    scope.$digest();
    directiveScope = element.isolateScope();
    controller = element.controller('errorDialogController');
  }

  describe('When the error-dialog directive is compiled, it', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

    it('should contain an alert element', function() {
      expect(element.find('.alert')).toBeDefined();
    });

    it('should contain a ul', function() {
      expect(element.find('ul')).toBeDefined();
    });

  });

  describe('When errorRequired has errors', function() {

    beforeEach(inject(function() {
      scope.errorRequired = ['Delivery Note Number'];
      compileDirective();
    }));

    it('should contain a list item', function() {
      expect(element.find('li.ng-scope')).toBeDefined();
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

  });

  describe('When errorPattern has errors', function() {

    beforeEach(inject(function() {
      scope.errorPattern = ['Delivery Note Number'];
      compileDirective();
    }));

    it('should contain a list item', function() {
      expect(element.find('li.ng-scope')).toBeDefined();
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

  });

});
