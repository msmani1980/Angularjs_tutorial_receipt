'use strict';

describe('The Company Reason Type Subscription controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/company-reason-types.json',
    'served/global-reason-types.json'
  ));

  var scope;
  var controller;
  var CompanyReasonTypeSubscribeCtrl;
  var templateCache;
  var compile;
  var globalReasonTypesJSON;
  var getGlobalReasonTypesDeferred;
  var companyReasonTypesJSON;
  var getCompanyReasonTypesDeferred;

  beforeEach(inject(function($controller, $rootScope, $templateCache, $compile, $q,
    _servedGlobalReasonTypes_, _servedCompanyReasonTypes_) {

    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;

    globalReasonTypesJSON = _servedGlobalReasonTypes_;
    companyReasonTypesJSON = _servedCompanyReasonTypes_;

    getGlobalReasonTypesDeferred = $q.defer();
    getCompanyReasonTypesDeferred = $q.defer();
  }));

  function createFormObject() {
    scope.subscribeReasonTypesForm = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'subscribeReasonTypesForm'
    };
  }

  function registerSpies() {
    spyOn(CompanyReasonTypeSubscribeCtrl, 'getGlobalReasonTypes').and.returnValue(getGlobalReasonTypesDeferred.promise);
    spyOn(CompanyReasonTypeSubscribeCtrl, 'getCompanyReasonTypes').and.returnValue(getGlobalReasonTypesDeferred.promise);
  }

  function resolveInitDependencies() {
    getGlobalReasonTypesDeferred.resolve(globalReasonTypesJSON);
    getCompanyReasonTypesDeferred.resolve(companyReasonTypesJSON);
  }

  function initController() {
    CompanyReasonTypeSubscribeCtrl = controller('CompanyReasonTypeSubscribeCtrl', {
      $scope: scope
    });
    createFormObject();
    registerSpies();
    scope.$digest();
  }

  describe('when the controller loads', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
    });

    it('should have displayError set to false', function() {
      expect(scope.displayError).toBeFalsy();
    });

  });

  describe('when the user submits the form', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      spyOn(CompanyReasonTypeSubscribeCtrl, 'submitForm').and.callThrough();
      spyOn(CompanyReasonTypeSubscribeCtrl, 'validateForm').and.callThrough();
      spyOn(CompanyReasonTypeSubscribeCtrl, 'subscribeToReasonTypes').and.callThrough();
      spyOn(CompanyReasonTypeSubscribeCtrl, 'displayUnsubscribeError').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(CompanyReasonTypeSubscribeCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when checking for existing types', function() {

      var mockDiff;
      beforeEach(function() {
        scope.formData.companyReasonTypes.splice(0, 1);
        mockDiff = [scope.companyReasonTypes[0]];
        scope.submitForm();
      });

      it('should display the unsubscribe error', function() {
        expect(CompanyReasonTypeSubscribeCtrl.displayUnsubscribeError).toHaveBeenCalledWith(mockDiff);
      });

      it('should set the custom Error arry', function() {
        var mockCustomError = [{
          field: mockDiff[0].reasonTypeName,
          value: 'You can\'t unsubscribe from this  Reason Type because there are Reasons associated with it'
        }];
        expect(scope.errorCustom).toEqual(mockCustomError);
      });

      it('should set the forms valid flag to false', function() {
        expect(scope.subscribeReasonTypesForm.$valid).toBeFalsy();
      });

      it('should set the forms invalid flag to true', function() {
        expect(scope.subscribeReasonTypesForm.$invalid).toBeTruthy();
      });

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
      resolveInitDependencies();
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
      resolveInitDependencies();
      scope.$digest();
      spyOn(CompanyReasonTypeSubscribeCtrl, 'submitForm');
    });

    it('should call the submitForm method on the controller', function() {
      scope.submitForm();
      expect(CompanyReasonTypeSubscribeCtrl.submitForm).toHaveBeenCalled();
    });

  });

});
