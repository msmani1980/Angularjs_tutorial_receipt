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

  it('should format the number with 4 decimal precision', inject(function ($compile) {
    var elementString = '<form name="form">';
    elementString += '<input name="testElement" type="text" custom-pattern="currencyWithFourDecimalPlace" custom-validity ng-model="fakeModel"/>';
    elementString += '</form>';
    scope.fakeModel = '20.00';

    element = angular.element(elementString);
    element = $compile(element)(scope);
    scope.$digest();

    expect(scope.form.testElement.$viewValue).toBe('20.0000');
  }));

  it('should format the number with 2 decimal precision', inject(function ($compile) {
    var elementString = '<form name="form">';
    elementString += '<input name="testElement" type="text" custom-pattern="currencyWithTwoDecimalPlace" custom-validity ng-model="fakeModel"/>';
    elementString += '</form>';
    scope.fakeModel = '20.0000';

    element = angular.element(elementString);
    element = $compile(element)(scope);
    scope.$digest();

    expect(scope.form.testElement.$viewValue).toBe('20.00');
  }));
});
