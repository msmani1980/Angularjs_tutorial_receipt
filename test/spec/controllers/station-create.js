'use strict';

describe('The Stations Create/Edit Controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/global-stations.json',
    'served/country-list.json',
    'served/city-list.json',
    'served/station.json',
    'served/stations.json',
    'served/catering-stations.json'
  ));

  var scope;
  var controller;
  var StationCreateCtrl;
  var templateCache;
  var compile;
  var dateUtility;
  var globalStationListJSON;
  var getGlobalStationDefferred;
  var countryListJSON;
  var getCountryListDefferred;
  var cityListJSON;
  var getCityListDefferred;
  var getCatererStationListDeferred;
  var stationListJSON;
  var catererStationListJSON;
  var stationJSON;
  var getStationDeferred;
  var location;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile,$q, $injector,
    _servedGlobalStations_,_servedCountryList_,_servedCityList_,_servedStations_,
    _servedCateringStations_,_servedStation_) {

    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
    dateUtility = $injector.get('dateUtility');
    location = $injector.get('$location');

    globalStationListJSON = _servedGlobalStations_;
    countryListJSON = _servedCountryList_;
    cityListJSON = _servedCityList_;
    stationListJSON = _servedStations_;
    catererStationListJSON = _servedCateringStations_;
    stationJSON = _servedStation_;

    getGlobalStationDefferred = $q.defer();
    getCountryListDefferred = $q.defer();
    getCityListDefferred = $q.defer();
    getCatererStationListDeferred = $q.defer();
    getStationDeferred = $q.defer();


  }));

  function registerSpies() {
    spyOn(StationCreateCtrl, 'getGlobalStationList').and.returnValue(getGlobalStationDefferred.promise);
    spyOn(StationCreateCtrl, 'getCountryList').and.returnValue(getCountryListDefferred.promise);
    spyOn(StationCreateCtrl, 'getCityList').and.returnValue(getCityListDefferred.promise);
    spyOn(StationCreateCtrl, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);
    spyOn(StationCreateCtrl, 'getStation').and.returnValue(getStationDeferred.promise);
    spyOn(StationCreateCtrl,'initSuccessHandler').and.callThrough();
  }

  function createFormObject() {
    scope.stationCreateForm = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'stationCreateForm'
    };
  }

  function initController(id) {
    var params = {};
    if(id){
      params.id = id;
    }
    StationCreateCtrl = controller('StationCreateCtrl', {
      $scope: scope,
      $routeParams: params
    });
    registerSpies();
    createFormObject();
    scope.$digest();
  }

  function resolveInitDependencies() {
    getGlobalStationDefferred.resolve(globalStationListJSON);
    getCountryListDefferred.resolve(countryListJSON);
    getCityListDefferred.resolve(cityListJSON);
    getCatererStationListDeferred.resolve(catererStationListJSON);
    scope.$apply();
  }

  describe('when the controller loads', function() {

    beforeEach(function() {
      location.path('/station-create');
      initController();
      resolveInitDependencies();
    });

    it('should have displayError set to false', function() {
      expect(scope.displayError).toBeFalsy();
    });

    it('should set the global stations list', function() {
      expect(scope.globalStationList).toEqual(globalStationListJSON.response);
    });

    it('should set the country list', function() {
      expect(scope.countryList).toEqual(countryListJSON.countries);
    });

    it('should set the city list', function() {
      expect(scope.cityList).toEqual(cityListJSON.cities);
    });

    it('should set the caterer station list', function() {
      expect(scope.catererStationList).toEqual(catererStationListJSON.response);
    });

  });

  describe('when the user submits the form', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      StationCreateCtrl.setStation(stationJSON);
      spyOn(StationCreateCtrl,'submitForm').and.callThrough();
      spyOn(StationCreateCtrl,'validateForm').and.callThrough();
      spyOn(StationCreateCtrl,'createStation').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(StationCreateCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(StationCreateCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.stationCreateForm.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = StationCreateCtrl.validateForm();
        expect(control).toEqual(scope.stationCreateForm.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        scope.stationCreateForm.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(StationCreateCtrl.createStation).toHaveBeenCalled();
      });

      it('should generate a payload', function() {
        var payload = StationCreateCtrl.generatePayload();
        var payloadControl = {
          stationId: 1,
          cityId: 5,
          countryId: 240
        };
        expect(payload).toEqual(payloadControl);
      });

    });

  });

  describe('the error handler', function () {

    var mockError = {
      status: 400,
      statusText: 'Bad Request',
      response: {
        field: 'bogan',
        code: '000'
      }
    };

    beforeEach(function() {
      initController();
      StationCreateCtrl.errorHandler(mockError);
    });

    it('should set error response ', function () {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function () {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('filter by country', function() {

    var city;

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      city = {
        name:'Boganville',
        countryId: 66
      };
    });

    it('should return true if the search does not exist in the scope', function() {
      var filtered = StationCreateCtrl.filterByCountry(city);
      expect(filtered).toBeTruthy();
    });

    it('should return true if the search does  exist in the scope but there is no country id', function() {
      scope.formData = {
        cityId: 123
      };
      var filtered = StationCreateCtrl.filterByCountry(city);
      expect(filtered).toBeTruthy();
    });

    it('should return false when the search and country id exist but country id does not match up', function() {
      scope.formData = {
        countryId: 15
      };
      var filtered = StationCreateCtrl.filterByCountry(city);
      expect(filtered).toBeFalsy();
    });

  });

  describe('when editing a station record', function() {

    beforeEach(function() {
      location.path('/station-edit/114');
      initController(114);
      resolveInitDependencies();
      getStationDeferred.resolve(stationJSON);
      spyOn(StationCreateCtrl,'setStation');
      scope.$apply();
    });

    it('should set the set the station data',function() {
      expect(StationCreateCtrl.getStation).toHaveBeenCalled();
    });

  });

  describe('when viewing a station record', function() {

    beforeEach(function() {
      location.path('/station-view/114');
      initController(114);
      resolveInitDependencies();
      getStationDeferred.resolve(stationJSON);
      scope.$apply();
    });

  });

  describe('scope assignments', function() {

    beforeEach(function() {
      initController();
      scope.$digest();
      spyOn(StationCreateCtrl,'filterByCountry');
      spyOn(StationCreateCtrl,'addRelationship');
      spyOn(StationCreateCtrl,'setUISelectValidationClass');
    });

    it('should call the filterByCountry method on the controller', function() {
      scope.filterByCountry();
      expect(StationCreateCtrl.filterByCountry).toHaveBeenCalled();
    });

    it('should call the addRelationship method on the controller', function() {
      scope.addRelationship();
      expect(StationCreateCtrl.addRelationship).toHaveBeenCalled();
    });

    it('should call the setUISelectValidationClass method on the controller', function() {
      scope.setUISelectValidationClass();
      expect(StationCreateCtrl.setUISelectValidationClass).toHaveBeenCalled();
    });

    it('should return the view only flag', function() {
      var control = StationCreateCtrl.viewOnly;
      expect(scope.isViewOnly()).toEqual(control);
    });

  });

});
