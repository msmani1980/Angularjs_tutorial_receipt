'use strict';

describe('Company Reason Code Controller', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/company-reason-types.json'));

  var scope;
  var controller;
  var CompanyReasonCodeCtrl;
  var templateCache;
  var compile;
  var companyReasonTypesJSON;
  var getCompanyReasonTypesDeferred;

  beforeEach(inject(function($controller, $rootScope, $templateCache, $compile, $q,
    _servedCompanyReasonTypes_) {

    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;

    companyReasonTypesJSON = _servedCompanyReasonTypes_;
    getCompanyReasonTypesDeferred = $q.defer();

  }));

  function createFormObject() {
    scope.reasonForm0 = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name: 'reasonForm0',
    };

  }

  function resolveInitDependencies() {
    getCompanyReasonTypesDeferred.resolve(companyReasonTypesJSON);
    scope.$apply();
  }

  function registerSpies() {
    spyOn(CompanyReasonCodeCtrl, 'getCompanyReasonTypes').and.returnValue(getCompanyReasonTypesDeferred.promise);
  }

  function initController(action) {
    var params = {
      action: action || 'create'
    };
    CompanyReasonCodeCtrl = controller('CompanyReasonCodeCtrl', {
      $scope: scope,
      $routeParams: params
    });
    createFormObject();
    registerSpies();
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
      spyOn(CompanyReasonCodeCtrl, 'submitForm').and.callThrough();
      spyOn(CompanyReasonCodeCtrl, 'validateForm').and.callThrough();
      spyOn(CompanyReasonCodeCtrl, 'createCompanyReason').and.callThrough();
      scope.submitForm(scope.reasonForm0);
    });

    it('should call the controller method ', function() {
      expect(CompanyReasonCodeCtrl.submitForm).toHaveBeenCalledWith(scope.reasonForm0);
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(CompanyReasonCodeCtrl.validateForm).toHaveBeenCalledWith(scope.reasonForm0);
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.reasonForm0.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = CompanyReasonCodeCtrl.validateForm(scope.reasonForm0);
        expect(control).toEqual(scope.reasonForm0.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        scope.reasonForm0.$valid = true;
        scope.submitForm(scope.reasonForm0);
      });

      it('should call the create method', function() {
        expect(CompanyReasonCodeCtrl.createCompanyReason).toHaveBeenCalled();
      });

    });

  });

  describe('checking the action state', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
    });

    it('return true if the action state is create', function() {
      expect(CompanyReasonCodeCtrl.isActionState('create')).toBeTruthy();
    });

    it('return false when we pass an incorrect action state', function() {
      expect(CompanyReasonCodeCtrl.isActionState('bogan')).toBeFalsy();
    });

  });

  describe('filtering by reason type', function() {

    var reason;
    beforeEach(function() {
      initController();
      reason = {
        id: 2
      };
      resolveInitDependencies();
    });

    it('return true if there are no selectedReasonTypes', function() {
      scope.reasonFilter = {
        selectedReasonTypes: []
      };
      var filter = CompanyReasonCodeCtrl.filterByReasonType(reason);
      expect(filter).toBeTruthy();
    });

    it('return false if the id does not match up', function() {
      scope.reasonFilter = {
        selectedReasonTypes: [{
          id: 1
        }]
      };
      var filter = CompanyReasonCodeCtrl.filterByReasonType(reason);
      expect(filter).toBeFalsy();
    });

  });

  describe('getting a global reason from the form data object', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      scope.formData = {
        companyReasonTypes: [{
          id: 1
        }, {
          id: 2
        }]
      };
    });

    it('return the global reason if the id is found', function() {
      var reason = CompanyReasonCodeCtrl.getReasonTypeInFormData(1);
      expect(reason).toEqual({
        id: 1
      });
    });

    it('return false if the reason is not found', function() {
      var reason = CompanyReasonCodeCtrl.getReasonTypeInFormData(3);
      expect(reason).toBeUndefined();
    });

  });

  describe('adding company reasons to a global reason', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      scope.formData = {
        companyReasonTypes: [{
          id: 1,
          companyReasonCodes: []
        }]
      };
    });

    it('should add a new company reason to the correct global reasone', function() {
      CompanyReasonCodeCtrl.addReasonCode(1);
      expect(scope.formData.companyReasonTypes[0].companyReasonCodes.length).toEqual(1);
    });

    it('should not add a  company reason when the id passed is incorrect', function() {
      CompanyReasonCodeCtrl.addReasonCode(4);
      expect(scope.formData.companyReasonTypes[0].companyReasonCodes.length).toEqual(0);
    });

  });

  describe('removing company reason to a global reason', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      scope.formData = {
        companyReasonTypes: [{
          id: 1,
          companyReasonCodes: []
        }]
      };
      CompanyReasonCodeCtrl.addReasonCode(1);
      spyOn(CompanyReasonCodeCtrl, 'removeReason').and.callThrough();
    });

    it('should remove a company reason', function() {
      CompanyReasonCodeCtrl.removeReason(1, 0);
      expect(scope.formData.companyReasonTypes[0].companyReasonCodes.length).toEqual(0);
    });

    it('should not remove a company reason when the id passed is incorrect', function() {
      CompanyReasonCodeCtrl.removeReason(99, 0);
      expect(scope.formData.companyReasonTypes[0].companyReasonCodes.length).toEqual(1);
    });

    it('should call the controller method when executing the scope method', function() {
      scope.removeReason(1, 0);
      expect(CompanyReasonCodeCtrl.removeReason).toHaveBeenCalledWith(1, 0);
    });

  });

  describe('the error handler', function() {

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
      CompanyReasonCodeCtrl.errorHandler(mockError);
    });

    it('should set error response ', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function() {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('scope assignments', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      scope.$digest();
      spyOn(CompanyReasonCodeCtrl, 'addReasonCode');
      spyOn(CompanyReasonCodeCtrl, 'filterByReasonType');
    });

    it('should call the filterByReasonType method on the controller', function() {
      scope.whenReasonIsNotFiltered(1);
      expect(CompanyReasonCodeCtrl.filterByReasonType).toHaveBeenCalledWith(1);
    });

    it('should call the addReasonCode method on the controller', function() {
      scope.addReasonCode(1);
      expect(CompanyReasonCodeCtrl.addReasonCode).toHaveBeenCalledWith(1);
    });

    it('should call the addReasonCode method on the controller when the keypress is ENTER', function() {
      scope.addReasonCodeWithEnter({
        which: 13
      }, 1);
      expect(CompanyReasonCodeCtrl.addReasonCode).toHaveBeenCalledWith(1);
    });

    it('should not call the addReasonCode method on the controller when the keypress is anything else',
      function() {
        scope.addReasonCodeWithEnter({
          which: 9
        }, 1);
        expect(CompanyReasonCodeCtrl.addReasonCode).not.toHaveBeenCalled();
      });

  });

});
