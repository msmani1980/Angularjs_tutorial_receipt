'use strict';

describe('Controller: ReconciliationDashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ReconciliationDashboardCtrl;
  var scope;
  var location;
  var reconciliationFactory;
  var controller;
  var reconciliationListDeferred;
  var reconciliationListResponseJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, $location, $injector) {
    location = $location;
    scope = $rootScope.$new();

    reconciliationFactory = $injector.get('reconciliationFactory');
    controller = $controller;

    reconciliationListResponseJSON = [{id: 1}]; // stub for now until API is complete
    reconciliationListDeferred = $q.defer();
    reconciliationListDeferred.resolve(reconciliationListResponseJSON);
    spyOn(reconciliationFactory,  'getMockReconciliationDataList').and.returnValue(reconciliationListDeferred.promise);


    ReconciliationDashboardCtrl = $controller('ReconciliationDashboardCtrl', {
      $scope: scope
    });
  }));


  describe('init', function () {
    it('should call get LMP stock data', function () {
      expect(reconciliationFactory.getMockReconciliationDataList).toHaveBeenCalled();
      scope.$digest();
      expect(scope.reconciliationList).toBeDefined();
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

});
