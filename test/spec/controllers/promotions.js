'use strict';

describe('Controller: PromotionsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionsCtrl = $controller('PromotionsCtrl', {
      $scope: scope
    });
  }));

  describe('scope functions exist', function(){
    it('should have a scope function promotionCategoryQtyRequired', function(){
      expect(Object.prototype.toString.call(scope.promotionCategoryQtyRequired)).toBe('[object Function]');
    });
    it('should have a scope function addPromotionCategory', function(){
      expect(Object.prototype.toString.call(scope.addPromotionCategory)).toBe('[object Function]');
    });
    it('should have a scope function removePromotionCategoryByIndex', function(){
      expect(Object.prototype.toString.call(scope.removePromotionCategoryByIndex)).toBe('[object Function]');
    });
    it('should have a scope function addRetailItem', function(){
      expect(Object.prototype.toString.call(scope.addRetailItem)).toBe('[object Function]');
    });
    it('should have a scope function removeRetailItemByIndex', function(){
      expect(Object.prototype.toString.call(scope.removeRetailItemByIndex)).toBe('[object Function]');
    });
    it('should have a scope function retailItemQtyRequired', function(){
      expect(Object.prototype.toString.call(scope.retailItemQtyRequired)).toBe('[object Function]');
    });
    it('should have a scope function removeinclusionFilterByIndex', function(){
      expect(Object.prototype.toString.call(scope.removeinclusionFilterByIndex)).toBe('[object Function]');
    });
  });
});
