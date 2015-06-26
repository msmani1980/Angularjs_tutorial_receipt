'use strict';

describe('Directive: customValidity', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.fakeModel = 'some values';
  }));

  it('should not change the element', inject(function ($compile) {
    element = angular.element('<input custom-pattern="price" custom-validity ng-model="fakeModel"/>');
    element = $compile(element)(scope);
    expect(element.attr('custom-validity')).toBe('');
  }));
});
