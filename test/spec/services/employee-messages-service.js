'use strict';

describe('Service: commissionDataService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/employee-messages.json'));

  var employeeMessagesService;
  var $httpBackend;
  var employeeMessagesListResponseJSON;

  beforeEach(inject(function (_employeeMessagesService_, $injector) {
    inject(function (_servedEmployeeMessages_) {
      employeeMessagesListResponseJSON = _servedEmployeeMessages_;
    });

    $httpBackend = $injector.get('$httpBackend');
    employeeMessagesService = _employeeMessagesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!employeeMessagesService).toBe(true);
  });

  describe('API calls', function () {
    describe('getEmployeeMessages', function () {
      it('should be accessible in the service', function () {
        expect(!!employeeMessagesService.getEmployeeMessages).toBe(true);
      });

      var employeeMessagesList;
      beforeEach(function () {
        $httpBackend.whenGET(/employee-messages/).respond(employeeMessagesListResponseJSON);
        employeeMessagesService.getEmployeeMessages().then(function (dataFromAPI) {
          employeeMessagesList = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should contain an array', function () {
        expect(Object.prototype.toString.call(employeeMessagesList.employeeMessages)).toBe('[object Array]');
      });

      describe('api call parameters', function () {
        it('should take an optional payload parameter', function () {
          var mockDate = '20151010';
          var payload = {startDate: mockDate};
          var regex = new RegExp('employee-messages\.\*startDate=' + 20151010, 'g');
          $httpBackend.expectGET(regex);
          employeeMessagesService.getEmployeeMessages(payload);
          $httpBackend.flush();
        });
      });
    });

    describe('getEmployeeMessage', function () {
      it('should be accessible in the service', function () {
        expect(!!employeeMessagesService.getEmployeeMessage).toBe(true);
      });

      it('should append id to request URL', function () {
        var id = '123';
        var regex = new RegExp('employee-messages/' + id, 'g');
        $httpBackend.expectGET(regex).respond('202');
        employeeMessagesService.getEmployeeMessage(id);
        $httpBackend.flush();
      });
    });

    describe('createEmployeeMessage', function () {

      it('should be accessible in the service', function () {
        expect(!!employeeMessagesService.createEmployeeMessage).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-messages', 'g');
        $httpBackend.whenPOST(regex).respond({id: 36});
      });

      it('should POST data to employee-messages API', function () {
        var regex = new RegExp('employee-messages', 'g');
        employeeMessagesService.createEmployeeMessage({});
        $httpBackend.expectPOST(regex);
        $httpBackend.flush();
      });
    });

    describe('editEmployeeMessage', function () {
      it('should be accessible in the service', function () {
        expect(!!employeeMessagesService.editEmployeeMessage).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-messages', 'g');
        $httpBackend.whenPUT(regex).respond('202');
      });

      it('should PUT data to employee-messages API', function () {
        var regex = new RegExp('employee-messages', 'g');
        employeeMessagesService.editEmployeeMessage(1, {});
        $httpBackend.expectPUT(regex);
        $httpBackend.flush();
      });

      it('should append id to request URL', function () {
        var id = 123;
        var regex = new RegExp('employee-messages/' + id, 'g');
        $httpBackend.expectPUT(regex);
        employeeMessagesService.editEmployeeMessage(id, {});
        $httpBackend.flush();
      });
    });

    describe('deletePostTrip', function () {
      it('should be accessible in service', function () {
        expect(!!employeeMessagesService.deleteEmployeeMessage).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-messages', 'g');
        $httpBackend.whenDELETE(regex).respond('202');
      });

      it('should send DELETE request', function () {
        var regex = new RegExp('employee-messages', 'g');
        $httpBackend.expectDELETE(regex);
        employeeMessagesService.deleteEmployeeMessage('403');
        $httpBackend.flush();
      });

      it('should append postTrip id to request URL', function () {
        var id = 123;
        var regex = new RegExp('employee-messages/' + id, 'g');
        $httpBackend.expectDELETE(regex);
        employeeMessagesService.deleteEmployeeMessage(id);
        $httpBackend.flush();
      });
    });

  });
});
