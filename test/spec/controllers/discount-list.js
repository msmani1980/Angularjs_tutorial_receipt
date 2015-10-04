'use strict';

describe('Controller: DiscountListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discounts.json'));
  beforeEach(module('served/company-discount-types.json'));

  var DiscountListCtrl,
    scope,
    getDiscountListDeferred,
    getDiscountTypesListDeferred,
    discountFactory,
    discountListJSON,
    discountTypesListJSON,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _discountFactory_, $location) {
    inject(function (_servedCompanyDiscounts_, _servedCompanyDiscountTypes_) {
      discountListJSON = _servedCompanyDiscounts_;
      discountTypesListJSON = _servedCompanyDiscountTypes_;
    });

    scope = $rootScope.$new();
    location = $location;
    discountFactory = _discountFactory_;

    getDiscountListDeferred = $q.defer();
    getDiscountListDeferred.resolve(discountListJSON);
    getDiscountTypesListDeferred = $q.defer();
    getDiscountTypesListDeferred.resolve(discountTypesListJSON);

    spyOn(discountFactory, 'getDiscountList').and.returnValue(
      getDiscountListDeferred.promise);
    spyOn(discountFactory, 'getDiscountTypesList').and.returnValue(
      getDiscountTypesListDeferred.promise);

    DiscountListCtrl = $controller('DiscountListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('x');
  });
});
