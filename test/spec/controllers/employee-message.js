'use strict';

fdescribe('Controller: EmployeeMessageCtrl', function () {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/employee-message.json'));
  beforeEach(module('served/employees.json'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/global-stations.json'));

  var EmployeeMessageCtrl;
  var location;
  var scope;
  var controller;
  var employeeMessagesFactory;

  var employeeMessageDeferred;
  var employeeMesssageJSON;
  var employeesDeferred;
  var employeesJSON;
  var schedulesDeferred;
  var schedulesJSON;
  var stationsDeferred;
  var stationsJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    inject(function (_servedEmployees_, _servedSchedules_, _servedGlobalStations_, _servedEmployeeMessage_) {
      employeeMesssageJSON = _servedEmployeeMessage_;
      employeesJSON = _servedEmployees_;
      schedulesJSON = _servedSchedules_;
      stationsJSON = _servedGlobalStations_;
    });
    location = $location;
    scope = $rootScope.$new();
    employeeMessagesFactory = $injector.get('employeeMessagesFactory');
    controller = $controller;

    employeeMessageDeferred = $q.defer();
    employeeMessageDeferred.resolve(employeeMesssageJSON);

    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesJSON);

    schedulesDeferred = $q.defer();
    schedulesDeferred.resolve(schedulesJSON);

    stationsDeferred = $q.defer();
    stationsDeferred.resolve(stationsJSON);

    spyOn(employeeMessagesFactory, 'getEmployeeMessage').and.returnValue(employeeMessageDeferred.promise);
    spyOn(employeeMessagesFactory, 'createEmployeeMessage').and.returnValue(employeeMessageDeferred.promise);
    spyOn(employeeMessagesFactory, 'editEmployeeMessage').and.returnValue(employeeMessageDeferred.promise);
    spyOn(employeeMessagesFactory, 'getSchedules').and.returnValue(schedulesDeferred.promise);
    spyOn(employeeMessagesFactory, 'getEmployees').and.returnValue(employeesDeferred.promise);
    spyOn(employeeMessagesFactory, 'getStations').and.returnValue(stationsDeferred.promise);
    spyOn(location, 'path').and.callThrough();
  }));

  function initController(action, id) {
    EmployeeMessageCtrl = controller('EmployeeMessageCtrl', {
      $scope: scope,
      $routeParams: {
        id: (id ? id : ''),
        action: ( action ? action : 'create')
      }
    });
    scope.employeeMessageForm = {$invalid: false};
  }

  describe('scope variables and functions', function () {
    beforeEach(function () {
      initController();
      scope.$digest();
    });
    it('should have view name defined', function () {
      expect(scope.viewName).toBeDefined();
    });
    it('should have readOnly be defined', function () {
      expect(scope.readOnly).toBeDefined();
    });
    it('should have newRecords be defined', function () {
      expect(scope.newRecords).toBeDefined();
    });
  });

  describe('init', function () {
    describe('API Calls', function () {
      describe('common init calls', function () {
        beforeEach(function () {
          initController();
          scope.$digest();
        });
        it('should get a list of employees', function () {
          expect(employeeMessagesFactory.getEmployees).toHaveBeenCalled();
          scope.$digest();
          expect(scope.employeesList).toEqual(employeesJSON.companyEmployees);
        });
        it('should get a list of schedules', function () {
          expect(employeeMessagesFactory.getSchedules).toHaveBeenCalled();
          scope.$digest();
          expect(scope.schedulesList).toEqual(schedulesJSON.distinctSchedules);
        });
        it('should get a list of stations', function () {
          expect(employeeMessagesFactory.getStations).toHaveBeenCalled();
          scope.$digest();
          expect(scope.stationsList).toEqual(stationsJSON.response);
        });
      });

      describe('create init', function () {
        beforeEach(function () {
          initController('create');
          scope.$digest();
        });

        it('should set readOnly to false', function () {
          expect(scope.readOnly).toEqual(false);
        });
        it('should init employeeMessage to empty', function () {
          var emptyEmployeeMessage = {employees: [], schedules: [], arrivalStations: [], departureStations: []};
          expect(scope.employeeMessage).toEqual(emptyEmployeeMessage);
        });
        it('should set viewName to Creating', function () {
          expect(scope.viewName).toEqual('Create New Employee Message');
        });
      });

      describe('edit init', function () {
        beforeEach(function () {
          initController('edit', 1);
          employeeMessageDeferred.resolve(employeeMesssageJSON);
          scope.$digest();
        });
        it('should set readOnly to false', function () {
          expect(scope.readOnly).toEqual(false);
        });
        it('should set viewName to Editing', function () {
          expect(scope.viewName).toEqual('Edit Employee Message 1');
        });
        it('should call getEmployeeMessage with routeParams id', function () {
          expect(employeeMessagesFactory.getEmployeeMessage).toHaveBeenCalledWith(1);
        });
        it('should attach employeeMessage to scope', function () {
          var emptyEmployeeMessage = {employees: [], schedules: [], arrivalStations: [], departureStations: []};
          expect(scope.employeeMessage).toBeDefined();
          expect(scope.employeeMessage).not.toEqual(emptyEmployeeMessage);
        });
      });

      describe('view init', function () {
        beforeEach(function () {
          initController('view', 1);
          employeeMessageDeferred.resolve(employeeMesssageJSON);
          scope.$digest();
        });

        it('should set readOnly to true', function () {
          expect(scope.readOnly).toEqual(true);
        });
        it('should set viewName to Editing', function () {
          expect(scope.viewName).toEqual('View Employee Message 1');
        });
        it('should call getEmployeeMessage with routeParams id', function () {
          expect(employeeMessagesFactory.getEmployeeMessage).toHaveBeenCalledWith(1);
        });
        it('should attach employeeMessage to scope', function () {
          var emptyEmployeeMessage = {employees: [], schedules: [], arrivalStations: [], departureStations: []};
          expect(scope.employeeMessage).toBeDefined();
          expect(scope.employeeMessage).not.toEqual(emptyEmployeeMessage);
        });
      });
    });

    describe('reformat employeeMessage for app', function () {
      var mockEmployeeMessage;
      var formattedEmployeeMessage;
      beforeEach(function () {
        initController();
        mockEmployeeMessage = {
          employeeMessage: {
            id: 123,
            startDate: '2015-10-20',
            endDate: '2015-10-25',
            employeeMessageText: 'mock message',
            employeeMessageEmployeeIdentifiers: [{id: 1, employeeIdentifier: '1001'}],
            employeeMessageSchedules: [{id: 2, scheduleNumber: '106'}],
            employeeMessageArrivalStations: [1],
            employeeMessageDepartureStations: [2]
          }
        };
        scope.$digest();
        formattedEmployeeMessage = EmployeeMessageCtrl.formatEmployeeMessageForApp(mockEmployeeMessage);
      });

      it('should maintain employeeMessage startDate, endDate, and messageText', function () {
        expect(formattedEmployeeMessage).not.toEqual(mockEmployeeMessage);
        expect(formattedEmployeeMessage).toBeDefined();
        expect(formattedEmployeeMessage.startDate).toEqual('10/20/2015');
        expect(formattedEmployeeMessage.endDate).toEqual('10/25/2015');
        expect(formattedEmployeeMessage.messageText).toEqual(mockEmployeeMessage.messageText);
      });
      it('should store employees as an object with employeeIdentifier, firstName, lastName', function () {
        expect(formattedEmployeeMessage.employees).toBeDefined();
        expect(formattedEmployeeMessage.employees.length).toEqual(1);
        expect(formattedEmployeeMessage.employees[0].employeeIdentifier).toEqual('1001');
        expect(formattedEmployeeMessage.employees[0].firstName).toEqual('John');
        expect(formattedEmployeeMessage.employees[0].lastName).toEqual('Doe');
      });
      it('should store schedules as an object with scheduleNumber', function () {
        expect(formattedEmployeeMessage.schedules).toBeDefined();
        expect(formattedEmployeeMessage.schedules.length).toEqual(1);
        expect(formattedEmployeeMessage.schedules[0].scheduleNumber).toEqual('106');
      });
      it('should store arrival stations as an object with stationId, code, and name', function () {
        expect(formattedEmployeeMessage.arrivalStations).toBeDefined();
        expect(formattedEmployeeMessage.arrivalStations.length).toEqual(1);
        expect(formattedEmployeeMessage.arrivalStations[0].id).toEqual(1);
        expect(formattedEmployeeMessage.arrivalStations[0].code).toEqual('ORD');
        expect(formattedEmployeeMessage.arrivalStations[0].name).toEqual('Chicago O-hare');
      });
      it('should store departure stations as an object with stationId, code, and name', function () {
        expect(formattedEmployeeMessage.departureStations).toBeDefined();
        expect(formattedEmployeeMessage.departureStations.length).toEqual(1);
        expect(formattedEmployeeMessage.departureStations[0].id).toEqual(2);
        expect(formattedEmployeeMessage.departureStations[0].code).toEqual('MDW');
        expect(formattedEmployeeMessage.departureStations[0].name).toEqual('Chicago Midway');
      });
    });
  });

  describe('edit arrays', function () {
    describe('add items', function () {

    });

    describe('bulk delete items', function () {

    });
  });

  describe('save', function () {
    describe('format payload for app', function () {

    });
    describe('save new message', function () {

    });
    describe('update message', function () {

    });
  });


  //describe('saveData', function () {
  //  describe('payload', function () {
  //    beforeEach(function () {
  //      initController('view', 1);
  //      scope.$digest();
  //    });
  //
  //    it('should format date to YYYMMDD format', function () {
  //      scope.commissionData = {
  //        startDate: '10/20/2015',
  //        endDate: '10/21/2015',
  //      };
  //      var expectedPayload = {
  //        startDate: '20151020',
  //        endDate: '20151021',
  //        commissionPercentage: null
  //
  //      };
  //      var payload = CommissionDataCtrl.createPayload();
  //      expect(payload).toEqual(expectedPayload);
  //    });
  //  });
  //
  //  describe('create Data', function () {
  //    beforeEach(function () {
  //      initController('create');
  //      scope.$digest();
  //      scope.commissionData = {
  //        startDate: '10/20/2015',
  //        endDate: '10/21/2015'
  //      };
  //      scope.saveData();
  //    });
  //
  //    it('should call createCommissionData with payload', function () {
  //      commissionDataDeferred.resolve(commissionDataResponseJSON);
  //      var payload = CommissionDataCtrl.createPayload();
  //      expect(commissionFactory.createCommissionData).toHaveBeenCalledWith(payload);
  //    });
  //
  //    it('should redirect to commission data table', function () {
  //      commissionDataDeferred.resolve(commissionDataResponseJSON);
  //      CommissionDataCtrl.createSuccess();
  //      expect(location.path).toHaveBeenCalledWith('commission-data-table');
  //    });
  //
  //    it('should show errors if there is a promise that fails', function () {
  //      commissionDataDeferred.reject({status:400,statusText:'Bad Request'});
  //      scope.$apply();
  //      expect(scope.displayError).toBeTruthy();
  //    });
  //
  //    it('should set the error response in controller', function () {
  //      commissionDataDeferred.reject({status:400,statusText:'Bad Request'});
  //      scope.$apply();
  //      expect(scope.errorResponse).toEqual({status:400,statusText:'Bad Request'});
  //    });
  //  });
  //
  //  describe('edit data', function () {
  //    beforeEach(function () {
  //      initController('edit', 1);
  //      scope.$digest();
  //      scope.commissionData = {
  //        startDate: '10/20/2015',
  //        endDate: '10/21/2015'
  //      };
  //      scope.saveData();
  //    });
  //
  //    it('should call createCommissionData with payload', function () {
  //      var payload = CommissionDataCtrl.createPayload();
  //      expect(commissionFactory.updateCommissionData).toHaveBeenCalledWith(1, payload);
  //    });
  //  });
  //});

});
