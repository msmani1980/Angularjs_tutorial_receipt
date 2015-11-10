'use strict';

describe('Company Reason Code Controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module'
  ));

  var scope;
  var controller;
  var CompanyReasonCodeCtrl;
  var templateCache;
  var compile;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile) {
    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
  }));

  function renderView() {
    var html = templateCache.get('/views/company-reason-code.html');
    var compiled = compile(angular.element(html))(scope);
    var view = angular.element(compiled[0]);
    scope.$digest();
    return view;
  }

  function initController() {
    CompanyReasonCodeCtrl = controller('CompanyReasonCodeCtrl', {
      $scope: scope
    });
    renderView();
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
      spyOn(CompanyReasonCodeCtrl,'submitForm').and.callThrough();
      spyOn(CompanyReasonCodeCtrl,'validateForm').and.callThrough();
      spyOn(CompanyReasonCodeCtrl,'createCompanyReasonCode').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(CompanyReasonCodeCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(CompanyReasonCodeCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.companyReasonCodeFrom.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = CompanyReasonCodeCtrl.validateForm();
        expect(control).toEqual(scope.companyReasonCodeFrom.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        scope.companyReasonCodeFrom.refundCodeType.$setViewValue(1);
        scope.companyReasonCodeFrom.refundReason.$setViewValue(1);
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(CompanyReasonCodeCtrl.createCompanyReasonCode).toHaveBeenCalled();
      });

    });


  });

});
