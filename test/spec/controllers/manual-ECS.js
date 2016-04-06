'use strict';

describe('Controller: ManualECSCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/carrier-instance-list.json'));
  beforeEach(module('served/store-status.json'));

  var ManualECSCtrl;
  var manualECSFactory;
  var cateringStationsResponseJSON;
  var cateringStationsDeferred;
  var companyStationsResponseJSON;
  var companyStationsDeferred;
  var storeInstancesResponseJSON;
  var storeInstancesDeferred;
  var carrierInstancesResponseJSON;
  var carrierInstancesDeferred;
  var statusListResponseJSON;
  var statusListDeferred;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {

    inject(function (_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedCarrierInstanceList_, _servedStoreStatus_) {
      cateringStationsResponseJSON = _servedCateringStations_;
      companyStationsResponseJSON = _servedStations_;
      storeInstancesResponseJSON = _servedStoreInstanceList_;
      carrierInstancesResponseJSON = _servedCarrierInstanceList_;
      statusListResponseJSON = _servedStoreStatus_;
    });

    manualECSFactory = $injector.get('manualECSFactory');
    scope = $rootScope.$new();

    cateringStationsDeferred = $q.defer();
    cateringStationsDeferred.resolve(cateringStationsResponseJSON);
    companyStationsDeferred = $q.defer();
    companyStationsDeferred.resolve(companyStationsResponseJSON);
    storeInstancesDeferred = $q.defer();
    storeInstancesDeferred.resolve(storeInstancesResponseJSON);
    carrierInstancesDeferred = $q.defer();
    carrierInstancesDeferred.resolve(carrierInstancesResponseJSON);
    statusListDeferred = $q.defer();
    statusListDeferred.resolve(statusListResponseJSON);

    spyOn(manualECSFactory, 'getCatererStationList').and.returnValue(cateringStationsDeferred.promise);
    spyOn(manualECSFactory, 'getCompanyStationList').and.returnValue(companyStationsDeferred.promise);
    spyOn(manualECSFactory, 'getStoreInstanceList').and.returnValue(storeInstancesDeferred.promise);
    spyOn(manualECSFactory, 'getCarrierInstanceList').and.returnValue(carrierInstancesDeferred.promise);
    spyOn(manualECSFactory, 'updateCarrierInstance').and.returnValue(carrierInstancesDeferred.promise);
    spyOn(manualECSFactory, 'getStoreStatusList').and.returnValue(statusListDeferred.promise);

    ManualECSCtrl = $controller('ManualECSCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should get caterer stations', function () {
      expect(manualECSFactory.getCatererStationList).toHaveBeenCalled();
    });

    it('should get company stations', function () {
      expect(manualECSFactory.getCompanyStationList).toHaveBeenCalled();
    });

    it('should get store status list', function () {
      expect(manualECSFactory.getStoreStatusList).toHaveBeenCalled();
    });

    it('should attach caterer stations to scope and format dates', function () {
      expect(scope.cateringStationList).toBeDefined();
    });

    it('should attach caterer stations to scope and format station description', function () {
      expect(scope.cateringStationList).toBeDefined();
      expect(scope.cateringStationList.length > 0).toEqual(true);
      expect(scope.cateringStationList[0].stationDescription).toBeDefined();
    });

    it('should attach company stations to scope and format dates', function () {
      expect(scope.companyStationList).toBeDefined();
    });

    it('should attach company stations to scope and format station description', function () {
      expect(scope.companyStationList).toBeDefined();
      expect(scope.companyStationList.length > 0).toEqual(true);
      expect(scope.companyStationList[0].stationDescription).toBeDefined();
    });

    it('should default view to create ECS view', function () {
      expect(scope.isCreateViewActive).toEqual(true);
    });
  });

  describe('search', function () {
    describe('portal instances search', function () {
      it('should get list of store instances from API', function () {
        scope.searchPortalInstances();
        scope.$digest();
        expect(manualECSFactory.getStoreInstanceList).toHaveBeenCalled();
        expect(scope.storeInstances).toBeDefined();
        expect(scope.storeInstances.length > 0).toEqual(true);
      });

      it('should format search payload', function () {
        scope.portalSearch = {
          scheduleDate: '10/20/2016',
          storeNumber: '123',
          station: { id: 1 },
          storeInstance: '2'
        };

        var expectedPayload = {
          startDate: '20161020',
          endDate: '20161020',
          storeNumber: '123',
          cateringStationId: 1,
          storeInstanceId: 2
        };
        scope.searchPortalInstances();
        scope.$digest();
        expect(manualECSFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format result dates, status, and station description and attach to scope', function () {
        scope.companyStationList = [{
          stationId: 1,
          stationCode: 'mockStationCode'
        }];
        scope.searchPortalInstances();
        scope.$digest();
        expect(scope.storeInstances[0].scheduleDate).toEqual('08/15/2015');
        expect(scope.storeInstances[0].stationCode).toEqual('mockStationCode');
        expect(scope.storeInstances[0].statusName).toEqual('Dispatched');
      });

      it('should filter out store instances that are after Inbounded status', function () {
        scope.searchPortalInstances();
        scope.$digest();
        expect(scope.storeInstances.length < storeInstancesResponseJSON.response.length).toEqual(true);
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.storeInstances = [{ id: 1 }];
          scope.portalSearch = { storeInstance: 2 };
          scope.clearPortalSearch();
          expect(scope.storeInstances).toEqual(null);
          expect(scope.portalSearch).toEqual({});
        });
      });
    });

    describe('epos carrier instances search', function () {
      it('should get list of carrier instances from API', function () {
        scope.eposSearch = {};
        scope.searchEposInstances();
        var expectedPayload = { storeInstanceId: 0 };
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should get remaining list of carrier instances with matching ecbGroups', function () {
        scope.searchEposInstances();
        scope.$digest();
        var expectedPayload = { ecbGroup: jasmine.stringMatching('1845') };
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format search payload to resolve station and format date', function () {
        scope.eposSearch = {
          scheduleDate: '10/20/2016',
          storeNumber: '123',
          station: { id: 1, stationCode: 'ORD' }
        };

        var expectedPayload = {
          instanceDate: '20161020',
          storeNumber: '123',
          departureStation: 'ORD',
          storeInstanceId: 0
        };
        scope.searchEposInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format results into ecbGroups', function () {
        scope.searchEposInstances();
        scope.$digest();
        expect(scope.carrierInstances[0].children).toBeDefined();
        expect(Array.isArray(scope.carrierInstances[0].children)).toEqual(true);
      });

      it('should format result dates and attach to scope', function () {
        scope.searchEposInstances();
        scope.$digest();
        expect(scope.carrierInstances[0].instanceDate).toEqual('04/14/2016');
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.carrierInstances = [{ id: 1 }];
          scope.eposSearch = { storeNumber: '123' };
          scope.clearEposSearch();
          expect(scope.carrierInstances).toEqual(null);
          expect(scope.eposSearch).toEqual({});
        });
      });
    });

    // allECSInstances
    describe('all instances search', function () {
      it('should get list of store instances from API', function () {
        scope.searchAllECSInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalled();
      });

      it('should format search payload to resolve station and format date', function () {
        scope.allInstancesSearch = {
          eposScheduleDate: '10/20/2016',
          eposStoreNumber: '123',
          eposStation: { id: 1, stationCode: 'ORD' },
          storeInstance: '12',
          portalScheduleDate: '11/25/2015',
          portalStoreNumber: '456',
          portalStation: { id: 3, code: 'LON3' }
        };

        var expectedPayload = {
          instanceDate: '20161020',
          storeNumber: '123',
          departureStation: 'ORD',
          storeInstanceId: 12,
          siScheduleDate: '20151125',
          siStoreNumber: '456',
          siCatererStationCode: 'LON3'
        };
        scope.searchAllECSInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format result dates and attach to scope', function () {
        scope.searchAllECSInstances();
        scope.$digest();
        expect(scope.allECSInstances[0].instanceDate).toEqual('04/02/2016');
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.allECSInstances = [{ id: 1 }];
          scope.allInstancesSearch = { storeNumber: '123' };
          scope.clearAllInstancesSearch();
          expect(scope.allECSInstances).toEqual(null);
          expect(scope.allInstancesSearch).toEqual({});
        });
      });
    });
  });

  describe('Create Relationship', function () {
    beforeEach(function () {
      scope.carrierInstances = [
        {id: 1, children: [{id: 2}]},
        {id: 3, children: [{id: 4}]}
      ];
    });
    it('should call API with all selected epos instance ids and selected store instance id', function () {
      scope.selectedPortalRecord = { id: 1 };
      scope.selectedEposRecords = [scope.carrierInstances[0]];
      var expectedPayload = { storeInstanceId: 1 };
      scope.saveRelationship();
      expect(manualECSFactory.updateCarrierInstance).toHaveBeenCalledWith(1, expectedPayload);
      expect(manualECSFactory.updateCarrierInstance).toHaveBeenCalledWith(2, expectedPayload);
    });

    it('should clear models after successful create', function () {
      scope.selectedPortalRecord = { id: 1 };
      scope.selectedEposRecords = [scope.carrierInstances[0]];
      scope.storeInstances = [{ id: 3 }];
      scope.carrierInstances = [{ id: 4 }];
      scope.saveRelationship();
      scope.$digest();
      expect(scope.selectedPortalRecord).toEqual(null);
      expect(scope.selectedEposRecords).toEqual([]);
      expect(scope.storeInstances).toEqual(null);
      expect(scope.carrierInstances).toEqual(null);
    });

    it('should not allow saving if a portal and at least one epos record are not selected', function () {
      scope.selectedEposRecords = [scope.carrierInstances[0]];
      scope.selectedPortalRecord = null;
      expect(scope.canSaveRelationship()).toBeFalsy();
      scope.selectedEposRecords = [];
      scope.selectedPortalRecord = { id: 2 };
      expect(scope.canSaveRelationship()).toBeFalsy();
    });

    describe('select record helpers', function () {
      it('should attach selected portal records to scope', function () {
        var mockPortalInstance = { id: 1 };
        scope.selectPortalRecord(mockPortalInstance);
        expect(scope.selectedPortalRecord).toEqual(mockPortalInstance);
      });

      it('should remove or add selected ecbGroups', function () {
        scope.selectedEposRecords = [];
        scope.toggleSelectEposRecord(scope.carrierInstances[0]);
        expect(scope.selectedEposRecords.indexOf(scope.carrierInstances[0]) >= 0).toEqual(true);
        scope.toggleSelectEposRecord(scope.carrierInstances[0]);
        expect(scope.selectedEposRecords.indexOf(scope.carrierInstances[0]) >= 0).toEqual(false);
      });
    });
  });

  describe('View Helpers', function () {
    describe('toggle views', function () {
      it('should set active view to create view if true is passed', function () {
        scope.isCreateViewActive = false;
        scope.toggleActiveView(true);
        expect(scope.isCreateViewActive).toEqual(true);
      });
      it('should set active view to list view if false is passed', function () {
        scope.isCreateViewActive = true;
        scope.toggleActiveView(false);
        expect(scope.isCreateViewActive).toEqual(false);
      });
    });
  });

  describe('No Records / Search prompts', function () {
    describe('should show no record alert', function () {
      it('should return true if list model is defined and empty', function () {
        scope.storeInstances = [];
        expect(scope.shouldShowNoRecordAlert('portal')).toEqual(true);
        scope.carrierInstances = null;
        expect(scope.shouldShowNoRecordAlert('epos')).toEqual(false);
      });
    });

    describe('should show search prompt alert', function () {
      it('should return true if list model is null', function () {
        scope.storeInstances = null;
        expect(scope.shouldShowSearchPromptAlert('portal')).toEqual(true);
        scope.allECSInstances = [];
        expect(scope.shouldShowSearchPromptAlert('all')).toEqual(false);
      });
    });

    describe('canEditRecord', function () {
      it('should return true if store instance has status Inbounded', function () {
        var mockStoreInstance = { statusName: 'Dispatched' };
        expect(scope.canSelectStoreInstance(mockStoreInstance)).toEqual(false);
        mockStoreInstance = { statusName: 'Inbounded' };
        expect(scope.canSelectStoreInstance(mockStoreInstance)).toEqual(true);
      });
    });

    describe('epos nested table functions', function () {
      it('should close open groups and open closed groups', function () {
        var mockParentGroup = {id: 1};
        scope.toggleOpenGroup(mockParentGroup);
        expect(mockParentGroup.isOpen).toEqual(true);
        scope.toggleOpenGroup(mockParentGroup);
        expect(mockParentGroup.isOpen).toEqual(false);
      });

      it('should toggle open/close icon if a group is open or closed', function () {
        var mockOpenParentGroup = {id: 1, isOpen: true};
        expect(scope.getClassForAccordionButton(mockOpenParentGroup)).toEqual('fa fa-angle-down');
        var mockClosedParentGroup = {id: 1, isOpen: false};
        expect(scope.getClassForAccordionButton(mockClosedParentGroup)).toEqual('fa fa-angle-right');
      });

      it('should display child row as gray if unselected, and green otherwise', function () {
        var mockParentGroup = {id: 1, children: [{id: 2}]};
        scope.selectedEposRecords = [];
        expect(scope.getClassForEposInstanceRow(mockParentGroup, false)).toEqual('');
        expect(scope.getClassForEposInstanceRow(mockParentGroup, true)).toEqual('categoryLevel2');

        scope.selectedEposRecords = [mockParentGroup];
        expect(scope.getClassForEposInstanceRow(mockParentGroup, false)).toEqual('bg-success');
        expect(scope.getClassForEposInstanceRow(mockParentGroup, true)).toEqual('bg-success');
      });

      it('should only show table when carrier instances exist', function () {
        scope.carrierInstances = {};
        expect(scope.shouldShowCarrierInstanceTable()).toEqual(false);
        scope.carrierInstances = null;
        expect(scope.shouldShowCarrierInstanceTable()).toEqual(false);
        scope.carrierInstances = { 1: [{ id: 2 }] };
        expect(scope.shouldShowCarrierInstanceTable()).toEqual(true);
      });
    });
  });

});
