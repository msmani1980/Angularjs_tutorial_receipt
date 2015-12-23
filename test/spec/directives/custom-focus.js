'use strict';

describe('Directive: customFocus', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element;
  var scope;
  var compile;
  var isolatedScope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    scope.shouldFocus = function() {
      return true;
    };
  }));

  function compileDirective() {
    var newDirective = angular.element('<input type="text" custom-focus="shouldFocus()" />');
    element = compile(newDirective)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope();
  }

  describe('when the directive links', function() {

    beforeEach(function() {
      compileDirective();
    });

    it('should focus the element', function() {
      expect(element[0].focus).toBeTruthy();
    });

  });

});
