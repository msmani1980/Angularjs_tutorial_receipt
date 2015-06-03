'use strict';

describe('Item Create Controller |', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  beforeEach(module(
    'served/stations-date-filtered.json',
    'served/station-exception-currencies.json'
  ));

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

  describe('Station Exceptions |', function () {

    var stationsJSON,
      stationException;

    beforeEach(function() {

      $scope.addStationException(0);

    });

    it('should be have a addStationException method', function () {
      expect($scope.addStationException).toBeDefined();
    });

    it('should be able to add a stationException to the price group', function () {

      expect($scope.formData.prices[0].stationExceptions.length).toBe(1);

      stationException = $scope.formData.prices[0].stationExceptions[0];

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

    describe('The ItemCreateCtrl.getStationsList method', function () {

      var response,
        testObject;

      beforeEach(inject(function () {

        inject(function (_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        // spy on the query of the items service
        spyOn(ItemCreateCtrl, 'getStationsList').and.callFake(function () {
          return stationsJSON;
        });

        // make the mock query call
        response = ItemCreateCtrl.getStationsList();

        // grab first item in list
        testObject = response.response[0];

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.getStationsList).toHaveBeenCalled();
      });

      it('should return a response from the API', function () {
        expect(response).toBeDefined();
      });

      it('should return a response from the API containg a response array', function () {
        expect(response.response).toBeDefined();
      });

      it('should return an array of stations containing at least station', function () {
        expect(response.response.length).toBeGreaterThan(0);
      });

      it('should contain a station object with a station code', function () {
        expect(testObject.code).toBeDefined();
        expect(testObject.code).toEqual(jasmine.any(String));
        expect(testObject.code.length).toEqual(3);
      });

      it('should contain a station object with a station id', function () {
        expect(testObject.id).toBeDefined();
        expect(testObject.id ).toEqual(jasmine.any(Number));
      });

      it('should contain a station object with a company id', function () {
        expect(testObject.companyId).toBeDefined();
        expect(testObject.companyId ).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a setStationsList method', function () {
      expect(ItemCreateCtrl.setStationsList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsList method', function () {

      var station;

      beforeEach(inject(function () {

        $scope.addStationException(0);

        inject(function (_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        spyOn(ItemCreateCtrl, 'setStationsList').and.callThrough();

        stationException = $scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.setStationsList(stationException,stationsJSON);

        station = stationException.stations[0];

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.setStationsList).toHaveBeenCalled();
      });

      it('should have a stations collection', function () {
        expect(stationException.stations).toBeDefined();
        expect(stationException.stations.length).toBeGreaterThan(0);
      });


      it('should contain a station object with a station code', function () {
        expect(station.code).toBeDefined();
        expect(station.code).toEqual(jasmine.any(String));
        expect(station.code.length).toEqual(3);
      });

      it('should contain a station object with a station id', function () {
        expect(station.id).toBeDefined();
        expect(station.id ).toEqual(jasmine.any(Number));
      });

      it('should contain a station object with a company id', function () {
        expect(station.companyId).toBeDefined();
        expect(station.companyId ).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a getStationsCurrenciesList method', function () {
      expect(ItemCreateCtrl.getStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.getStationsCurrenciesList method', function () {

      var stationExceptionCurrenciesJSON,
        response,
        testObject;

      beforeEach(inject(function () {

        inject(function (_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        // spy on the query of the items service
        spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and.callFake(function () {
          return stationExceptionCurrenciesJSON;
        });

        // make the mock query call
        response = ItemCreateCtrl.getStationsCurrenciesList();

        // grab first item in list
        testObject = response.response[0];

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.getStationsCurrenciesList).toHaveBeenCalled();
      });

      it('should return a response from the API', function () {
        expect(response).toBeDefined();
      });

      it('should return a response from the API containg a response array', function () {
        expect(response.response).toBeDefined();
      });

      it('should return an array of stations currencies containing at least station currency', function () {
        expect(response.response.length).toBeGreaterThan(0);
      });

      it('should contain a station currency object with a station code', function () {
        expect(testObject.code).toBeDefined();
        expect(testObject.code).toEqual(jasmine.any(String));
        expect(testObject.code.length).toEqual(3);
      });

      it('should contain a station currency object with a station id', function () {
        expect(testObject.id).toBeDefined();
        expect(testObject.id ).toEqual(jasmine.any(Number));
      });

      it('should contain a station currency object with a company id', function () {
        expect(testObject.companyId).toBeDefined();
        expect(testObject.companyId ).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a setStationsCurrenciesList method', function () {
      expect(ItemCreateCtrl.setStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsCurrenciesList method', function () {

      var stationExceptionCurrenciesJSON;

      beforeEach(inject(function () {

        $scope.addStationException(0);

        inject(function (_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        spyOn(ItemCreateCtrl, 'setStationsCurrenciesList').and.callThrough();

        stationException = $scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.setStationsCurrenciesList(stationException,stationExceptionCurrenciesJSON);

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.setStationsCurrenciesList).toHaveBeenCalled();
      });

      it('should have a stationExceptionCurrencies collection', function () {
        expect(stationException.stationExceptionCurrencies).toBeDefined();
        expect(stationException.stationExceptionCurrencies.length).toBeGreaterThan(0);
      });

    });

    it('should be have a generateStationCurrenciesList method', function () {
      expect(ItemCreateCtrl.generateStationCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.generateStationCurrenciesList method', function () {

      var stationExceptionCurrency,
      stationExceptionCurrenciesJSON,
      stationExceptionCurrenciesList;

      beforeEach(inject(function () {

        $scope.addStationException(0);

        inject(function (_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        spyOn(ItemCreateCtrl, 'generateStationCurrenciesList').and.callThrough();

        stationException = $scope.formData.prices[0].stationExceptions[0];

        stationExceptionCurrenciesList = ItemCreateCtrl.generateStationCurrenciesList(stationExceptionCurrenciesJSON);

        stationExceptionCurrency = stationExceptionCurrenciesList[0];

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.generateStationCurrenciesList).toHaveBeenCalled();
      });

      it('should generate a stationExceptionCurrencies collection', function () {
        expect(stationExceptionCurrenciesList).toBeDefined();
        expect(stationExceptionCurrenciesList.length).toBeGreaterThan(0);
      });


      it('should contain a stationExceptionCurrency object with a currency code', function () {
        expect(stationExceptionCurrency.price).toBeDefined();
        expect(stationExceptionCurrency.price).toEqual('1.00');
      });

      it('should contain a stationExceptionCurrency object with a companyCurrencyId', function () {
        expect(stationExceptionCurrency.companyCurrencyId).toBeDefined();
        expect(stationExceptionCurrency.companyCurrencyId ).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a updateStationException method', function () {
      expect(ItemCreateCtrl.updateStationException).toBeDefined();
    });

    describe('The ItemCreateCtrl.updateStationException method', function () {

      beforeEach(inject(function () {

        $scope.addStationException(0);

        spyOn(ItemCreateCtrl, 'getStationsList').and.callThrough();

        spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and.callThrough();

        spyOn(ItemCreateCtrl, 'updateStationException').and.callThrough();

        stationException = $scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.updateStationException(0,0);

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.updateStationException).toHaveBeenCalled();
      });

      it('should have called getStationsList', function () {
        expect(ItemCreateCtrl.getStationsList).toHaveBeenCalled();
      });

      it('should have called getStationsCurrenciesList', function () {
        expect(ItemCreateCtrl.getStationsCurrenciesList).toHaveBeenCalled();
      });

    });

    it('should be have a updateStationsList method', function () {
      expect(ItemCreateCtrl.updateStationsList).toBeDefined();
    });

    // TODO: Finish the handleStationPromises test cases
    it('should be have a handleStationPromises method', function () {
      expect(ItemCreateCtrl.handleStationPromises).toBeDefined();
    });

    /*describe('The ItemCreateCtrl.handleStationPromises method', function () {

      var $q,
        stationException1,
        stationException2;

      beforeEach(inject(function ($injector) {

        $scope.addStationException(0);
        $scope.addStationException(0);

        inject(function (_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        $q = $injector.get('$q');

        var stationPromise1 = jasmine.createSpyObj('stationPromise1', ['getStationsList']);
        var stationPromise2 = jasmine.createSpyObj('stationPromise2', ['getStationsList']);

        stationPromise1.getStationsList.and.returnValue($q.when(stationsJSON));
        stationPromise2.getStationsList.and.returnValue($q.when(stationsJSON));

        spyOn(ItemCreateCtrl, 'handleStationPromises').and.callThrough();

        stationException1 = $scope.formData.prices[0].stationExceptions[0];
        stationException2 = $scope.formData.prices[0].stationExceptions[1];

        ItemCreateCtrl.handleStationPromises(0,0);

      }));

      it('should have been called', function () {
        expect(ItemCreateCtrl.handleStationPromises).toHaveBeenCalled();
      });

      it('should have been called', function () {
        expect(stationException1.stations).toBeDefined();
      });

    });*/

  });

});
