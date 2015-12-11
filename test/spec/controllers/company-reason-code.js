'use strict';

fdescribe('Company Reason Code Controller', function() {

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

  function createFormObject() {
    scope.companyReasonCodeFrom = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'companyReasonCodeFrom',
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

  function initController(action) {
    var params = {
      action: action || 'create'
    };
    CompanyReasonCodeCtrl = controller('CompanyReasonCodeCtrl', {
      $scope: scope,
      $routeParams: params
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
        scope.companyReasonCodeFrom.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(CompanyReasonCodeCtrl.createCompanyReasonCode).toHaveBeenCalled();
      });

    });

  });

  describe('checking the action state', function() {

    beforeEach(function() {
      initController();
    });

    it('return true if the action state is create', function() {
      expect(CompanyReasonCodeCtrl.isActionState('create')).toBeTruthy();
    });

    it('return false when we pass an incorrect action state', function() {
      expect(CompanyReasonCodeCtrl.isActionState('bogan')).toBeFalsy();
    });

  });

  describe('filtering by global reason', function() {

    var reason;
    beforeEach(function() {
      initController();
      reason = {
        id: 2
      };
    });

    it('return true if there are no selectedGlobalReasons', function() {
      scope.reasonFilter = {
        selectedGlobalReasons: []
      };
      var filter = CompanyReasonCodeCtrl.filterByGlobalReason(reason);
      expect(filter).toBeTruthy();
    });

    it('return false if the id does not match up', function() {
      scope.reasonFilter = {
        selectedGlobalReasons: [
          {id:1}
        ]
      };
      var filter = CompanyReasonCodeCtrl.filterByGlobalReason(reason);
      expect(filter).toBeFalsy();
    });

  });

  describe('getting a global reason from the form data object', function() {

    beforeEach(function() {
      initController();
      scope.formData = {
        globalReasons:[
          {id:1},
          {id:2}
        ]
      };
    });

    it('return the global reason if the id is found', function() {
      var reason = CompanyReasonCodeCtrl.getGlobalReasonInFormData(1);
      expect(reason).toEqual({id:1});
    });

    it('return false if the reason is not found', function() {
      var reason = CompanyReasonCodeCtrl.getGlobalReasonInFormData(3);
      expect(reason).toBeUndefined();
    });

  });

  describe('adding company reasons to a global reason', function() {

    beforeEach(function() {
      initController();
      scope.formData = {
        globalReasons:[
          {
            id:1,
            companyReasons:[]
          }
        ]
      };
    });

    it('should add a new company reason to the correct global reasone', function() {
      CompanyReasonCodeCtrl.addReasonCode(1);
      expect(scope.formData.globalReasons[0].companyReasons.length).toEqual(1);
    });

    it('should not add a  company reason when the id passed is incorrect', function() {
      CompanyReasonCodeCtrl.addReasonCode(4);
      expect(scope.formData.globalReasons[0].companyReasons.length).toEqual(0);
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
      CompanyReasonCodeCtrl.errorHandler(mockError);
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
      spyOn(CompanyReasonCodeCtrl,'addReasonCode');
      spyOn(CompanyReasonCodeCtrl,'filterByGlobalReason');
    });

    it('should call the addReasonCode method on the controller', function() {
      scope.addReasonCode(1);
      expect(CompanyReasonCodeCtrl.addReasonCode).toHaveBeenCalledWith(1);
    });

    it('should call the filterByGlobalReason method on the controller', function() {
      scope.whenReasonIsNotFiltered();
      expect(CompanyReasonCodeCtrl.filterByGlobalReason).toHaveBeenCalled();
    });

    it('should call the addReasonCode method on the controller when the keypress is ENTER', function() {
      scope.addReasonCodeWithEnter({which:13},1);
      expect(CompanyReasonCodeCtrl.addReasonCode).toHaveBeenCalledWith(1);
    });

    it('should not call the addReasonCode method on the controller when the keypress is anything else', function() {
      scope.addReasonCodeWithEnter({which:9},1);
      expect(CompanyReasonCodeCtrl.addReasonCode).not.toHaveBeenCalled();
    });

  });


});
