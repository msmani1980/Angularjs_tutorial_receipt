'use strict';

describe('Directive: sealType', function () {

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

  describe('When the error-dialog directive is compiled, it', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

  });

});
