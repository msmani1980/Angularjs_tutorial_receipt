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
      scope.param1 = '123';
      scope.param2 = '1234';
      scope.param3 = '12345';
      scope.myMockNextTrigger1 = function(p1){
        if(p1 === 980345){
          return;
        }
      };
      scope.myMockPrevTrigger1 = function(p2, p3){
        if(p2 === 980345){
          return;
        }
        if(p3 === 984566){
          return;
        }
      };

      template = '<step-wizard steps="wizardSteps" ' +
        'prev-trigger="myMockPrevTrigger1(param1)" ' +
        'next-trigger="myMockNextTrigger1(param2, param3)" ' +
        '></step-wizard>';

      spyOn(location, 'url').and.callThrough();
      spyOn(location, 'path').and.returnValue('/test-uri-2');

      spyOn(scope,'myMockNextTrigger1').and.callThrough();
      spyOn(scope,'myMockPrevTrigger1').and.callThrough();

      compileDirective();
    }));
    it('should have a steps var in the elements scopes that matches wizardSteps', function () {
      expect(directiveScope.steps).toEqual(scope.wizardSteps);
    });

    it('should set the 1st step\'s class equal to active', function () {
      expect(directiveScope.steps[0].class).toBe('active');
    });

    it('should set the 2nd steps\'s class equal to active', function () {
      expect(directiveScope.steps[1].class).toBe('active');
    });

    it('should not set the 3rd steps\'s class', function () {
      expect(directiveScope.steps[2].class).toBeUndefined();
    });

    it('should strip the trailing slash from Test label 2\'s URI', function () {
      expect(directiveScope.steps[1].uri).toBe('/test-uri-2');
    });

    it('should step back to /test-uri-1 when wizardPrev is triggered', function(){
      expect(directiveScope.wizardPrev()).toBe(true);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(0);
      expect(scope.myMockPrevTrigger1).toHaveBeenCalledWith(scope.param1);
      expect(location.url).toHaveBeenCalledWith('/test-uri-1');
    });

    it('should step forward to /test-uri-3 when wizardNext is triggered', function(){
      expect(directiveScope.wizardNext()).toBe(true);
      expect(scope.myMockNextTrigger1).toHaveBeenCalledWith(scope.param2, scope.param3);
      expect(location.url).toHaveBeenCalledWith('/test-uri-3');
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
      scope.myMockPrevTrigger2 = function(p5){
        if(p5 === 9034853){
          return true;
        }
        return false;
      };
      scope.myMockNextTrigger2 = function(p6, p7){
        if(p6 === 9090345){
          return true;
        }
        if(p7 === 908345345){
          return true;
        }
        return false;
      };

      template = '<step-wizard steps="wizardSteps" ' +
        'prev-trigger="myMockPrevTrigger2(param5)" ' +
        'next-trigger="myMockNextTrigger2(param6, param7)" ' +
        '></step-wizard>';

      spyOn(location, 'url').and.callThrough();
      spyOn(location, 'path').and.returnValue('/test-uri-3');

      spyOn(scope,'myMockNextTrigger2').and.callThrough();
      spyOn(scope,'myMockPrevTrigger2').and.callThrough();

      compileDirective();
    }));
    it('should only trigger the prevTrigger function, and not step the user back', function(){
      expect(directiveScope.wizardPrev()).toBe(false);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(1);
      expect(scope.myMockPrevTrigger2).toHaveBeenCalledWith(scope.param5);
    });
    it('should not go anymore forward since it is on the last step', function(){
      expect(directiveScope.wizardNext()).toBe(false);
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
});
