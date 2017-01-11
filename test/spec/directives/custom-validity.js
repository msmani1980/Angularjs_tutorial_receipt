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

  it('should check the patter of the element', inject(function ($compile) {
    var elementString = '<form name="form">';
    scope.fakeModel = '20.00';
    elementString += '<input name="testElement" type="text" custom-pattern="word" custom-validity ng-model="fakeModel"/>';
    elementString += '</form>';

    element = angular.element(elementString);
    element = $compile(element)(scope);
    scope.$digest();

    expect(scope.form.testElement.$error.pattern).toBe(true);
  }));

  it('should not check the pattern on the element if model is undefined or null', inject(function ($compile) {
    var elementString = '<form name="form">';
    delete scope.fakeModel;
    elementString += '<input name="testElement" type="text" custom-pattern="currencyWithTwoDecimalPlace" custom-validity ng-model="fakeModel"/>';
    elementString += '</form>';

    element = angular.element(elementString);
    element = $compile(element)(scope);
    scope.$digest();

    expect(scope.form.testElement.$error).toEqual({});
  }));

  it('should check the pattern on the element if model is undefined or null and element is required', inject(function ($compile) {
    var elementString = '<form name="form">';
    delete scope.fakeModel;
    elementString += '<input required name="testElement" type="text" custom-pattern="currencyWithTwoDecimalPlace" custom-validity ng-model="fakeModel"/>';
    elementString += '</form>';

    element = angular.element(elementString);
    element = $compile(element)(scope);
    scope.$digest();

    expect(scope.form.testElement.$error.required).toEqual(true);
  }));
  
  it('should check the pattern on the element if model is defined and it allows only  ( @, %, ^, /, &, -, _, ., *)', inject(function ($compile) {
	    var elementString = '<form name="form">';
	    scope.fakeModel = 'Test%.Allow@Spe^cial-Ch/ar_Te\st&';
	    elementString += '<input required name="testSpecialCharElement" type="text" custom-pattern="alphaWithSpecialCharMenuItem" custom-validity ng-model="fakeModel"/>';
	    elementString += '</form>';

	    element = angular.element(elementString);
	    element = $compile(element)(scope);
	    scope.$digest();

	    expect(scope.form.$valid).toBeTruthy();
	    scope.form.testSpecialCharElement.$setViewValue('Te!st%.Allow@Spe^cial-Ch/ar_Te\st&#$');
	    expect(scope.form.$valid).toBeFalsy();
	    
	    scope.form.testSpecialCharElement.$setViewValue('Test%.Allow@Spe^cial-Ch/ar_Te\st&*\'');
	    expect(scope.form.$valid).toBeTruthy();
	    
	}));
  
   it('should check the pattern on the element if model is defined and its starts with alphanumeric or not', inject(function ($compile) {
	    var elementString = '<form name="form">';
	    scope.fakeModel = 'Menu Test123';
	    elementString += '<input required name="testSpecialCharElement" type="text" custom-pattern="alphanumericSpaces" custom-validity ng-model="fakeModel"/>';
	    elementString += '</form>';

	    element = angular.element(elementString);
	    element = $compile(element)(scope);
	    scope.$digest();

	    expect(scope.form.$valid).toBeTruthy();
	    scope.form.testSpecialCharElement.$setViewValue('@Menu Test123');
	    expect(scope.form.$valid).toBeFalsy();
	}));
});
