'use strict';

describe('Service: commissionDataService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/commission-payable-list.json'));

  var commissionDataService,
    $httpBackend,
    commissionDataListResponseJSON;

  beforeEach(inject(function (_commissionDataService_, $injector) {
    inject(function (_servedCommissionPayableList_) {
      commissionDataListResponseJSON = _servedCommissionPayableList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    commissionDataService = _commissionDataService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!commissionDataService).toBe(true);
  });

  describe('API calls', function () {
    describe('getCommissionPayableList', function () {
      it('should be accessible in the service', function () {
        expect(!!commissionDataService.getCommissionPayableList).toBe(true);
      });

      var commissionPayableList;
      beforeEach(function () {
        $httpBackend.whenGET(/employee-commissions-payable/).respond(commissionDataListResponseJSON);
        commissionDataService.getCommissionPayableList().then(function (dataFromAPI) {
          commissionPayableList = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(commissionPayableList.response)).toBe('[object Array]');
      });

      describe('api call parameters', function () {
        it('should take an optional payload parameter', function () {
          var crewBaseId = 2;
          var payload = {crewBaseTypeId: crewBaseId};
          var regex = new RegExp('employee-commissions-payable\.\*crewBaseTypeId=' + crewBaseId, 'g');
          $httpBackend.expectGET(regex);
          commissionDataService.getCommissionPayableList(payload);
          $httpBackend.flush();
        });

        it('should not need a payload parameter', function () {
          var regex = new RegExp('employee-commissions-payable', 'g');
          $httpBackend.expectGET(regex);
          commissionDataService.getCommissionPayableList();
          $httpBackend.flush();
        });
      });
    });

    describe('getCommissionPayableData', function () {
      it('should be accessible in the service', function () {
        expect(!!commissionDataService.getCommissionPayableData).toBe(true);
      });

      it('should append id to request URL', function () {
        var id = '123';
        var regex = new RegExp('employee-commissions-payable/' + id, 'g');
        $httpBackend.expectGET(regex).respond('202');
        commissionDataService.getCommissionPayableData(id);
        $httpBackend.flush();
      });
    });

    describe('createCommissionData', function () {

      it('should be accessible in the service', function () {
        expect(!!commissionDataService.createCommissionData).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        $httpBackend.whenPOST(regex).respond({id: 36});
      });

      it('should POST data to employee-commissions-payable API', function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        commissionDataService.createCommissionData({});
        $httpBackend.expectPOST(regex);
        $httpBackend.flush();
      });
    });

    describe('updateCommissionData', function () {
      it('should be accessible in the service', function () {
        expect(!!commissionDataService.updateCommissionData).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        $httpBackend.whenPUT(regex).respond('202');
      });

      it('should PUT data to employee-commissions-payable API', function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        commissionDataService.updateCommissionData(1, {});
        $httpBackend.expectPUT(regex);
        $httpBackend.flush();
      });

      it('should append id to request URL', function () {
        var id = 123;
        var regex = new RegExp('employee-commissions-payable/' + id, 'g');
        $httpBackend.expectPUT(regex);
        commissionDataService.updateCommissionData(id, {});
        $httpBackend.flush();
      });
    });

    describe('deletePostTrip', function () {
      it('should be accessible in service', function () {
        expect(!!commissionDataService.deleteCommissionData).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        $httpBackend.whenDELETE(regex).respond('202');
      });

      it('should send DELETE request', function () {
        var regex = new RegExp('employee-commissions-payable', 'g');
        $httpBackend.expectDELETE(regex);
        commissionDataService.deleteCommissionData('403', '1');
        $httpBackend.flush();
      });

      it('should append postTrip id to request URL', function () {
        var id = 123;
        var regex = new RegExp('employee-commissions-payable/' + id, 'g');
        $httpBackend.expectDELETE(regex);
        commissionDataService.deleteCommissionData(id);
        $httpBackend.flush();
      });
    });

  });
});
