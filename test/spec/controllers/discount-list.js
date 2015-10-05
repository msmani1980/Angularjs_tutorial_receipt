'use strict';
/*global moment*/

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

    spyOn(discountFactory, 'getDiscountList').and.returnValue(getDiscountListDeferred.promise);
    spyOn(discountFactory, 'getDiscountTypesList').and.returnValue(getDiscountTypesListDeferred.promise);

    DiscountListCtrl = $controller('DiscountListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Discount');
  });

  it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(discountFactory.getDiscountList).toHaveBeenCalledWith({});
  });

  it('should clear search model and make a API call', function () {
    scope.search = {
      startDate: '10/05/1979'
    };
    scope.searchDiscounts();
    expect(discountFactory.getDiscountList).toHaveBeenCalledWith({
      startDate: '19791005'
    });
  });

  it('should get the discount list from API', function () {
    expect(discountFactory.getDiscountList).toHaveBeenCalled();
  });

  describe('discountList in scope', function () {
    it('should attach a discountList after a API call to getDiscountList',
      function () {
        expect(!!scope.discountList).toBe(true);
      });

    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].companyId).toBe(403);
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].discountTypeId).toBe(4);
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].discountTypeName).toBe('Voucher');
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].name).toBe('10 % ');
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].rateTypeId).toBe(1);
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].rateTypeName).toBe('Percentage');
    });
    it('should have a discountTypeName name property', function () {
      expect(scope.discountList[0].companyDiscountRestrictions).toBe(false);
    });


    it('should have a formatted start and date', function () {
      expect(scope.discountList[0].startDate).toBe('07/22/2015');
    });
  });

  describe('Action buttons', function () {
    var fakeDiscountItem;

    beforeEach(function () {
      fakeDiscountItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });

    describe('can user edit', function () {
      it('should have a isDiscountEditable function', function () {
        expect(!!scope.isDiscountEditable).toBe(true);
      });

      it('should return true if discount is editable', function () {
        expect(scope.isDiscountEditable(fakeDiscountItem)).toBe(true);
      });

      it('should return false if discount is not editable', function () {
        fakeDiscountItem.endDate = moment().subtract(1, 'month').format(
          'L').toString();
        expect(scope.isDiscountEditable(fakeDiscountItem)).toBe(false);
      });
    });
  });
});
