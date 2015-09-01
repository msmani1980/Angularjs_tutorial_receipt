'use strict';

describe('The Step Wizard directive', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element;
  var scope;
  var directiveScope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.wizardSteps = [
      {
        label: 'Test label 1',
        uri: '/test-uri-1'
      },
      {
        label: 'Test label 2',
        uri: '/test-uri-2'
      }
    ];
    var template = '<step-wizard steps="wizardSteps"></step-wizard>';
    element = angular.element(template);
    element = $compile(element)(scope);
    scope.$apply();
    directiveScope = element.isolateScope();
  }));

  it('should have a steps var in the elements scopes that matches wizardSteps', function(){
    expect(directiveScope.steps).toEqual(scope.wizardSteps);
  });

});
