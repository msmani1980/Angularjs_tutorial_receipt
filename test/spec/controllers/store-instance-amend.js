'use strict';

fdescribe('Controller: StoreInstanceAmendCtrl', function () {

  beforeEach(module('ts5App'));

  var scope;
  var StoreInstanceAmendCtrl;
  var controller;
  var location;
  var StoreInstanceAmendFactory;
  var storeInstanceDeferred;
  var storeInstanceResponseJSON;
  var cashBagsDeferred;
  var cashBagsResponseJSON;


  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    location = $location;
    scope = $rootScope.$new();
    StoreInstanceAmendFactory = $injector.get('storeInstanceAmendFactory');
    controller = $controller;

    storeInstanceResponseJSON = [{id: 1}]; // stub for now until API is complete
    storeInstanceDeferred = $q.defer();
    storeInstanceDeferred.resolve(storeInstanceResponseJSON);
    cashBagsResponseJSON = [{id: 2}, {id: 3}]; // stub for now until API is complete
    cashBagsDeferred = $q.defer();
    cashBagsDeferred.resolve(cashBagsResponseJSON);

    spyOn(StoreInstanceAmendFactory, 'getStoreInstancesMockData').and.returnValue(storeInstanceDeferred.promise);
    spyOn(StoreInstanceAmendFactory, 'getCashBagListMockData').and.returnValue(cashBagsDeferred.promise);

    StoreInstanceAmendCtrl = controller('StoreInstanceAmendCtrl', {
      $scope: scope,
      $routeParams: {
        id: 2
      }
    });
  }));


  describe('init', function () {
    it('should call get cash bag data', function () {
      expect(StoreInstanceAmendFactory.getCashBagListMockData).toHaveBeenCalled();
      scope.$digest();
      expect(scope.cashBagList).toBeDefined();
    });
    it('should init no moveCashBag actions', function () {
      expect(scope.moveCashBagAction).toEqual('none');
    });
    it('should init with no sectors to be moved', function () {
      expect(scope.showDeletedCashBags).toEqual(false);
    });
    it('should init deleted cashBags to not be visible', function () {
      expect(scope.sectorsToMove.length).toEqual(0);
    });
  });

  describe('miscellaneous scope view functions', function () {
    describe('get class for accordion views', function () {
      it('should return close icon for open records', function () {
        var openAccordionIcon = scope.getClassForAccordionArrows(true);
        var openRowIcon = scope.getClassForTableAccordion(true);
        expect(openAccordionIcon).toEqual('fa-chevron-down');
        expect(openRowIcon).toEqual('fa fa-minus-square');
      });
      it('should return close class for closed records', function () {
        var openAccordionIcon = scope.getClassForAccordionArrows(false);
        var openRowIcon = scope.getClassForTableAccordion(false);
        expect(openAccordionIcon).toEqual('fa-chevron-right');
        expect(openRowIcon).toEqual('fa fa-plus-square-o');
      });
    });

    describe('doesSectorHaveCrewData', function () {
      it('should return false if cashBag has empty crew array', function () {
        var mockSector = {id: 1, crewData: []};
        expect(scope.doesSectorHaveCrewData(mockSector)).toEqual(false);
        mockSector = {id: 1, crewData: [{crewId: 1}]};
        expect(scope.doesSectorHaveCrewData(mockSector)).toEqual(true);
      });
    });

    describe('shouldShowCashBag', function () {
      it('should always show cashBag if it has not been deleted', function () {
        var mockCashBag = {isDeleted: false};
        scope.showDeletedCashBags = false;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
        scope.showDeletedCashBags = true;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
      });
      it('should show deleted cashBag if showDeletedCashBags is true', function () {
        var mockCashBag = {isDeleted: true};
        scope.showDeletedCashBags = false;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(false);
        scope.showDeletedCashBags = true;
        expect(scope.shouldShowCashBag(mockCashBag)).toEqual(true);
      });
    });

    describe('toggle verified cashBag', function () {
      it('should reverse cash bag flags', function () {
        scope.cashBagList = [{isVerified: false}];
        scope.toggleVerifiedCashBag(scope.cashBagList[0]);
        expect(scope.cashBagList[0].isVerified).toEqual(true);
      });
    });

    describe('expand/collapse all sales and revenue details', function () {
      beforeEach(function () {
        var mockCashBag = {
          salesTableOpen: true,
          revenueTableOpen: false
        };
        scope.cashBagList = [mockCashBag];
      });
      it('should expand all tables when shouldExpand is true', function () {
        scope.toggleSalesAndRevenueDetails(scope.cashBagList[0], true);
        expect(scope.cashBagList[0].salesTableOpen).toEqual(true);
        expect(scope.cashBagList[0].revenueTableOpen).toEqual(true);
      });
      it('should return true if one or all of the tables are open', function () {
        var isOpen = scope.isSalesAndRevenueDetailsOpen(scope.cashBagList[0]);
        expect(isOpen).toEqual(true);
        scope.cashBagList[0].salesTableOpen = false;
        isOpen = scope.isSalesAndRevenueDetailsOpen(scope.cashBagList[0]);
        expect(isOpen).toEqual(false);
      });
    });

    describe('expand/collapse all crew data', function () {
      var mockCashBag;
      beforeEach(function () {
        mockCashBag = {
          flightSectors: [
            {id: 1, rowOpen: false, crewData: [{crewId: 1}]},
            {id: 1, rowOpen: true, crewData: [{crewId: 2}]}
          ]
        };
        scope.cashBagList = [mockCashBag];
      });
      it('should expand all rows when shouldExpand is true', function () {
        scope.toggleCrewDetails(scope.cashBagList[0], true);
        expect(scope.cashBagList[0].flightSectors[0].rowOpen).toEqual(true);
        expect(scope.cashBagList[0].flightSectors[1].rowOpen).toEqual(true);
      });
      it('should return true if at least one row is open', function () {
        var isOpen = scope.isCrewDataOpen(scope.cashBagList[0]);
        expect(isOpen).toEqual(true);
        scope.cashBagList[0].flightSectors[1].rowOpen = false;
        isOpen = scope.isCrewDataOpen(mockCashBag);
        expect(isOpen).toEqual(false);
      });
    });
  });

  describe('rearrange flight sector functions', function () {
    describe('clearRearrangeSelections', function () {
      it('should clear old flight sectors to be moved', function () {
        scope.sectorsToMove = [{id: 1}, {id: 2}];
        scope.clearRearrangeSelections();
        expect(scope.sectorsToMove.length).toEqual(0);
      });
    });

    describe('select flight sector to move', function () {
      beforeEach(function () {
        scope.sectorsToMove = [{id: 1}, {id: 2}];
      });
      it('should add new sectors to sectorsToMove', function () {
        var mockNewSector = {id: 5};
        scope.toggleSelectSectorToRearrange(mockNewSector);
        var expectedSectorsToMove = [{id: 1}, {id: 2}, {id: 5}];
        expect(scope.sectorsToMove).toEqual(expectedSectorsToMove);

      });
      it('should remove existing sectors to sectorsToMove', function () {
        var mockSelectedSector = {id: 1};
        scope.toggleSelectSectorToRearrange(mockSelectedSector);
        var expectedSectorsToMove = [{id: 2}];
        expect(scope.sectorsToMove).toEqual(expectedSectorsToMove);
      });
    });

    describe('classes for selected records', function () {
      beforeEach(function () {
        scope.sectorsToMove = [{id: 1}, {id: 2}];
      });
      it('should return colored and selected rows for items in sectorsToMove', function () {
        var mockSelectedSector = {id: 1};
        var background = scope.getClassesForRearrangeSectors(mockSelectedSector, 'background');
        var buttonIcon = scope.getClassesForRearrangeSectors(mockSelectedSector, 'buttonIcon');
        expect(background).not.toEqual('');
        expect(buttonIcon).toEqual('fa fa-check-circle');
      });
      it('should return white deselected rows for items not in sectorsToMove', function () {
        var mockNonSelectedSector = {id: 5};
        var background = scope.getClassesForRearrangeSectors(mockNonSelectedSector, 'background');
        var buttonIcon = scope.getClassesForRearrangeSectors(mockNonSelectedSector, 'buttonIcon');
        expect(background).toEqual('');
        expect(buttonIcon).toEqual('fa fa-circle-thin');
      });
    });

    describe('close rearrange modal', function () {
      it('should clear all changes', function () {
        scope.sectorsToMove = [{id: 1}, {id: 2}];
        scope.rearrangeOriginCashBag = {cashBag: '123'};
        scope.rearrangeTargetCashBag = {cashBag: '345'};

        scope.closeRearrangeSectorModal();
        expect(scope.sectorsToMove.length).toEqual(0);
        expect(scope.rearrangeOriginCashBag).toEqual(null);
        expect(scope.rearrangeTargetCashBag).toEqual(null);
      });
    });
  });

  describe('move cash bag functions', function () {
    describe('open move cash bag modal', function () {
      it('should attach cash bag to move to scope', function () {
        var mockCashBag = {id: 1};
        scope.showMoveCashBagModal(mockCashBag);
        expect(scope.cashBagToMove).toEqual(mockCashBag);
      });
    });

    describe('close move cash bag modal', function () {
      it('should clear all previously set variables', function () {
        scope.moveCashBagAction = 'rearrange';
        scope.moveCashBagSearchResults = [{id: 1}];
        scope.cashBagToMove = {id: 1};
        scope.moveSearch = {cashBag: '123'};
        scope.targetRecordForMoveCashBag = {cashBag: '345'};
        scope.closeMoveCashBagModal();

        expect(scope.moveCashBagAction).toEqual('none');
        expect(scope.moveCashBagSearchResults).toEqual(null);
        expect(scope.cashBagToMove).toEqual(null);
        expect(scope.moveSearch).toEqual({});
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });
    });

    describe('clear move cash bag results', function () {
      beforeEach(function () {
        scope.moveCashBagAction = 'rearrange';
        scope.moveCashBagSearchResults = [{id: 1}];
        scope.cashBagToMove = {id: 1};
        scope.moveSearch = {cashBag: '123'};
        scope.targetRecordForMoveCashBag = {cashBag: '345'};
        scope.clearMoveSearchResults();
      });
      it('should clear search query and results', function () {
        expect(scope.moveSearch).toEqual({});
        expect(scope.moveCashBagSearchResults).toEqual(null);
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });
      it('should not clear cashBagAction and cashBag to move', function () {
        expect(scope.moveCashBagAction).toEqual('rearrange');
        expect(scope.cashBagToMove).toEqual({id: 1});
      });
    });

    describe('search for record', function () {
      beforeEach(function () {
        scope.targetRecordForMoveCashBag = null;
      });
      it('should getStoreInstances if action is reallocate', function () {
        scope.moveCashBagAction = 'reallocate';
        scope.moveSearch = {storeNumber: '123', scheduleDate: '10/20/2015'};
        scope.searchForMoveCashBag();
        expect(StoreInstanceAmendFactory.getStoreInstancesMockData).toHaveBeenCalledWith(scope.moveSearch);
      });
      it('should getCashBag if action is merge', function () {
        scope.moveCashBagAction = 'merge';
        scope.moveSearch = {cashBag: '123', bankRefNumber: 'ABC'};
        scope.searchForMoveCashBag();
        expect(StoreInstanceAmendFactory.getCashBagListMockData).toHaveBeenCalledWith(scope.moveSearch);
      });
      it('should automatically set targetRecordForMoveCashBag if there is only one result', function () {
        scope.moveCashBagAction = 'merge';  // cash bag API stubbed to return two records
        scope.moveSearch = {storeNumber: '123', scheduleDate: '10/20/2015'};
        scope.searchForMoveCashBag();
        scope.$digest();
        expect(scope.targetRecordForMoveCashBag).toEqual(null);
      });
      it('should not set targetRecordForMoveCashBag if there is more than one record', function () {
        scope.moveCashBagAction = 'reallocate';  // storeInstance API stubbed to return one record above
        scope.moveSearch = {storeNumber: '123', scheduleDate: '10/20/2015'};
        scope.searchForMoveCashBag();
        scope.$digest();
        expect(scope.targetRecordForMoveCashBag).not.toEqual(null);
      });
    });

    describe('classes for selected records', function () {
      beforeEach(function () {
        scope.targetRecordForMoveCashBag = {id: 1};
      });
      it('should return colored and selected rows for the selected target', function () {
        var mockSelectedRecord = scope.targetRecordForMoveCashBag;
        var background = scope.getClassesForMoveSelectedRow(mockSelectedRecord, 'background');
        var buttonIcon = scope.getClassesForMoveSelectedRow(mockSelectedRecord, 'buttonIcon');
        expect(background).toEqual('bg-success');
        expect(buttonIcon).toEqual('fa fa-check-circle');
      });
      it('should return white deselected rows for non selected records', function () {
        var mockNonSelectedRecord = {id: 5};
        var background = scope.getClassesForMoveSelectedRow(mockNonSelectedRecord, 'background');
        var buttonIcon = scope.getClassesForMoveSelectedRow(mockNonSelectedRecord, 'buttonIcon');
        expect(background).toEqual('');
        expect(buttonIcon).toEqual('fa fa-circle-thin');
      });
    });
  });

});
