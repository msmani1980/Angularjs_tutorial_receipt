'use strict';

describe('Controller: EmployeeMessageListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/employee-messages.json'));
  beforeEach(module('served/employees.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/global-stations.json'));

  var EmployeeMessageListCtrl;
  var employeeMessagesFactory;
  var location;
  var controller;
  var scope;

  var employeeMessageDeferred;
  var employeeMessagesJSON;
  var employeesDeferred;
  var employeesJSON;
  var schedulesDeferred;
  var schedulesJSON;
  var stationsDeferred;
  var stationsJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedEmployees_, _servedSchedules_, _servedGlobalStations_, _servedEmployeeMessages_) {
      employeeMessagesJSON = _servedEmployeeMessages_;
      employeesJSON = _servedEmployees_;
      schedulesJSON = _servedSchedules_;
      stationsJSON = _servedGlobalStations_;
    });

    location = $location;
    scope = $rootScope.$new();
    employeeMessagesFactory = $injector.get('employeeMessagesFactory');
    controller = $controller;

    employeeMessageDeferred = $q.defer();
    employeeMessageDeferred.resolve(employeeMessagesJSON);

    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesJSON);

    schedulesDeferred = $q.defer();
    schedulesDeferred.resolve(schedulesJSON);

    stationsDeferred = $q.defer();
    stationsDeferred.resolve(stationsJSON);

    spyOn(employeeMessagesFactory, 'getEmployeeMessages').and.returnValue(employeeMessageDeferred.promise);
    spyOn(employeeMessagesFactory, 'getSchedules').and.returnValue(schedulesDeferred.promise);
    spyOn(employeeMessagesFactory, 'getEmployees').and.returnValue(employeesDeferred.promise);
    spyOn(employeeMessagesFactory, 'getStations').and.returnValue(stationsDeferred.promise);
    spyOn(location, 'path').and.callThrough();


    EmployeeMessageListCtrl = $controller('EmployeeMessageListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should set viewName', function () {
      expect(scope.viewName).toBeDefined();
    });

    it('should get employeeMessages with no payload', function () {
      expect(employeeMessagesFactory.getEmployeeMessages).toHaveBeenCalledWith({});
    });

    it('should attach employeeMessages to scope', function () {
      expect(scope.employeeMessagesList).toBeDefined();
      expect(scope.employeeMessagesList.length > 0).toEqual(true);
    });

    it('should format start and end dates', function () {
      expect(scope.employeeMessagesList[0].startDate).toEqual('06/01/2015');
      expect(scope.employeeMessagesList[0].endDate).toEqual('06/30/2015');
    });
  });

  describe('scope helpers', function () {
    describe('goToDetailPage', function () {
      it('should redirect to employee-message page', function () {
        scope.goToDetailPage('view', 1);
        expect(location.path).toHaveBeenCalledWith('employee-message/view/1');
      });
    });

    describe('isActiveOrFutureRecord', function () {
      it('should return false for past records', function () {
        var mockPastRecord = {startDate: '10/20/2000', endDate: '10/30/2000'};
        expect(scope.isActiveOrFutureRecord(mockPastRecord)).toEqual(false);
      });
      it('should return true for active records', function () {
        var mockActiveRecord = {startDate: '10/20/2010', endDate: '10/30/3000'};
        expect(scope.isActiveOrFutureRecord(mockActiveRecord)).toEqual(true);
      });
      it('should return true for future records', function () {
        var mockFutureRecord = {startDate: '10/20/3000', endDate: '10/30/3000'};
        expect(scope.isActiveOrFutureRecord(mockFutureRecord)).toEqual(true);
      });
    });
  });
});
