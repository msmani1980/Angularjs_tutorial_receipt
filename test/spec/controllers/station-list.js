'use strict';

fdescribe('The Stations List Controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/global-stations.json',
    'served/country-list.json',
    'served/city-list.json',
    'served/stations.json'
  ));

  var scope;
  var controller;
  var StationListCtrl;
  var templateCache;
  var compile;
  var dateUtility;
  var globalStationListJSON;
  var getGlobalStationDefferred;
  var countryListJSON;
  var getCountryListDefferred;
  var cityListJSON;
  var getCityListDefferred;
  var getStationListDeferred;
  var stationListJSON;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile,$q, $injector,
    _servedGlobalStations_,_servedCountryList_,_servedCityList_,_servedStations_) {

    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
    dateUtility = $injector.get('dateUtility');

    globalStationListJSON = _servedGlobalStations_;
    countryListJSON = _servedCountryList_;
    cityListJSON = _servedCityList_;
    stationListJSON = _servedStations_;

    getGlobalStationDefferred = $q.defer();
    getCountryListDefferred = $q.defer();
    getCityListDefferred = $q.defer();
    getStationListDeferred = $q.defer();
  }));

  function registerSpies() {
    spyOn(StationListCtrl, 'getGlobalStationList').and.returnValue(getGlobalStationDefferred.promise);
    spyOn(StationListCtrl, 'getCountryList').and.returnValue(getCountryListDefferred.promise);
    spyOn(StationListCtrl, 'getCityList').and.returnValue(getCityListDefferred.promise);
    spyOn(StationListCtrl, 'getStationList').and.callThrough();
  }

  function createFormObject() {
    scope.stationListForm = {
      $valid: false,
      $invalid: false,
      $submitted: false,
      $name:'stationListForm'
    };
  }

  function initController() {
    StationListCtrl = controller('StationListCtrl', {
      $scope: scope
    });
    registerSpies();
    createFormObject();
    scope.$digest();
  }

  function resolveInitDependencies() {
    getGlobalStationDefferred.resolve(globalStationListJSON);
    getCountryListDefferred.resolve(countryListJSON);
    getCityListDefferred.resolve(cityListJSON);
    scope.$apply();
  }

  describe('when the controller loads', function() {

    beforeEach(function() {
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

  });

  describe('when a user gets a list of stations', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      scope.searchRecords();
    });

    it('should set the stations list', function() {
      getStationListDeferred.resolve(stationListJSON);
      scope.$apply();
      var stationListSubset = stationListJSON.response.slice(0,3);
      expect(scope.stationList).toEqual(stationListSubset);
    });

  });

  describe('when the user submits the form', function() {

    beforeEach(function() {
      initController();
      spyOn(StationListCtrl,'submitForm').and.callThrough();
      spyOn(StationListCtrl,'validateForm').and.callThrough();
      spyOn(StationListCtrl,'saveStations').and.callThrough();
      scope.submitForm();
    });

    it('should call the controller method ', function() {
      expect(StationListCtrl.submitForm).toHaveBeenCalled();
    });

    describe('when the the form is validated', function() {

      it('should call the controller method', function() {
        expect(StationListCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError flag', function() {
        expect(scope.displayError).toEqual(scope.stationListForm.$invalid);
      });

      it('should return the form objects valid state', function() {
        var control = StationListCtrl.validateForm();
        expect(control).toEqual(scope.stationListForm.$valid);
      });

    });

    describe('when the the form is valid', function() {

      beforeEach(function() {
        //scope.stationListForm.refundCodeType.$setViewValue(1);
        //scope.stationListForm.refundReason.$setViewValue(1);
        scope.stationListForm.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(StationListCtrl.saveStations).toHaveBeenCalled();
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
      StationListCtrl.errorHandler(mockError);
    });

    it('should set error response ', function () {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function () {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('the date is active functionality', function () {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      spyOn(dateUtility,'isTodayOrEarlier')();
      StationListCtrl.dateActive('11/25/2015');
    });

    it('should set error response ', function () {
      expect(dateUtility.isTodayOrEarlier).toHaveBeenCalled();
    });


  });


});
