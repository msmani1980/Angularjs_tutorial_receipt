'use strict';

describe('Directive: errorDialog', function() {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var compile;
  var form;
  var input;
  var testForm;
  var isolatedScope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    form = angular.element('<form name="myTestForm">' +
      '<input type="text" ng-model="deliveryNote" name="deliveryNote" required="true" custom-validity custom-pattern="alphanumeric"/>' +
      '<error-dialog form-object="myTestForm"></error-dialog>' +
      '</form>');
    form = compile(form)(scope);
    scope.$digest();
    element = angular.element(form.find('error-dialog')[0]);
    input = angular.element(form.find('input')[0]);
    isolatedScope = element.isolateScope();
    testForm = scope.myTestForm;
  }

  describe('When the error-dialog directive is compiled, it', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should be defined', function() {
      expect(element).toBeDefined();
    });

    it('should contain an alert element', function() {
      expect(element.find('.alert')).toBeDefined();
    });

    it('should contain a ul', function() {
      expect(element.find('ul')).toBeDefined();
    });

    it('should have a form-object attribute', function() {
      expect(element.attr('form-object')).toEqual('myTestForm');
    });

    it('should set the formObject in the directives scope', function() {
      expect(isolatedScope.formObject).toEqual(scope.myTestForm);
    });

  });

  describe('When errorRequired has errors', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('');
    }));

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 1 item in errorRequired', function() {
      expect(isolatedScope.errorRequired).toEqual(['deliveryNote']);
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 1 item in errorRequired', function() {
      expect(isolatedScope.errorRequired).toEqual(['deliveryNote']);
    });

  });

  describe('When errorPattern has errors', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('@@');
    }));

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 0 items in errorPattern', function() {
      expect(isolatedScope.errorPattern).toEqual([]);
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

  });

  describe('When inputs are valid', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('ABC123');
    }));

    it('should contain no items in errorRequired', function() {
      expect(isolatedScope.errorRequired).toEqual([]);
    });

    it('should contain no items in errorPattern', function() {
      expect(isolatedScope.errorPattern).toEqual([]);
    });

    describe('displayError', function() {

      it('should be defined', function() {
        expect(scope.displayError).toBeDefined();
      });

      it('should be false', function() {
        expect(scope.displayError).toBeFalsy();
      });

    });
  });

});
