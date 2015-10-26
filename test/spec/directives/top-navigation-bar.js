'use strict';

describe('Directive: topNavigationBar', function () {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should load the template and attach it to scope', inject(function ($compile) {
    element = angular.element('<top-navigation-bar></top-navigation-bar>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('.navbar-fixed-top.ts5-logo').length).toBe(1);
  }));
});
