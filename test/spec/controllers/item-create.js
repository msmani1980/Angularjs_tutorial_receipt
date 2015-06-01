'use strict';

describe('Item Create Controller |', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var $rootScope, $scope, $controller, $location;

  beforeEach(inject(function(_$rootScope_, _$controller_,$injector){

    $location = $injector.get('$location');

    spyOn($location, 'path').and.returnValue('/item-create');

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    $controller = _$controller_;

    $controller('ItemCreateCtrl', {'$rootScope' : $rootScope, '$scope': $scope});

  }));

  describe('The ItemCreateCtrl', function () {

    it('should be defined', function () {
      expect($scope).toBeDefined();
    });
 
    describe('formData collection', function () {

      it('should be defined', function () {
        expect($scope.formData).toBeDefined();
      });

      it('should have a startDate property', function () {
        expect($scope.formData.startDate).toBeDefined();
      });

      it('should have an endDate property', function () {
        expect($scope.formData.endDate).toBeDefined();
      });

      it('should have an qrCodeValue property', function () {
        expect($scope.formData.qrCodeValue).toBeDefined();
      });

      it('should have a qrCodeImgUrl property', function () {
        expect($scope.formData.qrCodeImgUrl).toBeDefined();
      });

      it('should have an taxes property that is an empty array', function () {
        expect($scope.formData.taxes).toBeDefined();
        expect($scope.formData.taxes).toEqual([]);
      });

      it('should have an tags property that is an empty array', function () {
        expect($scope.formData.tags).toBeDefined();
        expect($scope.formData.tags).toEqual([]);
      });

      it('should have an allergens property that is an empty array', function () {
        expect($scope.formData.allergens).toBeDefined();
        expect($scope.formData.allergens).toEqual([]);
      });

      it('should have an characteristics property that is an empty array', function () {
        expect($scope.formData.characteristics).toBeDefined();
        expect($scope.formData.characteristics).toEqual([]);
      });

      it('should have an substitutions property that is an empty array', function () {
        expect($scope.formData.substitutions).toBeDefined();
        expect($scope.formData.substitutions).toEqual([]);
      });

      it('should have an recommendations property that is an empty array', function () {
        expect($scope.formData.recommendations).toBeDefined();
        expect($scope.formData.recommendations).toEqual([]);
      });
      it('should have an globalTradeNumbers property that is an empty array', function () {
        expect($scope.formData.globalTradeNumbers).toBeDefined();
        expect($scope.formData.globalTradeNumbers).toEqual([]);
      });

      it('should have a prices property that is an array with one price group object inside it', function () {
        expect($scope.formData.prices).toBeDefined();
        expect($scope.formData.prices.length).toBe(1);
      });

    });

  });

});
