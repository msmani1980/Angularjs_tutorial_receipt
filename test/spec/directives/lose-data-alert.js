'use strict';

fdescribe('Directive: looseDataAlert', function () {

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
  }

  describe('lose data alert with both triggers and default text', function(){
    beforeEach(inject(function(){
      scope.showLoseDataAlert = false;
      scope.mockConfirmTrigger = function(){
        return true;
      };
      scope.mockCancelTrigger = function(){
        return true;
      };
      template = '<lose-data-alert showAlert="showLoseDataAlert" ' +
        'confirm-trigger="mockConfirmTrigger()" ' +
        'cancel-trigger="mockCancelTrigger()" ' +
        '></lose-data-alert>';
      compileDirective();
      spyOn(scope, 'mockConfirmTrigger').and.callThrough();
      spyOn(scope, 'mockCancelTrigger').and.callThrough();
    }));
    it('should load with the alert dialog hidden', function(){
      expect(directiveScope.showAlertDialog).toBe(false);
    });
    it('should load with all the default text values set', function(){
      expect(directiveScope.title).toBe('Hold on!');
      expect(directiveScope.message).toBe('By taking this action, you might lose saved data, are you sure?');
      expect(directiveScope.confirmButtonText).toBe('Confirm');
      expect(directiveScope.cancelButtonText).toBe('Cancel');
    });
    it('should hide alert if hideAlert is triggered', function(){
      directiveScope.showAlertDialog = true;
      directiveScope.$apply();
      expect(directiveScope.showAlertDialog).toBe(true);
      directiveScope.hideAlert();
      expect(directiveScope.showAlertDialog).toBe(false);
    });
    it('should call scope.mockConfirmTrigger() when directive\'s confirm button is clicked', function(){
      var triggerReturn = directiveScope.callTrigger('confirmTrigger');
      expect(scope.mockConfirmTrigger).toHaveBeenCalled();
      expect(triggerReturn).toBe(true);
    });
    it('should call scope.mockCancelTrigger() when directive\'s cancel button is clicked', function(){
      var triggerReturn = directiveScope.callTrigger('cancelTrigger');
      expect(scope.mockCancelTrigger).toHaveBeenCalled();
      expect(triggerReturn).toBe(true);
    });
  });

  describe('lose data alert with no triggers and text defined', function(){
    beforeEach(inject(function(){
      scope.showLooseDataAlert = false;
      scope.mockAlertTitle = 'Foo title';
      scope.mockAlertMessage = 'Foo message';
      scope.mockAlertConfirmText = 'Foo confirm';
      scope.mockAlertCancelText = 'Foo cancel';
      template = '<lose-data-alert showAlert="showLooseDataAlert" ' +
        'title="mockAlertTitle" ' +
        'message="mockAlertMessage" ' +
        'confirm-button-text="mockAlertConfirmText" ' +
        'cancel-button-text="mockAlertCancelText" ' +
        '></lose-data-alert>';
      compileDirective();
    }));
    it('should load with all the defined text values set', function(){
      expect(directiveScope.title).toBe(scope.mockAlertTitle);
      expect(directiveScope.message).toBe(scope.mockAlertMessage);
      expect(directiveScope.confirmButtonText).toBe(scope.mockAlertConfirmText);
      expect(directiveScope.cancelButtonText).toBe(scope.mockAlertCancelText);
    });
    it('should return false when calling callTrigger(\'confirmTrigger\')', function(){
      expect(directiveScope.callTrigger('confirmTrigger')).toBe(false);
    });
    it('should return false when calling callTrigger(\'cancelTrigger\')', function(){
      expect(directiveScope.callTrigger('cancelTrigger')).toBe(false);
    });
  });

});
