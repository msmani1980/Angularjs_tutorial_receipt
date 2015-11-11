'use strict';

describe('Controller: ReconciliationDiscrepancyDetail', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));

  var scope;
  var ReconciliationDiscrepancyDetail;
  var controller;
  var location;
  var reconciliationFactory;
  var lmpStockDeferred;
  var lmpStockResponseJSON;
  var cashBagsDeferred;
  var cashBagsResponseJSON;
  var getStoreInstanceDetailsDeferred;
  var storeInstanceJSON;
  var routeParams;


  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    location = $location;
    scope = $rootScope.$new();
    reconciliationFactory = $injector.get('reconciliationFactory');
    controller = $controller;

    getStoreInstanceDetailsDeferred = $q.defer();
    getStoreInstanceDetailsDeferred.resolve(storeInstanceJSON);
    spyOn(reconciliationFactory, 'getStoreInstanceDetails').and.returnValue(getStoreInstanceDetailsDeferred.promise);

    lmpStockResponseJSON = [{id: 1}]; // stub for now until API is complete
    lmpStockDeferred = $q.defer();
    lmpStockDeferred.resolve(lmpStockResponseJSON);
    spyOn(reconciliationFactory, 'getLMPStockMockData').and.returnValue(lmpStockDeferred.promise);

    cashBagsResponseJSON = [{id: 2}]; // stub for now until API is complete
    cashBagsDeferred = $q.defer();
    cashBagsDeferred.resolve(cashBagsResponseJSON);
    spyOn(reconciliationFactory, 'getCashBagMockData').and.returnValue(cashBagsDeferred.promise);

    routeParams = {
      storeInstanceId: 'fakeStoreInstanceId'
    };
    ReconciliationDiscrepancyDetail = controller('ReconciliationDiscrepancyDetail', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));


  describe('init', function () {

    it('should call getStoreInstanceDetails', function () {
      expect(reconciliationFactory.getStoreInstanceDetails).toHaveBeenCalledWith(routeParams.storeInstanceId);
    });

    describe('init', function () {
      beforeEach(function () {
        scope.$digest();
      });

      it('should call get LMP stock data', function () {
        expect(reconciliationFactory.getLMPStockMockData).toHaveBeenCalled();
        expect(scope.LMPStock).toBeDefined();
      });

      it('should call get cash bag data', function () {
        expect(reconciliationFactory.getCashBagMockData).toHaveBeenCalled();
        expect(scope.cashBags).toBeDefined();
      });

      it('should init tables to only show discrepancies', function () {
        expect(scope.showLMPDiscrepancies).toEqual(true);
        expect(scope.showCashBagDiscrepancies).toEqual(true);
      });

      it('should init tables to not be in edit mode', function () {
        expect(scope.editLMPStockTable).toEqual(false);
        expect(scope.editCashBagTable).toEqual(false);
      });

      it('should init each object with a revision object for editing', function () {
        expect(scope.LMPStock[0].revision).toBeDefined();
        expect(scope.LMPStock[0].revision.itemName).toEqual(scope.LMPStock[0].itemName);
        expect(scope.LMPStock[0].revision).toBeDefined();
        expect(scope.LMPStock[0].revision.cashBagName).toEqual(scope.LMPStock[0].cashBagName);
      });
    });

  });

  describe('edit table functions', function () {
    describe('row editing', function () {
      var mockItem;

      describe('edit init', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2
          };
          scope.$digest();
        });
        it('should set item.isEditing to true', function () {
          scope.editItem(mockItem);
          expect(mockItem.isEditing).toEqual(true);
        });
        it('should init item revision to equal current item properties', function () {
          var expectedRevisionObject = angular.copy(mockItem);
          scope.editItem(mockItem);
          expect(mockItem.revision).toEqual(expectedRevisionObject);
        });
      });

      describe('saveItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2
          };
          scope.editItem(mockItem);
          mockItem.revision = {
            itemName: 'newName',
            quantity: 3
          };
          scope.saveItem(mockItem);
          scope.$digest();
        });
        it('should set item properties to revision properties', function () {
          expect(mockItem.itemName).toEqual('newName');
          expect(mockItem.quantity).toEqual(3);
        });
        it('should item.isEditing to false', function () {
          expect(mockItem.isEditing).toEqual(false);
        });
        it('should clear revision object', function () {
          expect(mockItem.revision).toEqual({});
        });
      });

      describe('revertItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2,
            isEditing: true,
            revision: {
              itemName: 'newItem',
              quantity: 3
            }
          };
          scope.revertItem(mockItem);
          scope.$digest();
        });
        it('should revert revision properties to original properties', function () {
          expect(mockItem.revision.itemName).toEqual('testItem');
          expect(mockItem.revision.quantity).toEqual(2);
        });
        it('should not change item.isEditing property', function () {
          expect(mockItem.isEditing).toEqual(true);
        });
      });

      describe('cancelEditItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2,
            isEditing: true,
            revision: {
              itemName: 'newItem',
              quantity: 3
            }
          };
          scope.cancelEditItem(mockItem, true);
          scope.$digest();
        });
        it('should set item.isEditing to false', function () {
          expect(mockItem.isEditing).toEqual(false);
        });
        it('should not save item.revision properties', function () {
          expect(mockItem.revision).toEqual({});
        });
      });
    });

    describe('table editing', function () {
      describe('edit init', function () {
        beforeEach(function () {
          scope.LMPStock = [{
            itemName: 'item1',
            quantity: 1
          }, {
            itemName: 'item2',
            quantity: 2
          }];
          scope.cashBags = angular.copy(scope.LMPStock);
        });
        it('should put table in edit mode', function () {
          scope.initEditTable(true);
          expect(scope.editLMPStockTable).toEqual(true);
        });
        it('should init revisions to equal current data', function () {
          var expectedRevisionObject = angular.copy(scope.LMPStock[0]);
          scope.initEditTable(true);
          expect(scope.LMPStock[0].revision).toEqual(expectedRevisionObject);
        });
        it('should make changes to cash bag table if isLMPTable is false', function () {
          var expectedRevisionObject = angular.copy(scope.cashBags[0]);
          scope.initEditTable(false);
          expect(scope.editCashBagTable).toEqual(true);
          expect(scope.cashBags[0].revision).toEqual(expectedRevisionObject);
        });
      });

      describe('save', function () {
        beforeEach(function () {
          scope.LMPStock = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }, {
            itemName: 'item2',
            quantity: 2,
            revision: {
              itemName: 'newItem2',
              quantity: 4
            }
          }];
          scope.cashBags = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }];
        });
        it('should set all data to revision data', function () {
          scope.saveTable(true);
          expect(scope.LMPStock[0].itemName).toEqual('newItem1');
          expect(scope.LMPStock[0].quantity).toEqual(3);
          expect(scope.LMPStock[1].itemName).toEqual('newItem2');
          expect(scope.LMPStock[1].quantity).toEqual(4);
        });
        it('should revert table to not be in edit mode', function () {
          scope.saveTable(true);
          expect(scope.editLMPStockTable).toEqual(false);
        });
        it('should make expected changes to cashBags object if isLMPTable is false', function () {
          scope.saveTable(false);
          expect(scope.editCashBagTable).toEqual(false);
          expect(scope.cashBags[0].itemName).toEqual('newItem1');
          expect(scope.cashBags[0].quantity).toEqual(3);
        });
      });
      describe('cancel editing table', function () {
        beforeEach(function () {
          scope.LMPStock = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }, {
            itemName: 'item2',
            quantity: 2,
            revision: {
              itemName: 'newItem2',
              quantity: 4
            }
          }];
          scope.cashBags = [{
            itemName: 'item1',
            quantity: 1,
            revision: {
              itemName: 'newItem1',
              quantity: 3
            }
          }];
        });
        it('should clear revision data', function () {
          scope.cancelEditingTable(true);
          expect(scope.LMPStock[0].itemName).toEqual('item1');
          expect(scope.LMPStock[0].quantity).toEqual(1);
          expect(scope.LMPStock[0].revision).toEqual({});
        });
        it('should revert table to not be in edit mode', function () {
          scope.cancelEditingTable(true);
          expect(scope.editLMPStockTable).toEqual(false);
        });
        it('should make expected changes to cashBags object if isLMPTable is false', function () {
          scope.cancelEditingTable(false);
          expect(scope.editCashBagTable).toEqual(false);
          expect(scope.cashBags[0].itemName).toEqual('item1');
          expect(scope.cashBags[0].quantity).toEqual(1);
          expect(scope.cashBags[0].revision).toEqual({});
        });
      });
    });

  });

  describe('scope helper functions', function () {
    describe('update orderBy', function () {
      it('should change sort title to given title', function () {
        scope.LMPSortTitle = 'oldSortName';
        scope.updateOrderBy('newSortName', true);
        expect(scope.LMPSortTitle).toEqual('newSortName');
      });

      it('should not update LMPSortTitle if isLMP is false', function () {
        scope.cashBagSortTitle = 'oldCashSortName';
        scope.LMPSortTitle = 'lmpSortName';
        scope.updateOrderBy('newSortName', false);
        expect(scope.LMPSortTitle).toEqual('lmpSortName');
        expect(scope.cashBagSortTitle).toEqual('newSortName');
      });

      it('should reverse sort direction if already sorting on given name', function () {
        scope.LMPSortTitle = 'sortName';
        scope.updateOrderBy('sortName', true);
        expect(scope.LMPSortTitle).toEqual('-sortName');
      });

    });

    describe('getArrowType', function () {
      it('should return descending if sort title is negative', function () {
        scope.LMPSortTitle = '-sortName';
        var arrowType = scope.getArrowType('sortName', true);
        expect(arrowType).toEqual('descending');
      });
      it('should return ascending if sort title is not negative', function () {
        scope.LMPSortTitle = 'sortName';
        var arrowType = scope.getArrowType('sortName', true);
        expect(arrowType).toEqual('ascending');
      });
      it('should return none if sort title is not the given name', function () {
        scope.LMPSortTitle = 'sortName';
        var arrowType = scope.getArrowType('otherName', true);
        expect(arrowType).toEqual('none');
      });
      it('should check against cashBagSortTitle if isLMP is false', function () {
        scope.LMPSortTitle = 'sortName';
        scope.cashBagSortTitle = 'cashSortName';
        var arrowType = scope.getArrowType('sortName', false);
        expect(arrowType).toEqual('none');
      });
    });

    describe('showEditViewForItem', function () {
      var mockItem;
      beforeEach(function () {
        scope.editLMPStockTable = false;
        scope.editCashBagTable = false;
        mockItem = {
          isEditing: true
        };
      });
      it('should return true if item is editing', function () {
        var showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(true);
        mockItem.isEditing = false;
        showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(false);
      });
      it('should return true if table is editing', function () {
        scope.editLMPStockTable = true;
        mockItem.isEditing = false;
        var showEdit = scope.showEditViewForItem(mockItem, true);
        expect(showEdit).toEqual(true);
      });
      it('should check against cash bag table if isLMP is false', function () {
        scope.editLMPStockTable = false;
        scope.editCashBagTable = true;
        mockItem.isEditing = false;
        var showEdit = scope.showEditViewForItem(mockItem, false);
        expect(showEdit).toEqual(true);
      });
    });

  });

});
