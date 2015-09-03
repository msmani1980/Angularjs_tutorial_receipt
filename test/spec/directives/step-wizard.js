'use strict';

describe('The Step Wizard directive', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element;
  var scope;
  var directiveScope;
  var location;
  var template;
  var compile;

  beforeEach(inject(function ($rootScope, $location, $compile) {
    location = $location;
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective(){
    element = angular.element(template);
    element = compile(element)(scope);
    scope.$apply();
    directiveScope = element.isolateScope();
    spyOn(directiveScope, 'goToStepURI').and.callThrough();
  }

  describe('location without trailing slash', function() {
    beforeEach(inject(function(){

      scope.wizardSteps = [
        {
          label: 'Test label 1',
          uri: '/test-uri-1'
        },
        {
          label: 'Test label 2',
          uri: '/test-uri-2/'
        },
        {
          label: 'Test label 3',
          uri: '/test-uri-3'
        }
      ];
      scope.param1 = 1;
      scope.param2 = 2;
      scope.param3 = 3;
      scope.mockNextTrigger1 = function(param1){
        if(param1 === 2){
          return;
        }
      };
      scope.mockPrevTrigger1 = function(param2, param3){
        if(param2 === 3){
          return;
        }
        if(param3 === 4){
          return;
        }
      };

      template = '<step-wizard steps="wizardSteps" ' +
        'prev-trigger="mockPrevTrigger1(param1)" ' +
        'next-trigger="mockNextTrigger1(param2, param3)" ' +
        '></step-wizard>';

      spyOn(location, 'url').and.callThrough();
      spyOn(location, 'path').and.returnValue('/test-uri-2');

      spyOn(scope,'mockNextTrigger1').and.callThrough();
      spyOn(scope,'mockPrevTrigger1').and.callThrough();

      compileDirective();
    }));
    it('should have a steps var in the elements scopes that matches wizardSteps', function () {
      expect(directiveScope.steps).toEqual(scope.wizardSteps);
    });

    it('should set the 1st step\'s class equal to active', function () {
      expect(directiveScope.steps[0].class).toBe('completed');
    });

    it('should set the 2nd steps\'s class equal to active', function () {
      expect(directiveScope.steps[1].class).toBe('active');
    });

    it('should not set the 3rd steps\'s class', function () {
      expect(directiveScope.steps[2].class).toBe('future');
    });

    it('should strip the trailing slash from Test label 2\'s URI', function () {
      expect(directiveScope.steps[1].uri).toBe('/test-uri-2');
    });

    it('should step back to /test-uri-1 when wizardPrev is triggered', function(){
      expect(directiveScope.wizardPrev()).toBe(true);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(0);
      expect(scope.mockPrevTrigger1).toHaveBeenCalledWith(scope.param1);
      expect(location.url).toHaveBeenCalledWith('/test-uri-1');
    });

    it('should step forward to /test-uri-3 when wizardNext is triggered', function(){
      expect(directiveScope.wizardNext()).toBe(true);
      expect(scope.mockNextTrigger1).toHaveBeenCalledWith(scope.param2, scope.param3);
      expect(scope.wizardStepToIndex).toBe(2);
      expect(location.url).toHaveBeenCalledWith('/test-uri-3');
    });

    it('should return false if index is less than 0', function(){
      expect(directiveScope.goToStepURI(-1)).toBe(false);
    });

    it('should return false if index is equal to currentStepIndex', function(){
      expect(directiveScope.goToStepURI(1)).toBe(false);
    });

    it('should return false if index is greater than currentStepIndex', function(){
      expect(directiveScope.goToStepURI(5)).toBe(false);
    });

  });

  describe('wizardPrev directive scope function', function(){
    beforeEach(inject(function(){

      scope.wizardSteps = [
        {
          label: 'Test label 1',
          uri: '/test-uri-1'
        },
        {
          label: 'Test label 2',
          uri: '/test-uri-2/'
        },
        {
          label: 'Test label 3',
          uri: '/test-uri-3'
        }
      ];
      scope.param5 = 5;
      scope.param6 = 6;
      scope.param7 = 7;
      scope.mockPrevTrigger2 = function(param5){
        if(param5 === 6){
          return true;
        }
        return false;
      };
      scope.mockNextTrigger2 = function(param6, param7){
        if(param6 === 7){
          return true;
        }
        if(param7 === 8){
          return true;
        }
        return false;
      };

      template = '<step-wizard steps="wizardSteps" ' +
        'prev-trigger="mockPrevTrigger2(param5)" ' +
        'next-trigger="mockNextTrigger2(param6, param7)" ' +
        '></step-wizard>';

      spyOn(location, 'url').and.callThrough();
      spyOn(location, 'path').and.returnValue('/test-uri-3');

      spyOn(scope,'mockNextTrigger2').and.callThrough();
      spyOn(scope,'mockPrevTrigger2').and.callThrough();

      compileDirective();
    }));

    it('should not go anymore forward since it is on the last step', function(){
      expect(directiveScope.wizardNext()).toBe(false);
    });
    it('should only trigger the prevTrigger function, and not step the user back', function(){
      expect(directiveScope.wizardPrev()).toBe(false);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(1);
      expect(scope.wizardStepToIndex).toBe(1);
      expect(scope.mockPrevTrigger2).toHaveBeenCalledWith(scope.param5);
    });
  });

  describe('location with trailing slash', function() {
    beforeEach(inject(function(){
      scope.wizardSteps = [
        {
          label: 'Test label 1',
          uri: '/test-uri-1'
        },
        {
          label: 'Test label 2',
          uri: '/test-uri-2'
        },
        {
          label: 'Test label 3',
          uri: '/test-uri-3'
        }
      ];

      template = '<step-wizard steps="wizardSteps"></step-wizard>';

      spyOn(location, 'path').and.returnValue('/test-uri-1/');
      compileDirective();
    }));
    it('should append a trailing slash to Test label 1\' URI', function () {
      expect(directiveScope.steps[0].uri).toBe('/test-uri-1/');
    });
    it('should not go back since it is at the first step', function(){
      expect(directiveScope.wizardPrev()).toBe(false);
    });
  });

  describe('wizard disabled', function() {
    beforeEach(inject(function(){
      scope.wizardSteps = [
        {
          label: 'Test label 1',
          uri: '/test-uri-1'
        },
        {
          label: 'Test label 2',
          uri: '/test-uri-2'
        },
        {
          label: 'Test label 3',
          uri: '/test-uri-3'
        }
      ];
      scope.mockDisabled = true;

      template = '<step-wizard steps="wizardSteps" disable="mockDisabled"></step-wizard>';

      spyOn(location, 'path').and.returnValue('/test-uri-2');
      compileDirective();
    }));
    it('should not step forward', function(){
      expect(directiveScope.wizardNext()).toBe(false);
    });
    it('should not step backwards', function(){
      expect(directiveScope.wizardPrev()).toBe(false);
    });
    it('should not step anywhere', function(){
      expect(directiveScope.goToStepURI(2)).toBe(false);
    });
  });
});
