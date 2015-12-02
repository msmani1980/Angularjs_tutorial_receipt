'use strict';

describe('Controller: ReconciliationDashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/store-status.json',
    'served/global-stations.json',
    'served/store-instance.json'
  ));

  var ReconciliationDashboardCtrl;
  var scope;
  var location;
  var reconciliationFactory;
  var stationsService;
  var controller;
  var reconciliationListDeferred;
  var storeStatusDeferred;
  var globalStationsDeferred;
  var reconciliationListResponseJSON;
  var storeStatusResponseJSON;
  var globalStationsResponseJSON;
  var storeInstanceJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, $location, $injector, _servedStoreStatus_, _servedGlobalStations_, _servedStoreInstance_) {
    location = $location;
    scope = $rootScope.$new();

    reconciliationFactory = $injector.get('reconciliationFactory');
    stationsService = $injector.get('stationsService');
    controller = $controller;

    reconciliationListResponseJSON = [{id: 1}]; // stub for now until API is complete
    reconciliationListDeferred = $q.defer();
    reconciliationListDeferred.resolve(reconciliationListResponseJSON);

    storeStatusResponseJSON = _servedStoreStatus_;
    storeStatusDeferred = $q.defer();
    storeStatusDeferred.resolve(storeStatusResponseJSON);

    globalStationsResponseJSON = _servedGlobalStations_;
    globalStationsDeferred = $q.defer();
    globalStationsDeferred.resolve(globalStationsResponseJSON);

    storeInstanceJSON = angular.copy(_servedStoreInstance_);

    spyOn(reconciliationFactory, 'getReconciliationDataList').and.returnValue(reconciliationListDeferred.promise);
    spyOn(reconciliationFactory, 'getStoreStatusList').and.returnValue(storeStatusDeferred.promise);
    spyOn(stationsService, 'getGlobalStationList').and.returnValue(reconciliationListDeferred.promise);

    ReconciliationDashboardCtrl = $controller('ReconciliationDashboardCtrl', {
      $scope: scope
    });
  }));


  describe('init', function () {
    it('should call get LMP stock data', function () {
      expect(reconciliationFactory.getStoreStatusList).toHaveBeenCalled();
      scope.$digest();
    });

    it('should init displayColumns with receivedStation, storeInstanceId, updatedDate, updatedBy columns to be hidden', function () {
      expect(scope.displayColumns).toBeDefined();
      expect(scope.displayColumns.receivedStation).toEqual(false);
      expect(scope.displayColumns.storeInstanceId).toEqual(false);
      expect(scope.displayColumns.updatedDate).toEqual(false);
      expect(scope.displayColumns.updatedBy).toEqual(false);
    });

  });

  describe('table helper functions', function () {
    describe('update orderBy', function () {
      it('should change sort title to given title', function () {
        scope.tableSortTitle = 'oldSortName';
        scope.updateOrderBy('newSortName', true);
        expect(scope.tableSortTitle).toEqual('newSortName');
      });

      it('should reverse sort direction if already sorting on given name', function () {
        scope.tableSortTitle = 'sortName';
        scope.updateOrderBy('sortName', true);
        expect(scope.tableSortTitle).toEqual('-sortName');
      });
    });

    describe('getSortingType', function () {
      it('should return descending if sort title is negative', function () {
        scope.tableSortTitle = '-sortName';
        var arrowType = scope.getSortingType('sortName');
        expect(arrowType).toEqual('descending');
      });
      it('should return ascending if sort title is not negative', function () {
        scope.tableSortTitle = 'sortName';
        var arrowType = scope.getSortingType('sortName');
        expect(arrowType).toEqual('ascending');
      });
      it('should return none if sort title is not the given name', function () {
        scope.tableSortTitle = 'sortName';
        var arrowType = scope.getSortingType('otherName');
        expect(arrowType).toEqual('none');
      });
    });

    describe('getArrowIconAndClassForSorting', function () {
      it('should return black ascending arrow for ascending sort type', function () {
        scope.tableSortTitle = 'sortName';
        var arrowClass = scope.getArrowIconAndClassForSorting('sortName');
        expect(arrowClass).toEqual('fa fa-sort-asc active');
      });
      it('should return black descending arrow for descending sort type', function () {
        scope.tableSortTitle = '-sortName';
        var arrowClass = scope.getArrowIconAndClassForSorting('sortName');
        expect(arrowClass).toEqual('fa fa-sort-desc active');
      });
      it('should return muted arrows for no sort type', function () {
        scope.tableSortTitle = 'sortName';
        var arrowClass = scope.getArrowIconAndClassForSorting('otherName');
        expect(arrowClass).toEqual('fa fa-sort text-muted-light');
      });
    });

    describe('toggleColumn', function () {
      it('should reverse column visibility', function () {
        scope.displayColumns = {testColumn: false};
        scope.toggleColumnView('testColumn');
        expect(scope.displayColumns.testColumn).toEqual(true);
        scope.toggleColumnView('testColumn');
        expect(scope.displayColumns.testColumn).toEqual(false);
      });
    });

    describe('doesInstanceContainAction', function () {
      it('should return true if instance contains an action', function () {
        var testInstance = {actions: ['testAction']};
        expect(scope.doesInstanceContainAction(testInstance, 'testAction')).toEqual(true);
      });
      it('should return false if instance contains an action', function () {
        var testInstance = {actions: ['testAction']};
        expect(scope.doesInstanceContainAction(testInstance, 'fakeAction')).toEqual(false);
      });
      it('should return false if instance does not contain actions', function () {
        var testInstance = {};
        expect(scope.doesInstanceContainAction(testInstance, 'testAction')).toEqual(false);
      });
    });
  });

  it('filterReconciliationList should filter items in unsupported status', function () {
    expect(scope.filterReconciliationList({statusName: 'Inbounded'})).toEqual(true);
    expect(scope.filterReconciliationList({statusName: 'Confirmed'})).toEqual(true);
    expect(scope.filterReconciliationList({statusName: 'Discrepancies'})).toEqual(true);
    expect(scope.filterReconciliationList({statusName: 'Commission Paid'})).toEqual(true);
    expect(scope.filterReconciliationList({statusName: 'Something else'})).toEqual(false);
  });

  it('getStoreStatusNameById should return status name from status id', function () {
    scope.allowedStoreStatusMap[8] = {id: 8, statusName: 'Inbounded'};

    expect(ReconciliationDashboardCtrl.getStoreStatusNameById(8)).toEqual('Inbounded');
    expect(ReconciliationDashboardCtrl.getStoreStatusNameById(10)).toEqual(null);
  });

  it('normalizeReconciliationDataList should normalize reconciliation list', function () {
    ReconciliationDashboardCtrl.normalizeReconciliationDataList([storeInstanceJSON]);

    expect(storeInstanceJSON.scheduleDate).toEqual('09/30/2015');
    expect(storeInstanceJSON.updatedOn).toEqual('09/01/2015 15:57');
    expect(storeInstanceJSON.isEcb).toEqual('No');
    expect(storeInstanceJSON.eposData).toEqual('Loading...');
    expect(storeInstanceJSON.postTripData).toEqual('Loading...');
    expect(storeInstanceJSON.cashHandlerData).toEqual('Loading...');
  });

  it('recalculateActionsColumn should calculate action column', function () {
    var item = {};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports']);

    item = {statusName: 'Inbounded', eposData: '1/3', postTripData: '2/3', cashHandlerData: '3/3'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Validate']);

    // TODO: enable again once Roshen allows us to enable these actions
    /*item = {statusName: 'Inbounded', eposData: 'No'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Add ePOS Data']);

    item = {statusName: 'Inbounded', postTripData: 'No'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Add Post Trip Data']);

    item = {statusName: 'Inbounded', cashHandlerData: 'No'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Add Cash Handler Data']);*/

    item = {statusName: 'Confirmed'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Review', 'Pay Commission', 'Unconfirm']);

    item = {statusName: 'Discrepancies'};
    ReconciliationDashboardCtrl.recalculateActionsColumn(item);
    expect(item.actions).toEqual(['Reports', 'Review', 'Confirm']);
  });

  it('fixSearchDropdowns should reset dropdown value if empty value is selected', function () {
    var search = {
      cateringStationId: '',
      arrivalStationCode: '',
      statusId: ''
    };

    var expected = {
      cateringStationId: null,
      arrivalStationCode: null,
      statusId: null
    };

    ReconciliationDashboardCtrl.fixSearchDropdowns(search);
    expect(search).toEqual(expected);
  });

  it('highlightSelected returns active in case instance is selected', function () {
    expect(scope.highlightSelected({})).toEqual('');
    expect(scope.highlightSelected({selected: false})).toEqual('');
    expect(scope.highlightSelected({selected: true})).toEqual('active');
  });

  it('hasSelectedInstance returns true in case there are selected instances', function () {
    scope.reconciliationList = [{}];
    expect(scope.hasSelectedInstance()).toEqual(false);

    scope.reconciliationList = [{selected: false}];
    expect(scope.hasSelectedInstance()).toEqual(false);

    scope.reconciliationList = [{selected: true}];
    expect(scope.hasSelectedInstance()).toEqual(true);
  });

  it('canHaveInstanceCheckbox returns true for Validate and Pay Commission actions', function () {
    expect(scope.canHaveInstanceCheckbox({actions: ['Validate']})).toEqual(true);
    expect(scope.canHaveInstanceCheckbox({actions: ['Pay Commission']})).toEqual(true);
    expect(scope.canHaveInstanceCheckbox({actions: ['Validate', 'Pay Commission']})).toEqual(true);
    expect(scope.canHaveInstanceCheckbox({actions: ['Review']})).toEqual(false);
  });

  it('toggleAllCheckboxes toggles select for eligible instances', function () {
    scope.allCheckboxesSelected = true;

    scope.reconciliationList = [{actions: ['Validate']}];
    scope.toggleAllCheckboxes();
    expect(scope.reconciliationList[0].selected).toEqual(true);

    scope.reconciliationList = [{actions: ['Pay Commission']}];
    scope.toggleAllCheckboxes();
    expect(scope.reconciliationList[0].selected).toEqual(true);

    scope.reconciliationList = [{actions: ['Review']}];
    scope.toggleAllCheckboxes();
    expect(scope.reconciliationList[0].selected).toEqual(undefined);
  });

  it('findSelectedInstances finds selected instances with given status', function () {

    scope.reconciliationList = [{selected: true}];
    expect(ReconciliationDashboardCtrl.findSelectedInstances().length).toEqual(1);

    scope.reconciliationList = [{selected: false}];
    expect(ReconciliationDashboardCtrl.findSelectedInstances().length).toEqual(0);
  });

  it('findInstancesWithStatus finds selected instances with given status', function () {

    scope.instancesForActionExecution = [{statusName: 'Confirmed'}];

    expect(ReconciliationDashboardCtrl.findInstancesWithStatus('Confirmed').length).toEqual(1);
    expect(ReconciliationDashboardCtrl.findInstancesWithStatus('Discrepancies').length).toEqual(0);
  });

});
