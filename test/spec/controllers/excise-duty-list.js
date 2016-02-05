'use strict';

describe('Controller: ExciseDutyListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/excise-duty-list.json'));
  beforeEach(module('served/country-list.json'));
  beforeEach(module('served/units-volume.json'));

  var ExciseDutyListCtrl;
  var exciseDutyFactory;
  var exciseDutyResponseJSON;
  var exciseDutyDeferred;
  var countryListResponseJSON;
  var countryListDeferred;
  var volumeListResponseJSON;
  var volumeListDeferred;
  var location;
  var dateUtility;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedExciseDutyList_, _servedCountryList_, _servedUnitsVolume_) {
      exciseDutyResponseJSON = _servedExciseDutyList_;
      countryListResponseJSON = _servedCountryList_;
      volumeListResponseJSON = _servedUnitsVolume_;
    });

    location = $location;
    exciseDutyFactory = $injector.get('exciseDutyFactory');
    dateUtility = $injector.get('dateUtility');
    scope = $rootScope.$new();

    exciseDutyDeferred = $q.defer();
    exciseDutyDeferred.resolve(exciseDutyResponseJSON);
    countryListDeferred = $q.defer();
    countryListDeferred.resolve(countryListResponseJSON);
    volumeListDeferred = $q.defer();
    volumeListDeferred.resolve(volumeListResponseJSON);

    spyOn(exciseDutyFactory, 'getExciseDutyList').and.returnValue(exciseDutyDeferred.promise);
    spyOn(exciseDutyFactory, 'getCountriesList').and.returnValue(countryListDeferred.promise);
    spyOn(exciseDutyFactory, 'getVolumeUnits').and.returnValue(volumeListDeferred.promise);
    spyOn(location, 'path').and.callThrough();


    ExciseDutyListCtrl = $controller('ExciseDutyListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('initialize data', function () {
    it('should get list of companies and attach to scope', function () {
      expect(exciseDutyFactory.getCountriesList).toHaveBeenCalled();
      expect(scope.countryList).toBeDefined();
    });

    it('should get list of volume units and attach to scope', function () {
      expect(exciseDutyFactory.getVolumeUnits).toHaveBeenCalled();
      expect(scope.volumeUnits).toBeDefined();
    });
  });

  describe('get exciseDutyList', function () {
    beforeEach(function () {
      scope.getExciseDutyList();
      scope.$digest();
    });
    it('should get data from API and attach to scope', function () {
      expect(exciseDutyFactory.getExciseDutyList).toHaveBeenCalled();
      expect(scope.exciseDutyList).toBeDefined();
    });

    it('should format start and end date', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].startDate)).toEqual(true);
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].endDate)).toEqual(true);
    });

    it('should resolve countryName', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].countryName)).toBeDefined();
    });

    it('should resolve volume unit name', function () {
      expect(dateUtility.isDateValidForApp(scope.exciseDutyList[0].volumeUnit)).toBeDefined();
    });
  });

  describe('search exciseDutyList', function () {
    it('should get data from API with search payload', function () {

    });
  });

  describe('delete excise duty record', function () {
    it('should call delete from API', function () {

    });

    it('should remove deleted records from excise duty list', function () {

    });
  });

});
