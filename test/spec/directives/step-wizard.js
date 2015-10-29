'use strict';

describe('The Step Wizard directive', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element;
  var scope;
  var directiveScope;
  var location;
  var template;
  var compile;

  beforeEach(inject(function($rootScope, $location, $compile) {
    location = $location;
    scope = $rootScope.$new();
    compile = $compile;
  }));

  function compileDirective() {
    element = angular.element(template);
    element = compile(element)(scope);
    scope.$apply();
    directiveScope = element.isolateScope();
    spyOn(directiveScope, 'goToStepURI').and.callThrough();
  }

  describe('location without trailing slash', function() {
    beforeEach(inject(function() {

      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2/'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];
      scope.param1 = 1;
      scope.param2 = 2;
      scope.param3 = 3;
      scope.param4 = 4;
      scope.mockNextTrigger1 = function(param1) {
        if (param1 === 2) {
          return;
        }
        return true;
      };
      scope.mockPrevTrigger1 = function(param2, param3) {
        if (param2 === 3) {
          return;
        }
        if (param3 === 4) {
          return;
        }
        return true;
      };
      scope.mockSaveTrigger1 = function(param4) {
        if (param4 === 5) {
          return;
        }
      };
      template = '<step-wizard steps="wizardSteps" ' +
        'prev-trigger="mockPrevTrigger1(param1)" ' +
        'next-trigger="mockNextTrigger1(param2, param3)" ' +
        'show-next-prev-button="true" ' +
        'save-trigger="mockSaveTrigger1(param4)" ' +
        '></step-wizard>';

      spyOn(location, 'url').and.callThrough();
      spyOn(location, 'path').and.returnValue('/test-uri-2');

      spyOn(scope, 'mockNextTrigger1').and.callThrough();
      spyOn(scope, 'mockPrevTrigger1').and.callThrough();
      spyOn(scope, 'mockSaveTrigger1').and.callThrough();

      compileDirective();
    }));

    it('should not disable step 2 since on step 3', function() {
      expect(directiveScope.steps[1].disabled).toBe(true);
    });

    it('should not disable the 1st step button', function() {
      expect(directiveScope.disableStep(0)).toBeFalsy();
    });

    it('should disable the 2nd step button', function() {
      expect(directiveScope.disableStep(1)).toBe(true);
    });

    it('should disable the 3rd step button', function() {
      expect(directiveScope.disableStep(2)).toBe(true);
    });

    it('should disable step 3 since on step 2', function() {
      expect(directiveScope.steps[2].disabled).toBe(true);
    });

    it('should have a steps var in the elements scopes that matches wizardSteps', function() {
      expect(directiveScope.steps).toEqual(scope.wizardSteps);
    });

    it('should set the 1st step\'s class equal to active', function() {
      expect(directiveScope.steps[0].class).toBe('complete');
    });

    it('should set the 2nd steps\'s class equal to active', function() {
      expect(directiveScope.steps[1].class).toBe('active');
    });

    it('should not set the 3rd steps\'s class', function() {
      expect(directiveScope.steps[2].class).toBe('future');
    });

    it('should strip the trailing slash from Test label 2\'s URI', function() {
      expect(directiveScope.steps[1].uri).toBe('/test-uri-2');
    });

    it('should step back to /test-uri-1 when wizardPrev is triggered', function() {
      expect(directiveScope.wizardPrev()).toBe(true);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(0);
      expect(scope.mockPrevTrigger1).toHaveBeenCalledWith(scope.param1);
      expect(location.url).toHaveBeenCalledWith('/test-uri-1');
    });

    it('should step forward to /test-uri-3 when wizardNext is triggered', function() {
      expect(directiveScope.wizardNext()).toBe(false);
      expect(scope.mockNextTrigger1).toHaveBeenCalledWith(scope.param2, scope.param3);
      expect(scope.wizardStepToIndex).toBe(2);
    });

    it('should return false if index is less than 0', function() {
      expect(directiveScope.goToStepURI(-1)).toBe(false);
    });

    it('should return false if index is equal to currentStepIndex', function() {
      expect(directiveScope.goToStepURI(1)).toBe(false);
    });

    it('should return false if index is greater than currentStepIndex', function() {
      expect(directiveScope.goToStepURI(5)).toBe(false);
    });

    it('should call the parent scopes save trigger when save and exit is clicked', function() {
      directiveScope.wizardSave();
      expect(scope.mockSaveTrigger1).toHaveBeenCalledWith(scope.param4);
    });

  });

  describe('wizardPrev directive scope function', function() {

    beforeEach(inject(function() {
      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2/'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];
      scope.param5 = 5;
      scope.param6 = 6;
      scope.param7 = 7;
      scope.mockPrevTrigger2 = function(param5) {
        if (param5 === 6) {
          return true;
        }
        return false;
      };
      scope.mockNextTrigger2 = function(param6, param7) {
        if (param6 === 7) {
          return true;
        }
        if (param7 === 8) {
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

      spyOn(scope, 'mockNextTrigger2').and.callThrough();
      spyOn(scope, 'mockPrevTrigger2').and.callThrough();

      compileDirective();
    }));

    it('should disable next button since on the last step', function() {
      expect(directiveScope.disableNext()).toBe(true);
    });

    it('should not disable prev button since on the last step', function() {
      expect(directiveScope.disablePrev()).toBe(false);
    });

    it('should not go anymore forward since it is on the last step', function() {
      expect(directiveScope.wizardNext()).toBe(false);
    });

    it('should only trigger the prevTrigger function, and not step the user back', function() {
      expect(directiveScope.wizardPrev()).toBe(false);
      expect(directiveScope.goToStepURI).toHaveBeenCalledWith(1);
      expect(scope.wizardStepToIndex).toBe(1);
      expect(scope.mockPrevTrigger2).toHaveBeenCalledWith(scope.param5);
    });

  });

  describe('location with trailing slash', function() {

    beforeEach(inject(function() {
      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];

      template = '<step-wizard steps="wizardSteps"></step-wizard>';

      spyOn(location, 'path').and.returnValue('/test-uri-1/');
      compileDirective();
    }));

    it('should disable the prev button since on first step', function() {
      expect(directiveScope.disablePrev()).toBe(true);
    });

    it('should not disable the next button since on first step', function() {
      expect(directiveScope.disableNext()).toBe(false);
    });

    it('should append a trailing slash to Test label 1\' URI', function() {
      expect(directiveScope.steps[0].uri).toBe('/test-uri-1/');
    });

    it('should not go back since it is at the first step', function() {
      expect(directiveScope.wizardPrev()).toBe(false);
    });

  });

  describe('wizard disabled', function() {
    beforeEach(inject(function() {
      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];
      scope.mockDisabled = true;

      template = '<step-wizard steps="wizardSteps" disabled="mockDisabled"></step-wizard>';

      spyOn(location, 'path').and.returnValue('/test-uri-2');
      compileDirective();
    }));

    it('should not step forward', function() {
      expect(directiveScope.wizardNext()).toBe(false);
    });

    it('should not step backwards', function() {
      expect(directiveScope.wizardPrev()).toBe(false);
    });

    it('should not save and exit', function() {
      expect(directiveScope.wizardSave()).toBe(false);
    });

    it('should not step anywhere', function() {
      expect(directiveScope.goToStepURI(2)).toBe(false);
    });

    it('should disable the next button', function() {
      expect(directiveScope.disableNext()).toBe(true);
    });

    it('should disable the prev button', function() {
      expect(directiveScope.disablePrev()).toBe(true);
    });

    it('should disable the 1st step button', function() {
      expect(directiveScope.disableStep(0)).toBe(true);
    });

    it('should disable the 2nd step button', function() {
      expect(directiveScope.disableStep(1)).toBe(true);
    });

    it('should disable the 3rd step button', function() {
      expect(directiveScope.disableStep(2)).toBe(true);
    });

  });

  describe('no triggers set', function() {
    beforeEach(inject(function() {
      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];

      template = '<step-wizard steps="wizardSteps"></step-wizard>';

      spyOn(location, 'path').and.returnValue('/test-uri-2');
      compileDirective();
      spyOn(directiveScope, 'nextTrigger').and.returnValue(undefined);
      spyOn(directiveScope, 'prevTrigger').and.returnValue(undefined);
    }));
    it('should not step forward', function() {
      expect(directiveScope.wizardNext()).toBe(false);
    });

    it('should not step backwards', function() {
      expect(directiveScope.wizardPrev()).toBe(false);
    });

  });

  describe('saveButtonText', function() {
    beforeEach(inject(function() {
      scope.wizardSteps = [{
        label: 'Test label 1',
        uri: '/test-uri-1'
      }, {
        label: 'Test label 2',
        uri: '/test-uri-2'
      }, {
        label: 'Test label 3',
        uri: '/test-uri-3'
      }];
    }));

    it('should default to Save&Exit when nothing is set', function() {
      template = '<step-wizard steps="wizardSteps"></step-wizard>';
      compileDirective();
      expect(directiveScope.saveButtonText).toEqual('Save & Exit');
    });
    it('should be set to save-button-text attribute', function() {
      scope.mockButtonText = 'fakeButtonText';
      template = '<step-wizard steps="wizardSteps" save-button-text="mockButtonText"></step-wizard>';
      compileDirective();
      expect(directiveScope.saveButtonText).toEqual(scope.mockButtonText);
    });
  });


});
