'use strict';

describe('Item Create Controller |', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var $rootScope, $scope, $controller, $location, ItemCreateCtrl;

  beforeEach(inject(function(_$rootScope_, _$controller_,$injector){

    $location = $injector.get('$location');

    spyOn($location, 'path').and.returnValue('/item-create');

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    $controller = _$controller_;

    ItemCreateCtrl = $controller('ItemCreateCtrl', {'$rootScope' : $rootScope, '$scope': $scope});

  }));

  describe('The ItemCreateCtrl', function () {

    it('should be defined', function () {
      expect(ItemCreateCtrl).toBeDefined();
    });

  });

  describe('The formData collection', function () {

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

  /*
   * Station Exceptions
  */

  describe('The Station Exceptions functionality', function () {

    beforeEach(function() {

      $scope.addStationException(0);

    });

    it('should be have a addStationException method', function () {
      expect($scope.addStationException).toBeDefined();
    });

    it('should be able to add a stationException to the price group', function () {

      expect($scope.formData.prices[0].stationExceptions.length).toBe(1);

      var stationException = $scope.formData.prices[0].stationExceptions[0];

      expect(stationException.startDate).toBeDefined();

      expect(stationException.endDate).toBeDefined();

      expect(stationException.stationExceptionCurrencies).toBeDefined();

      expect(stationException.stationExceptionCurrencies).toEqual([]);

    });

    it('should be have a removeStationException method', function () {
      expect($scope.removeStationException).toBeDefined();
    });

    it('should be able to remove a stationException from the price group', function () {

      expect($scope.formData.prices[0].stationExceptions.length).toBe(1);

      $scope.removeStationException(0);

      expect($scope.formData.prices[0].stationExceptions.length).toBe(0);

    });

    it('should be have a getStationsList method', function () {
      expect(ItemCreateCtrl.getStationsList).toBeDefined();
    });

    it('should be have a setStationsList method', function () {
      expect(ItemCreateCtrl.setStationsList).toBeDefined();
    });

    it('should be have a getStationsCurrenciesList method', function () {
      expect(ItemCreateCtrl.getStationsCurrenciesList).toBeDefined();
    });

    it('should be have a setStationsCurrenciesList method', function () {
      expect(ItemCreateCtrl.setStationsCurrenciesList).toBeDefined();
    });

    it('should be have a generateStationCurrenciesList method', function () {
      expect(ItemCreateCtrl.generateStationCurrenciesList).toBeDefined();
    });

    it('should be have a updateStationException method', function () {
      expect(ItemCreateCtrl.updateStationException).toBeDefined();
    });

    it('should be have a updateStationsList method', function () {
      expect(ItemCreateCtrl.updateStationsList).toBeDefined();
    });

    it('should be have a handleStationPromises method', function () {
      expect(ItemCreateCtrl.handleStationPromises).toBeDefined();
    });


  });

});
