'use strict';

describe('Directive: datePickerField', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<date-picker-field></date-picker-field>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the datePickerField directive');
  }));
});
