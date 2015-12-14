'use strict';

describe('The Company Reason Type Subscription controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module'
  ));

  var scope;
  var controller;
  var CompanyReasonTypeSubscribeCtrl;
  var templateCache;
  var compile;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile) {
    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
  }));

  function createFormObject() {
    scope.subscribeReasonTypesForm = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'subscribeReasonTypesForm'
    };
  }

  function initController() {
    CompanyReasonTypeSubscribeCtrl = controller('CompanyReasonTypeSubscribeCtrl', {
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
      spyOn(CompanyReasonTypeSubscribeCtrl,'submitForm').and.callThrough();
      spyOn(CompanyReasonTypeSubscribeCtrl,'validateForm').and.callThrough();
      spyOn(CompanyReasonTypeSubscribeCtrl,'subscribeToReasonTypes').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(CompanyReasonTypeSubscribeCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(CompanyReasonTypeSubscribeCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.subscribeReasonTypesForm.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = CompanyReasonTypeSubscribeCtrl.validateForm();
        expect(control).toEqual(scope.subscribeReasonTypesForm.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        scope.subscribeReasonTypesForm.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(CompanyReasonTypeSubscribeCtrl.subscribeToReasonTypes).toHaveBeenCalled();
      });

    });

  });

  describe('the error handler', function () {

    var mockError = {
      status: 400,
      statusText: 'Bad Request',
      response: {
        field: 'bogan',
        code: '000'
      }
    };

    beforeEach(function() {
      initController();
      CompanyReasonTypeSubscribeCtrl.errorHandler(mockError);
    });

    it('should set error response ', function () {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function () {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('scope assignments', function() {

    beforeEach(function() {
      initController();
      scope.$digest();
      spyOn(CompanyReasonTypeSubscribeCtrl,'submitForm');
    });

    it('should call the submitForm method on the controller', function() {
      scope.submitForm();
      expect(CompanyReasonTypeSubscribeCtrl.submitForm).toHaveBeenCalled();
    });


  });

});
