'use strict';

describe('Directive: customValidity', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    fakeModel,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should not change the element', inject(function ($compile) {
    fakeModel = 'some values';
    element = angular.element('<input ng-pattern="/^-?([0-9]*)$/" custom-validity ng-model="fakeModel"/>');
    element = $compile(element)(scope);
    expect(element.attr('custom-validity')).toBe('');
  }));
});
