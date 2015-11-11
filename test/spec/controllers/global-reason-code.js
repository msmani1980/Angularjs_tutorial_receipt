'use strict';

describe('Global Reason Code Controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module'
  ));

  var scope;
  var controller;
  var GlobalReasonCodeCtrl;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller;
  }));

  function createFormObject() {
    scope.globalReasonCodeForm = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'globalReasonCodeForm',
      refundCodeType: {
        $name: 'refundCodeType',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      },
      refundReason: {
        $name: 'refundReason',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $setViewValue: function(value) {
          this.$viewValue = value;
        }
      }
    };
  }

  function initController() {
    GlobalReasonCodeCtrl = controller('GlobalReasonCodeCtrl', {
      $scope: scope
    });
    createFormObject();
  }

  describe('when the controller loads', function() {

    beforeEach(function() {
      initController();
    });

    it('should have displayError set to false', function() {
      expect(scope.displayError).toBeFalsy();
    });

  });

  describe('when the user submits the form', function() {

    beforeEach(function() {
      initController();
      spyOn(GlobalReasonCodeCtrl,'submitForm').and.callThrough();
      spyOn(GlobalReasonCodeCtrl,'validateForm').and.callThrough();
      spyOn(GlobalReasonCodeCtrl,'createGlobalReasonCode').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(GlobalReasonCodeCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(GlobalReasonCodeCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.globalReasonCodeForm.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = GlobalReasonCodeCtrl.validateForm();
        expect(control).toEqual(scope.globalReasonCodeForm.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        scope.globalReasonCodeForm.refundCodeType.$setViewValue(1);
        scope.globalReasonCodeForm.refundReason.$setViewValue(1);
        scope.globalReasonCodeForm.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(GlobalReasonCodeCtrl.createGlobalReasonCode).toHaveBeenCalled();
      });

    });


  });

});
