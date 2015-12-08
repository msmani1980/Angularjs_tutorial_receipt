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

  function mockGetStations() {
    scope.searchRecords();
    getStationListDeferred.resolve(stationListJSON);
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
      mockGetStations();
    });

    it('should set the stations list', function() {
      var stationListSubset = stationListJSON.response.slice(0,3);
      expect(scope.stationList).toEqual(stationListSubset);
    });

  });

  describe('when the user submits the form', function() {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      mockGetStations();
      scope.selectedStations = [];
      scope.selectedStations[114] = true;
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
        scope.stationListForm.$valid = true;
        scope.submitForm();
      });

      it('should call the create method', function() {
        expect(StationListCtrl.saveStations).toHaveBeenCalled();
      });

      it('should generate a payload', function() {
        var payload = StationListCtrl.generatePayload();
        var mockStation = angular.copy(stationListJSON.response[0]);
        var payloadControl = [mockStation];
        expect(payload).toEqual(payloadControl);
      });

      it('should return an empty payload if there are no selected stations', function() {
        scope.selectedStations = [];
        scope.selectedStations[114] = false;
        var payload = StationListCtrl.generatePayload();
        var payloadControl = [];
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

  describe('the get station object functionality', function () {

    beforeEach(function() {
      initController();
      resolveInitDependencies();
      mockGetStations();
    });

    it('should set error response ', function () {
      var station = StationListCtrl.getStationObject(114);
      expect(station).toEqual(stationListJSON.response[0]);
    });

    describe('the selected stations functionality', function () {

      beforeEach(function() {
        scope.selectedStations = [];
        scope.selectedStations[114] = true;
        scope.selectedStations[115] = false;
        scope.selectedStations[116] = true;
        scope.$digest();
      });

      it('should return an array of selected stations', function () {
        var selectedStations = StationListCtrl.getSelectedStations();
        var selectedStationsControl = [ true,true ];
        expect(selectedStations).toEqual(selectedStationsControl);
      });

      it('should return a station object', function () {
        var station = StationListCtrl.getStationObject(114);
        expect(station).toBeTruthy();
      });

      it('should allow users to save if there is one or more stations selected', function () {
        expect(StationListCtrl.canSave()).toBeTruthy();
      });

      it('should not allow users to save if there are 0 stations selected', function () {
        scope.selectedStations = [];
        expect(StationListCtrl.canSave()).toBeFalsy();
      });

      describe('select / deselect all stations functionality', function() {

        beforeEach(function() {
          spyOn(StationListCtrl,'selectAllStations').and.callThrough();
          spyOn(StationListCtrl,'deselectAllStations').and.callThrough();
        });

        it('should not allow users to save if there are 0 stations selected', function () {
          scope.selectedStations[114] = false;
          scope.selectedStations[115] = false;
          scope.selectedStations[116] = false;
          expect(StationListCtrl.canSave()).toBeFalsy();
        });

        it('should allow users to select all stations', function () {
          StationListCtrl.selectAllStations();
          expect(scope.selectedStations[114]).toBeTruthy();
          expect(scope.selectedStations[115]).toBeTruthy();
          expect(scope.selectedStations[116]).toBeTruthy();
        });

        it('should allow users to deselect all stations', function () {
          StationListCtrl.deselectAllStations();
          expect(scope.selectedStations[114]).toBeFalsy();
          expect(scope.selectedStations[115]).toBeFalsy();
          expect(scope.selectedStations[116]).toBeFalsy();
        });

        it('should deselect all stations when toggleStations is called and all stations are selected', function () {
          StationListCtrl.selectAllStations();
          StationListCtrl.toggleAllStations();
          expect(StationListCtrl.deselectAllStations).toHaveBeenCalled();
        });

        it('should select all stations when toggleStations is called and no stations are selected', function () {
          StationListCtrl.toggleAllStations(true);
          expect(StationListCtrl.selectAllStations).toHaveBeenCalled();
        });

      });

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
      var filtered = StationListCtrl.filterByCountry(city);
      expect(filtered).toBeTruthy();
    });

    it('should return true if the search does  exist in the scope but there is no country id', function() {
      scope.search = {
        cityId: 123
      };
      var filtered = StationListCtrl.filterByCountry(city);
      expect(filtered).toBeTruthy();
    });

    it('should return false when the search and country id exist but country id does not match up', function() {
      scope.search = {
        countryId: 15
      };
      var filtered = StationListCtrl.filterByCountry(city);
      expect(filtered).toBeFalsy();
    });

  });

  describe('performing mass date updates', function () {

    var mockStation;
    var stationToTest;
    beforeEach(function() {
      mockStation = {
        id:114,
        startDate: '03/01/2016',
        endDate: '12/31/2016',
      };
      initController();
      resolveInitDependencies();
      mockGetStations();
      scope.selectedStations = [];
      scope.selectedStations[114] = true;
      scope.formData = {
        stations: [ mockStation ]
      };
      scope.$digest();
      stationToTest = StationListCtrl.getStationInFormData(114);

    });

    it('should get a station from the formData', function () {
      expect(stationToTest).toEqual(mockStation);
    });

    describe('updating the start dates', function() {

      beforeEach(function() {
        scope.dateRange = {
          startDate: '05/01/2016',
        };
        scope.$digest();
      });

      it('should update the start date of each station', function() {
        expect(stationToTest.startDate).toEqual(scope.dateRange.startDate);
      });

      it('should not update the start date  if there are no selected stations', function() {
        scope.selectedStations[114] = false;
        scope.dateRange = {
          startDate: '05/02/2016',
        };
        scope.$digest();
        expect(stationToTest.startDate).not.toEqual(scope.dateRange.startDate);
      });

      it('should not update the start date if the stations date is active', function() {
        stationToTest.startDate = '01/01/2015';
        scope.dateRange = {
          startDate: '05/02/2016',
        };
        scope.$digest();
        expect(stationToTest.startDate).not.toEqual(scope.dateRange.startDate);
      });

    });

    describe('updating the end dates', function() {

      beforeEach(function() {
        scope.dateRange = {
          endDate: '05/01/2016',
        };
        scope.$digest();
      });

      it('should update the end date of each station', function() {
        expect(stationToTest.endDate).toEqual(scope.dateRange.endDate);
      });

      it('should not update the end date  if there are no selected stations', function() {
        scope.selectedStations[114] = false;
        scope.dateRange = {
          endDate: '05/02/2016',
        };
        scope.$digest();
        expect(stationToTest.endDate).not.toEqual(scope.dateRange.endDate);
      });

      it('should not update the endDate date if the stations date is active', function() {
        stationToTest.endDate = '01/01/2015';
        scope.dateRange = {
          endDate: '05/02/2016',
        };
        scope.$digest();
        expect(stationToTest.endDate).not.toEqual(scope.dateRange.endDate);
      });

    });

  });

  describe('scope assignments', function() {

    beforeEach(function() {
      initController();
      scope.$digest();
      spyOn(StationListCtrl,'canSave');
      spyOn(StationListCtrl,'filterByCountry');
      spyOn(StationListCtrl,'dateActive');
    });

    it('should call the canSave method on the controller', function() {
      scope.canSave();
      expect(StationListCtrl.canSave).toHaveBeenCalled();
    });

    it('should call the filterByCountry method on the controller', function() {
      scope.filterByCountry();
      expect(StationListCtrl.filterByCountry).toHaveBeenCalled();
    });

    it('should call the isDateActive method on the controller', function() {
      scope.isDateActive();
      expect(StationListCtrl.dateActive).toHaveBeenCalled();
    });

  });

});
