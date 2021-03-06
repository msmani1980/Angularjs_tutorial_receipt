'use strict';

describe('Controller: PostTripDataCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/carrier-numbers.json'));
  beforeEach(module('served/post-trip-data.json'));
  beforeEach(module('served/employees.json'));
  beforeEach(module('served/schedules.json'));

  var PostTripDataCtrl;
  var scope;
  var stationsListResponseJSON;
  var stationsListDeferred;
  var carrierNumbersResponseJSON;
  var carrierNumbersDeferred;
  var postTripResponseJSON;
  var postTripDeferred;
  var newPostTripDeferred;
  var employeesDeferred;
  var employeesResponseJSON;
  var schedulesDeferred;
  var schedulesResponseJSON;
  var searchPostTripDeferred;
  var postTripFactory;
  var companyId;

  function createFormObject() {
    scope.postTripDataForm = {
      $name: 'postTripDataForm',
      $valid: false,
      $invalid: false,
      $submitted: false,
      $setSubmitted: function(submitted) {
        this.$submitted = submitted;
      },

      employeeIds: {
        $name: 'employeeIds',
        $invalid: false,
        $valid: true,
        $viewValue: '',
        $error: [],
        $setViewValue: function(value) {
          this.$viewValue = value;
        },

        $setValidity: function(key, value) {
          this.$error[key] = value;
        }
      }
    };
  }

  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    inject(function(_servedStations_, _servedCarrierNumbers_, _servedPostTripData_,
      _servedEmployees_, _servedSchedules_) {
      stationsListResponseJSON = _servedStations_;
      carrierNumbersResponseJSON = _servedCarrierNumbers_;
      postTripResponseJSON = _servedPostTripData_;
      employeesResponseJSON = _servedEmployees_;
      schedulesResponseJSON = _servedSchedules_;
    });

    postTripFactory = $injector.get('postTripFactory');
    scope = $rootScope.$new();

    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsListResponseJSON);
    carrierNumbersDeferred = $q.defer();
    carrierNumbersDeferred.resolve(carrierNumbersResponseJSON);
    postTripDeferred = $q.defer();
    postTripDeferred.resolve(postTripResponseJSON);
    newPostTripDeferred = $q.defer();
    newPostTripDeferred.resolve({
      id: 1
    });
    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesResponseJSON);
    searchPostTripDeferred = $q.defer();
    searchPostTripDeferred.resolve({
      postTrips: []
    });
    schedulesDeferred = $q.defer();
    schedulesDeferred.resolve(schedulesResponseJSON);

    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(postTripFactory, 'getCarrierNumbers').and.returnValue(carrierNumbersDeferred.promise);
    spyOn(postTripFactory, 'createPostTrip').and.returnValue(newPostTripDeferred.promise);
    spyOn(postTripFactory, 'updatePostTrip').and.returnValue(postTripDeferred.promise);
    spyOn(postTripFactory, 'getPostTrip').and.returnValue(postTripDeferred.promise);
    spyOn(postTripFactory, 'getEmployees').and.returnValue(employeesDeferred.promise);
    spyOn(postTripFactory, 'getSchedules').and.returnValue(schedulesDeferred.promise);
    spyOn(postTripFactory, 'getPostTripDataList').and.returnValue(searchPostTripDeferred.promise);

    companyId = '403';
    PostTripDataCtrl = $controller('PostFlightDataCtrl', {
      $scope: scope,
      companyId: companyId
    });

    createFormObject();

  }));

  describe('global functions and API calls', function() {
    var routeParams = {
      state: 'view'
    };
    beforeEach(inject(function($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('constructor API calls', function() {
      it('should call getStationList', function() {
        expect(postTripFactory.getStationList).toHaveBeenCalled();
        expect(scope.stationList).toBeDefined();
      });

      it('should remove duplicatesFromStationList', function() {
        var responseLength = stationsListResponseJSON.response.length;
        expect(responseLength > scope.stationList.length).toEqual(true);
      });

      it('should get all carrier numbers for every carrierType', function() {
        var companyId = postTripFactory.getCompanyId();
        expect(postTripFactory.getCarrierNumbers).toHaveBeenCalledWith(companyId);
      });

      it('should call getSchedules', function() {
        expect(postTripFactory.getSchedules).toHaveBeenCalled();
        expect(scope.schedules).toBeDefined();
      });
    });

    describe('searchEmployees', function() {
      it('should call getEmployees if search string exists', function() {
        var select = {
          search: 'something'
        };

        scope.searchEmployees(select);
        expect(postTripFactory.getEmployees).toHaveBeenCalled();
      });

      it('should not call getEmployees if search string is empty', function() {
        var select = {
          search: ''
        };

        scope.searchEmployees(select);
        expect(postTripFactory.getEmployees).not.toHaveBeenCalled();
      });

      it('should attach employee array to scope', function() {
        expect(scope.employees).toBeDefined();
        expect(Object.prototype.toString.call(scope.employees)).toBe('[object Array]');
      });
    });

    describe('timezone helper functions', function() {
      var timeZoneString = 'Europe/Madrid';
      var utcArrOffset = '+1';
      var utcDepOffset = '+2';
      beforeEach(function() {
        scope.stationList = [{
          stationId: 1,
          timezone: timeZoneString,
          utcOffset: utcArrOffset,
        }, {
          stationId: 2,
          timezone: timeZoneString,
          utcOffset: utcDepOffset
        }];
        scope.postTrip = {
          arrStationId: 1,
          depStationId: 2
        };
      });

      it('should populate and format departureTimezone', function() {
        scope.updateDepartureTimeZone();
        expect(scope.departureTimezone).toBeDefined();
        expect(scope.departureTimezone).toEqual('Europe/Madrid [UTC +2]');
      });

      it('should populate and format arrivalTimeZone', function() {
        scope.updateArrivalTimeZone();
        expect(scope.arrivalTimezone).toBeDefined();
        expect(scope.arrivalTimezone).toEqual('Europe/Madrid [UTC +1]');
      });

      it('should return empty string if stationId is not valid', function() {
        scope.postTrip = {
          arrStationId: 3,
          depStationId: 4
        };
        scope.updateDepartureTimeZone();
        expect(scope.departureTimezone).toEqual('');
        scope.updateArrivalTimeZone();
        expect(scope.arrivalTimezone).toEqual('');
      });
    });

    describe('form save helper function', function() {
      it('should format employeeIdentifiers into array of employee objects', function() {
        scope.postTripDataForm.$valid = true;
        scope.selectedEmployees = {
          employeeIds: [{
            id: 62,
            name: 'employee1'
          }, {
            id: 63,
            name: 'employee2'
          }]
        };
        scope.postTrip = {};
        scope.formSave();
        var expectedObject = [{
          employeeId: 62
        }, {
          employeeId: 63
        }];
        expect(Object.prototype.toString.call(scope.postTrip.postTripEmployeeIdentifiers)).toBe(
          '[object Array]');
        expect(scope.postTrip.postTripEmployeeIdentifiers).toEqual(expectedObject);
      });

      it('should immediately return is form is invalid', function() {
        scope.postTripDataForm.$valid = false;
        scope.postTrip = {};
        scope.formSave();
        expect(scope.postTrip.postTripEmployeeIdentifiers).not.toBeDefined();
      });
    });
  });

  describe('update controller action', function() {
    var routeParams = {
      state: 'edit',
      id: '1'
    };
    beforeEach(inject(function($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to false', function() {
      expect(scope.readOnly).toEqual(false);
    });

    it('should set view name', function() {
      expect(scope.viewName).toEqual('Edit Post Trip Data');
    });

    it('should call getPostTrip', function() {
      expect(postTripFactory.getPostTrip).toHaveBeenCalled();
      expect(scope.postTrip).toBeDefined();
    });

    describe('save form', function() {
      it('should call updatePostTrip', function() {
        scope.postTripDataForm.$valid = true;
        scope.employees = [];
        scope.formSave();
        expect(postTripFactory.updatePostTrip).toHaveBeenCalled();
      });
    });
  });

  describe('create controller action', function() {
    var routeParams = {
      state: 'create'
    };
    beforeEach(inject(function($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to false', function() {
      expect(scope.readOnly).toEqual(false);
    });

    it('should set view name', function() {
      expect(scope.viewName).toEqual('Create Post Trip Data');
    });

    it('should make form invalid on empty employee list', function() {
      scope.selectedEmployees.employeeIds = [];

      PostTripDataCtrl.validateEmployees();

      expect(scope.postTripDataForm.$valid).toEqual(false);
    });

    it('should add new entry to schedule number if it does not exist', function() {
      scope.slicedSchedules = [ 1, 2, 3 ];

      var newSlicedSchedules = scope.getScheduleNumbers(4);

      expect(newSlicedSchedules).toEqual([1, 2, 3, 4]);
    });

    describe('save form', function() {
      it('should call getPostTripDataList to search for duplicates', function() {
        scope.postTripDataForm.$valid = true;
        scope.employees = [];
        scope.postTrip = {};
        scope.formSave();
        expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
      });
    });
  });

  describe('read controller action', function() {
    var routeParams = {
      state: 'view',
      id: 1
    };
    beforeEach(inject(function($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to true', function() {
      expect(scope.readOnly).toEqual(true);
    });

    it('should set view name', function() {
      expect(scope.viewName).toEqual('View Post Trip Data');
    });

    it('should call getPostTrip', function() {
      expect(postTripFactory.getPostTrip).toHaveBeenCalled();
      expect(scope.postTrip).toBeDefined();
    });
  });

  describe('the error handler', function() {

    var mockError;

    beforeEach(function() {
      mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'bogan',
          code: '000'
        }
      };
      PostTripDataCtrl.saveFormFailure(mockError);
    });

    it('should set error data ', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should display the error', function() {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('getStationById function', function() {
    beforeEach(function() {
      scope.stationList = [{
        stationId: 1,
        stationCode: 'ORD'
      }, {
          stationId: 2,
          stationCode: 'LGW'
      }, {
        stationId: 3,
        stationCode: 'IAD'
      }];

    });

    it('should populate stationCode', function() {
      var stationCode = PostTripDataCtrl.getStationById(1);
      expect(stationCode).toEqual('ORD');
    });

    it('should populate stationCode', function() {
      var stationCode = PostTripDataCtrl.getStationById(3);
      expect(stationCode).toEqual('IAD');
    });

  });

});
