'use strict';

describe('Controller: ManualEposEntryCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/cash-bag-verifications.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/cash-bag-cash.json'));
  beforeEach(module('served/cash-bag-items.json'));
  beforeEach(module('served/cash-bag-discount.json'));

  var ManualEposEntryCtrl;
  var manualEposFactory;
  var scope;

  var cashBagDeferred;
  var cashBagJSON;

  var cashBagVerificationDeferred;
  var cashBagVerificationJSON;

  var verifyCashBagDeferred;

  var cashBagCashDeferred;
  var cashBagCashJSON;

  var cashBagCreditDeferred;
  var cashBagCreditJSON;

  var cashBagItemsDeferred;
  var cashBagItemsJSON;

  var cashBagDiscountsDeferred;
  var cashBagDiscountJSON;

  var itemTypesDeferred;
  var itemTypesJSON;

  var cashBagId;
  var location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location) {
    scope = $rootScope.$new();
    manualEposFactory = $injector.get('manualEposFactory');

    inject(function (_servedCashBag_, _servedCashBagVerifications_, _servedItemTypes_,
      _servedCashBagCash_, _servedCashBagItems_, _servedCashBagDiscount_) {
      cashBagJSON = _servedCashBag_;
      cashBagVerificationJSON = _servedCashBagVerifications_;
      itemTypesJSON = _servedItemTypes_;
      cashBagCashJSON = _servedCashBagCash_;
      cashBagItemsJSON = _servedCashBagItems_;
      cashBagDiscountJSON = _servedCashBagDiscount_;
    });

    location = $location;

    cashBagCreditJSON = { response:[], meta: {count: 0}};

    cashBagDeferred = $q.defer();
    cashBagDeferred.resolve(cashBagJSON);
    spyOn(manualEposFactory, 'getCashBag').and.returnValue(cashBagDeferred.promise);

    cashBagVerificationDeferred = $q.defer();
    cashBagVerificationDeferred.resolve(cashBagVerificationJSON.response[0]);
    spyOn(manualEposFactory, 'checkCashBagVerification').and.returnValue(cashBagVerificationDeferred.promise);

    verifyCashBagDeferred = $q.defer();
    verifyCashBagDeferred.resolve({});
    spyOn(manualEposFactory, 'verifyCashBag').and.returnValue(verifyCashBagDeferred.promise);

    cashBagCashDeferred = $q.defer();
    cashBagCashDeferred.resolve(cashBagCashJSON);
    spyOn(manualEposFactory, 'getCashBagCashList').and.returnValue(cashBagCashDeferred.promise);

    cashBagCreditDeferred = $q.defer();
    cashBagCreditDeferred.resolve(cashBagCreditJSON);
    spyOn(manualEposFactory, 'getCashBagCreditList').and.returnValue(cashBagCreditDeferred.promise);

    cashBagItemsDeferred = $q.defer();
    cashBagItemsDeferred.resolve(cashBagDiscountJSON);
    spyOn(manualEposFactory, 'getCashBagDiscountList').and.returnValue(cashBagItemsDeferred.promise);

    cashBagDiscountsDeferred = $q.defer();
    cashBagDiscountsDeferred.resolve(cashBagItemsJSON);
    spyOn(manualEposFactory, 'getCashBagItemList').and.returnValue(cashBagDiscountsDeferred.promise);

    itemTypesDeferred = $q.defer();
    itemTypesDeferred.resolve(itemTypesJSON);
    spyOn(manualEposFactory, 'getItemTypes').and.returnValue(itemTypesDeferred.promise);

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
      expect(scope.isConfirmed).toBeDefined();
      expect(scope.confirmedInfo).toBeDefined();
    });

    it('should get cash bag cash', function () {
      expect(manualEposFactory.getCashBagCashList).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.containsChanges.cash).toBeDefined();
    });

    it('should get cash bag credit', function () {
      expect(manualEposFactory.getCashBagCreditList).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.containsChanges.credit).toBeDefined();
    });

    it('should get cash bag items', function () {
      expect(manualEposFactory.getCashBagItemList).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.containsChanges.virtual).toBeDefined();
      expect(scope.containsChanges.voucher).toBeDefined();
    });

    it('should get item types', function () {
      expect(manualEposFactory.checkCashBagVerification).toHaveBeenCalledWith(cashBagId);
    });

    it('should get cash bag discounts', function () {
      expect(manualEposFactory.getCashBagDiscountList).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.containsChanges.discount).toBeDefined();
    });

    it('should set scope.contains changes based on if array is empty', function () {
      scope.$digest();
      expect(scope.containsChanges.cash).toEqual(true);
      expect(scope.containsChanges.discount).toEqual(true);
      expect(scope.containsChanges.credit).toEqual(false);
      expect(scope.containsChanges.virtual).toEqual(true);
      expect(scope.containsChanges.voucher).toEqual(false);
    });

    it('should set readyToConfirm', function () {
        scope.$digest();
        expect(scope.readyToConfirm).toBeDefined();
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

    describe('doesFormHaveChanges', function () {
      it('should return true if form has changes and is unverified', function () {
        scope.isVerified = {'cash': false};
        scope.containsChanges = {'cash': true};
        expect(scope.doesFormHaveChanges('cash')).toEqual(true);
      });

      it('should return false if form is verified', function () {
        scope.isVerified = {'cash': true};
        scope.containsChanges = {'cash': true};
        expect(scope.doesFormHaveChanges('cash')).toEqual(false);
      });

      it('should return false if form has no changes', function () {
        scope.isVerified = {'cash': false};
        scope.containsChanges = {'cash': false};
        expect(scope.doesFormHaveChanges('cash')).toEqual(false);
      });
    });

    describe('shouldDisableForm', function () {
      it('should return false if cash bag is not confirmed', function () {
        scope.isConfirmed = false;
        scope.isVerified = {'cash': false};
        expect(scope.shouldDisableForm('cash')).toEqual(false);
      });

      it('should return true if cash bag is confirmed and form has no changes', function () {
        scope.isConfirmed = true;
        scope.isVerified = {'cash': false};
        scope.containsChanges = {'cash': false};
        expect(scope.shouldDisableForm('cash')).toEqual(true);
      });
    });

    describe('confirm all forms', function () {
      it('should confirm cash bag', function () {
        scope.confirmAll();
        expect(manualEposFactory.verifyCashBag).toHaveBeenCalledWith(cashBagId, 'CONFIRMED');
      });
    });
  });
});
