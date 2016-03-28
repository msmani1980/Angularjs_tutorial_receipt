'use strict';

fdescribe('Controller: ManualEposEntryCtrl', function() {

  beforeEach(module('ts5App'));

  var ManualEposEntryCtrl;
  var manualEposFactory;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    manualEposFactory = $injector.get('manualEposFactory');
    ManualEposEntryCtrl = $controller('ManualEposEntryCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  it('should attach currencyList to the scope', function() {
    scope.$digest();
    expect(scope.currencyList.length).toBe(4);
  });

  it('should attach promotionsList to the scope', function() {
    scope.$digest();
    expect(scope.promotionsList.length).toBe(3);
  });

  it('should attach companyPromotionsList to the scope', function() {
    scope.$digest();
    expect(scope.companyPromotionsList.length).toBe(3);
  });

  it('should attach companyVoucherItemsList to the scope', function() {
    scope.$digest();
    expect(scope.companyVoucherItemsList.length).toBe(3);
  });

  it('should attach companyVirtualItemsList to the scope', function() {
    scope.$digest();
    expect(scope.companyVirtualItemsList.length).toBe(3);
  });

  it('should attach companyDiscountsList to the scope', function() {
    scope.$digest();
    expect(scope.companyDiscountsList.voucher.length).toBe(3);
    expect(scope.companyDiscountsList.coupon.length).toBe(3);
  });

  it('should attach companyCashList to the scope', function() {
    scope.$digest();
    expect(scope.companyCashList.length).toBe(4);
  });

  it('should attach companyCreditCardList to the scope', function() {
    scope.$digest();
    expect(scope.companyCreditCardList.length).toBe(2);
  });

});
