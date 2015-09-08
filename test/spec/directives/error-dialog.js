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

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    form = angular.element('<form name="form">' +
      '<input type="text" ng-model="model.deliveryNote" name="deliveryNote" required="true" pattern="regexp.number"/>' +
      '<error-dialog></error-dialog>' +
      '</form>');
    form = compile(form)(scope);
    scope.$digest();
    element = angular.element(form.find('error-dialog')[0]);
    input = angular.element(form.find('input')[0]);
    testForm = scope.form;
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
      expect(scope.errorRequired).toEqual(['deliveryNote']);
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 1 item in errorRequired', function() {
      expect(scope.errorRequired).toEqual(['deliveryNote']);
    });

  });

  describe('When errorPattern has errors', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('@@@');
    }));

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 1 item in errorPattern', function() {
      expect(scope.errorPattern).toEqual(['deliveryNote']);
    });

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 1 item in errorPattern', function() {
      expect(scope.errorPattern).toEqual(['deliveryNote']);
    });

  });

  describe('When inputs are valid', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('000456');
    }));

    it('should contain no items in errorRequired', function() {
      expect(scope.errorRequired).toEqual([]);
    });

    it('should contain no items in errorPattern', function() {
      expect(scope.errorRequired).toEqual([]);
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
