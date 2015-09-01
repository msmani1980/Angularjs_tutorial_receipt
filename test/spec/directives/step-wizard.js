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
    scope.myMockNextTrigger = function(){};
    scope.myMockNextTriggerParams = {id:123};
    scope.myMockPrevTrigger = function(){};
    scope.myMockPrevTriggerParams = {id:124};
    spyOn(scope,'myMockNextTrigger');
    spyOn(scope,'myMockPrevTrigger');
    template = '<step-wizard steps="wizardSteps" ' +
      'nextTrigger="myMockNextTrigger" ' +
      'nextTriggerParams="myMockNextTriggerParams" ' +
      'prevTrigger="myMockPrevTrigger" ' +
      'prevTriggerParams="myMockPrevTriggerParams" ' +
      '></step-wizard>';
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
      spyOn(location, 'path').and.returnValue('/test-uri-2');
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

    it('should go back to /test-uri-1 when wizardPrev is clicked', function(){
      directiveScope.wizardPrev();
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(0);
    });
  });

  describe('wizardNext directive scope function', function(){
    it('should call location url with next index', function(){
      scope.wizardSteps = [
        {
          label: 'Test label 1',
          uri: '/test-uri-1'
        },
        {
          label: 'Test label 2',
          uri: '/test-uri-2'
        }
      ];
      spyOn(location, 'path').and.returnValue('/test-uri-1');
      spyOn(location, 'url').and.callThrough();
      compileDirective();
      directiveScope.wizardNext();
      expect(location.url).toHaveBeenCalledWith('/test-uri-2');
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
      spyOn(location, 'path').and.returnValue('/test-uri-2/');
      compileDirective();
    }));
    it('should append a trailing slash to Test label 2\' URI', function () {
      expect(directiveScope.steps[1].uri).toBe('/test-uri-2/');
    });
  });
});
