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
    beforeEach(function () {
      initController('edit', 1);
      scope.$digest();
    });
    describe('addNewItem', function () {
      var oldLength;
      beforeEach(function () {
        oldLength = scope.employeeMessage.employees.length;
        scope.newRecords = {'employees': []};
        scope.newRecords.employees.push({
          id: 63,
          employeeIdentifier: '1003',
          firstName: 'Jeff',
          lastName: 'Wright'
        });
        scope.addNewItem('employees');
        scope.$digest();
      });

      it('should add employee items from newRecords when employees category is passed in', function () {
        expect(scope.employeeMessage.employees.length).toEqual(oldLength + 1);
        expect(scope.employeeMessage.employees[oldLength].employeeIdentifier).toEqual('1003');
        expect(scope.employeeMessage.employees[oldLength].firstName).toEqual('Jeff');
        expect(scope.employeeMessage.employees[oldLength].lastName).toEqual('Wright');
      });
      it('should add employee items with employeeIdentifier, firstName, and lastName attributes', function () {
        expect(scope.employeeMessage.employees[oldLength].employeeIdentifier).toEqual('1003');
        expect(scope.employeeMessage.employees[oldLength].firstName).toEqual('Jeff');
        expect(scope.employeeMessage.employees[oldLength].lastName).toEqual('Wright');
      });

      it('should clear previously selected records', function () {
        expect(scope.newRecords.employees.length).toEqual(0);
      });
    });

    describe('bulk delete items', function () {
      it('should remove all filteredItems', function () {
        var oldLength = scope.employeeMessage.employees.length;
        scope.employeeMessage.employees[0].selectedToDelete = true;
        scope.removeItems('employees');
        scope.$digest();
        expect(scope.employeeMessage.employees.length).toEqual(oldLength -1);
      });
      it('should clear select all toggle', function () {
        scope.employeeMessage.employees[0].selectedToDelete = true;
        scope.removeItems('employees');
        scope.$digest();
        expect(scope.employeesDeleteAll).toEqual(false);
      });
    });
  });

  describe('filter items list', function () {
    beforeEach(function () {
      initController('edit', 1);
      scope.$digest();
    });
    it('should return items that are not in the employeeMessage', function () {
      var masterEmployeesLength = employeesJSON.companyEmployees.length;
      var masterSchedulesLength = schedulesJSON.distinctSchedules.length;
      var masterStationsLength = stationsJSON.response.length;

      var employeesLength = scope.employeeMessage.employees.length;
      var schedulesLength = scope.employeeMessage.schedules.length;
      var departureStationsLength = scope.employeeMessage.departureStations.length;
      var arrivalStationsLength = scope.employeeMessage.arrivalStations.length;

      EmployeeMessageCtrl.filterListsByName('all');
      expect(scope.filteredEmployees.length).toEqual(masterEmployeesLength - employeesLength);
      expect(scope.filteredSchedules.length).toEqual(masterSchedulesLength - schedulesLength);
      expect(scope.filteredDepStations.length).toEqual(masterStationsLength - departureStationsLength);
      expect(scope.filteredArrStations.length).toEqual(masterStationsLength - arrivalStationsLength);
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
});
