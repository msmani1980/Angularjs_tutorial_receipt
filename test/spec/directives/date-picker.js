'use strict';

describe('Directive: datePicker', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('date picker template', function () {
    beforeEach(inject(function ($compile) {
      element = angular.element('<date-picker label-from="labelFrom" label-to="labelTo"></date-picker>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have 2 input fields', function () {
      expect(element.find('input').length).toBe(2);
    });

    it('should have label-from', function () {
      expect(element.find('.startDateContainer label').text()).toBe('labelFrom');
    });

    it('should have label-from', function () {
      expect(element.find('.endDateContainer label').text()).toBe('labelTo');
    });
  });
});
