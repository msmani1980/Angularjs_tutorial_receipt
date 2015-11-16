'use strict';

describe('The Error Dialog directive', function() {

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
  var httpSessionInterceptor;
  var controller;

  beforeEach(inject(function($rootScope, $compile,_httpSessionInterceptor_) {
    httpSessionInterceptor = _httpSessionInterceptor_;
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    form = angular.element('<form name="myTestForm">' +
      '<input type="text" ng-model="deliveryNote" name="deliveryNote" required="true" custom-validity custom-pattern="alphanumeric"/>' +
      '<error-dialog form-object="myTestForm" error-response="errorResponse" display="true"></error-dialog>' +
      '</form>');
    form = compile(form)(scope);
    scope.$digest();
    element = angular.element(form.find('error-dialog')[0]);
    input = angular.element(form.find('input')[0]);
    controller = element.controller('errorDialog');
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

    it('should contain an panel element', function() {
      expect(element.find('.panel')[0]).toBeDefined();
    });

    it('should contain a list-group', function() {
      expect(element.find('.list-group')[0]).toBeDefined();
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
      expect(isolatedScope.errorRequired).toEqual(['delivery Note']);
    });

  });

  describe('When errorPattern has errors', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('bgoan');
      testForm.deliveryNote.$setViewValue('BOGAN!');
      scope.$digest();
    }));

    it('should contain 1 list item', function() {
      expect(element.find('li').length).toBe(1);
    });

    it('should contain 0 items in errorRequired', function() {
      expect(isolatedScope.errorRequired).toEqual([]);
    });

    it('should contain 1 item in errorPattern', function() {
      expect(isolatedScope.errorPattern).toEqual(['delivery Note']);
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

    it('should be expect displayError to be false', function() {
      expect(scope.displayError).toBeFalsy();
    });

  });

  describe('When the server returns a 500', function() {

    beforeEach(inject(function() {
      compileDirective();
    }));

    it('should set the internal server error flag to true', function() {
      httpSessionInterceptor.responseError({status: 500});
      expect(controller.internalServerError).toBeTruthy();
    });

    it('should set the internal server error flag to true', function() {
      testForm.deliveryNote.$setViewValue('!$1');
      httpSessionInterceptor.responseError({status: 500});
      var showError = isolatedScope.showInternalServerError();
      expect(showError).toBeFalsy();
    });

    it('should set the internal server error flag to true', function() {
      testForm.deliveryNote.$setViewValue('BOGAN123');
      httpSessionInterceptor.responseError({status: 500});
      var showError = isolatedScope.showInternalServerError();
      expect(showError).toBeTruthy();
    });

  });

  describe('When checking to see if we need to display failed requests', function() {

    beforeEach(inject(function() {
      compileDirective();
      testForm.deliveryNote.$setViewValue('ABC123');
      scope.errorResponse = {field:'storeId',reason: 'Thou hath displeased bogan'};
      httpSessionInterceptor.responseError({status: 400});
      scope.$digest();
    }));

    it('should return true', function() {
      expect(isolatedScope.showFailedRequest()).toBeTruthy();
    });

  });

});
