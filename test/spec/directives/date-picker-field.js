'use strict';

describe('Directive: datePickerField', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('date picker template', function () {
    var formGroup;
    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<date-picker-field label="labelFrom" required></date-picker-field>'
      );
      element = $compile(element)(scope);
      scope.$digest();
      formGroup = angular.element(element.find('.form-group')[0]);
    }));

    it('should be wrapped in a form-group', function () {
      expect(formGroup).toBeDefined();
    });

    describe('label element', function () {
      var label;
      beforeEach(function () {
        label = angular.element(formGroup.find('label')[0]);
      });

      it('should be present in the DOM', function () {
        expect(label).toBeDefined();
      });

      describe('required span label', function () {
        var span;
        beforeEach(function () {
          span = angular.element(label.find('span')[0]);
        });

        it('should be present in the DOM', function () {
          expect(span).toBeDefined();
        });

        it('should have a .required class', function () {
          expect(span.hasClass('required')).toBeTruthy();
        });

        it(
          'should have a ng-show attribute that shows the span if the field is required',
          function () {
            expect(span.attr('ng-show')).toEqual('required');
          });

        it('should have a * display in the span', function () {
          expect(span.text()).toEqual('*');
        });

      });

    });

    describe('input group', function () {
      var inputGroup;
      beforeEach(function () {
        inputGroup = angular.element(formGroup.find(
          '.input-group')[0]);
      });

      it('should be present in the DOM', function () {
        expect(inputGroup).toBeDefined();
      });

      describe('input group button element', function () {
        var inputGroupBtn,
          button;
        beforeEach(function () {
          inputGroupBtn = angular.element(inputGroup.find(
            '.input-group-btn')[0]);
          button = angular.element(inputGroupBtn.find(
            'button')[0]);
        });

        it('should be present in the DOM', function () {
          expect(inputGroupBtn).toBeDefined();
        });

      });

    });

    it('should have 1 input field', function () {
      expect(element.find('input').length).toBe(1);
    });

  });

});
