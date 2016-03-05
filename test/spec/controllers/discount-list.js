'use strict';
/*global moment*/

describe('Controller: DiscountListCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discounts.json'));
  beforeEach(module('served/company-discount-types.json'));

  var DiscountListCtrl;
  var scope;
  var getDiscountListDeferred;
  var getDiscountTypesListDeferred;
  var discountFactory;
  var discountListJSON;
  var discountTypesListJSON;
  var location;
  var dateUtility;

  beforeEach(inject(function($q, $controller, $rootScope, _discountFactory_, $location, $injector) {
    inject(function(_servedCompanyDiscounts_, _servedCompanyDiscountTypes_) {
      discountListJSON = _servedCompanyDiscounts_;
      discountTypesListJSON = _servedCompanyDiscountTypes_;
    });

    scope = $rootScope.$new();
    location = $location;
    dateUtility = $injector.get('dateUtility');
    discountFactory = _discountFactory_;

    getDiscountListDeferred = $q.defer();
    getDiscountListDeferred.resolve(discountListJSON);
    getDiscountTypesListDeferred = $q.defer();
    getDiscountTypesListDeferred.resolve(discountTypesListJSON);

    spyOn(discountFactory, 'getDiscountList').and.returnValue(getDiscountListDeferred.promise);
    spyOn(discountFactory, 'getDiscountTypesList').and.returnValue(getDiscountTypesListDeferred.promise);
    spyOn(discountFactory, 'deleteDiscount').and.stub();

    DiscountListCtrl = $controller('DiscountListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function() {
    expect(scope.viewName).toBe('Discount');
  });

  it('should clear search model and list model', function() {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(scope.discountList).toEqual([]);
  });

  it('should get the discount list from API', function() {
    scope.loadDiscounts();
    expect(discountFactory.getDiscountList).toHaveBeenCalledWith({
      startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
      endDate: null,
      limit: 100,
      offset: 0
    });
  });

  describe('discountList in scope', function() {
    beforeEach(function() {
      scope.loadDiscounts();
      scope.$digest();
    });

    it('should attach a discountList after a API call to getDiscountList',
      function() {
        expect(scope.discountList.length).toEqual(8);
      });

    it('should have a companyId name property', function() {
      expect(scope.discountList[0].companyId).toBe(403);
    });

    it('should have a discountTypeId name property', function() {
      expect(scope.discountList[0].discountTypeId).toBe(4);
    });

    it('should have a discountTypeName name property', function() {
      expect(scope.discountList[0].discountTypeName).toBe('Voucher');
    });

    it('should have a name name property', function() {
      expect(scope.discountList[0].name).toBe('10 % ');
    });

    it('should have a rateTypeId name property', function() {
      expect(scope.discountList[0].rateTypeId).toBe(1);
    });

    it('should have a rateTypeName name property', function() {
      expect(scope.discountList[0].rateTypeName).toBe('Percentage');
    });

    it('should have a companyDiscountRestrictions name property', function() {
      expect(scope.discountList[0].companyDiscountRestrictions).toBe(false);
    });

    it('should have a formatted start and date', function() {
      expect(scope.discountList[0].startDate).toBe('07/22/2015');
    });
  });

  describe('Action buttons', function() {
    var fakeDiscountItem;

    beforeEach(function() {
      fakeDiscountItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });

    describe('can user edit', function() {
      it('should have a isDiscountEditable function', function() {
        expect(!!scope.isDiscountEditable).toBe(true);
      });

      it('should return true if discount is editable', function() {
        expect(scope.isDiscountEditable(fakeDiscountItem)).toBe(true);
      });

      it('should return false if discount is not editable', function() {
        fakeDiscountItem.endDate = moment().subtract(1, 'month').format(
          'L').toString();
        expect(scope.isDiscountEditable(fakeDiscountItem)).toBe(false);
      });
    });

    it('should delete discount be called', function() {
      DiscountListCtrl.deleteDiscount(1);

      expect(discountFactory.deleteDiscount).toHaveBeenCalledWith(1);
    });
  });
});
