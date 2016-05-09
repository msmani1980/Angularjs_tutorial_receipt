'use strict';

describe('Controller: ManualEposEntryCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/cash-bag-verifications.json'));

  var ManualEposEntryCtrl;
  var manualEposFactory;
  var scope;

  var cashBagDeferred;
  var cashBagJSON;

  var cashBagVerificationDeferred;
  var cashBagVerificationJSON;

  var cashBagId;
  var location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location) {
    scope = $rootScope.$new();
    manualEposFactory = $injector.get('manualEposFactory');

    inject(function (_servedCashBag_, _servedCashBagVerifications_) {
      cashBagJSON = _servedCashBag_;
      cashBagVerificationJSON = _servedCashBagVerifications_;
    });

    location = $location;

    cashBagDeferred = $q.defer();
    cashBagDeferred.resolve(cashBagJSON);
    spyOn(manualEposFactory, 'getCashBag').and.returnValue(cashBagDeferred.promise);

    cashBagVerificationDeferred = $q.defer();
    cashBagVerificationDeferred.resolve(cashBagVerificationJSON.response[0]);
    spyOn(manualEposFactory, 'checkCashBagVerification').and.returnValue(cashBagVerificationDeferred.promise);
    spyOn(location, 'path').and.callThrough();


    cashBagId = 123;
    ManualEposEntryCtrl = $controller('ManualEposEntryCtrl', {
      $scope: scope,
      $routeParams: {
        cashBagId: cashBagId
      }
    });
  }));

  describe('init', function () {
    it('should get cash bag', function () {
      expect(manualEposFactory.getCashBag).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.cashBag).toBeDefined();
    });

    it('should get cash bag verification', function () {
      expect(manualEposFactory.checkCashBagVerification).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.isVerified).toBeDefined();
      expect(scope.isVerified.cash).toBeDefined();
    });
  });

  describe('scope helpers', function () {
    describe('isFormVerified', function () {
      beforeEach(function () {
        scope.isVerified = {
          fakeForm: true
        };
      });
      it('should return true for verified forms', function () {
        expect(scope.isFormVerified('fakeForm')).toEqual(true);
      });

      it('should return false for undefined forms', function () {
        expect(scope.isFormVerified('fakeForm2')).toBeFalsy();
      });
    });

    describe('navigate to form', function () {
      it('should navigate to manual epos data form', function () {
        scope.navigateToForm('formName');
        expect(location.path).toHaveBeenCalledWith('manual-epos-formName/' + cashBagId);
      });
    });
  });
});
