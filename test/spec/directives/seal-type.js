'use strict';

describe('Directive: sealType', function() {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var compile;
  var isolatedScope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    var newDirective = angular.element('<seal-type></seal-type>');
    element = compile(newDirective)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope();
  }

  describe('When the seal-type directive is compiled, it', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

    it('should contain an element with the class .seal-type', function() {
      expect(element.find('.seal-type')).toBeDefined();
    });

  });

  describe('The seal-type directive Scope,', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should have seals defined', function() {
      expect(isolatedScope.seals).toBeDefined();
    });

    it('should have seals as object', function() {
      expect(isolatedScope.seals).toEqual({
        numbers: []
      });
    });

    it('should have seals.numbers defined', function() {
      expect(isolatedScope.seals.numbers).toBeDefined();
    });

    it('should have seals as object', function() {
      expect(isolatedScope.seals.numbers).toEqual([]);
    });

    describe('The sequentialPossible method,', function() {

      beforeEach(inject(function() {
        spyOn(isolatedScope, 'isSequentialPossible').and.callThrough();
      }));

      it('should define method', function() {
        expect(isolatedScope.isSequentialPossible).toBeDefined();
      });

      it('should be true', function() {
        isolatedScope.seals.numbers = ['123'];
        isolatedScope.isSequentialPossible();
        expect(isolatedScope.isSequentialPossible).toBeTruthy();
      });

    });

  });

});
