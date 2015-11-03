'use strict';

describe('Controller: ReconciliationDiscrepancyDetail', function () {

  beforeEach(module('ts5App'));

  var scope;
  var ReconciliationDiscrepancyDetail;
  var controller;
  var location;
  //var reconciliationFactory;

  beforeEach(inject(function ($q, $controller, $rootScope, $location) {
    location = $location;
    scope = $rootScope.$new();
    //reconciliationFactory = $injector.get('reconciliationFactory');
    controller = $controller;
    ReconciliationDiscrepancyDetail = controller('ReconciliationDiscrepancyDetail', {
      $scope: scope,
      $routeParams: {
        id: 2
      }
    });
  }));


  describe('init', function () {
    it('should call get LMP stock data', function () {
      // expect(reconciliationFactory.getLMPSTockData).toHaveBeenCalled();
    });

    it('should call get cash bag data', function () {
      // expect(reconciliationFactory.getCashBagData).toHaveBeenCalled();
    });

    it('should init tables to only show discrepancies', function () {
      expect(scope.showLMPDiscrepancies).toEqual(true);
      expect(scope.showCashBagDiscrepancies).toEqual(true);
    });

    it('should init tables to not be in edit mode', function () {
      expect(scope.editLMPStockTable).toEqual(true);
      expect(scope.editCashBagTable).toEqual(true);
    });

    it('should init each object with a revision object for editing', function () {
      expect(scope.LMPStock[0].revision).toBeDefined();
      expect(scope.LMPStock[0].revision.itemName).toEqual(scope.LMPStock[0].itemName);
      expect(scope.LMPStock[0].revision).toBeDefined();
      expect(scope.LMPStock[0].revision.cashBagName).toEqual(scope.LMPStock[0].cashBagName);
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
        })
      });

      describe('revertItem', function () {
        beforeEach(function () {
          mockItem = {
            itemName: 'testItem',
            quantity: 2,
            isEditing: true,
            revision:{
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
            revision:{
              itemName: 'newItem',
              quantity: 3
            }
          };
          scope.cancelEditItem(mockItem);
          scope.$digest();
        });
        it('should set item.isEditing to false', function () {
          expect(mockItem.isEditing).toEqual(false);
        });
        it('should not save item.revision properties', function () {
          expect(mockItem.revision.itemName).toEqual('testItem');
          expect(mockItem.revision.quantity).toEqual(2);
        });
      });
    });

    describe('enable table editing', function () {
      describe('edit init', function () {
        beforeEach(function () {
          scope.LMPStock = [{
            itemName: 'item1',
            quantity: 1
          }, {
            itemName: 'item2',
            quantity: 2
          }];
        });
        it('should put table in edit mode', function () {
          scope.initEditLMPStockTable();
          expect(scope.editLMPStockTable).toEqual(true);
        });

        it('should init revisions to equal current data', function () {
          var expectedRevisionObject = angular.copy(scope.LMPStock[0]);
          scope.initEditLMPStockTable();
          scope.$digest();
          expect(scope.LMPStock[0].revision).toEqual(expectedRevisionObject);
        });
      });

      fdescribe('save', function () {
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
        });
        it('should set all data to revision data', function () {
          scope.saveLMPStockTable();
          expect(scope.LMPStock[0].itemName).toEqual('newItem1');
          expect(scope.LMPStock[0].quantity).toEqual(3);
          expect(scope.LMPStock[1].itemName).toEqual('newItem2');
          expect(scope.LMPStock[1].quantity).toEqual(4);
        });
        it('should revert table to not be in edit mode', function () {
          scope.saveLMPStockTable();
          expect(scope.editLMPStockTable).toEqual(false);
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
        });
        it('should clear revision data', function () {
          scope.cancelEditingLMPStockTable();
          expect(scope.LMPStock[0].itemName).toEqual('item1');
          expect(scope.LMPStock[0].quantity).toEqual(1);
          expect(scope.LMPStock[0].revision).toEqual({});
        });
        it('should revert table to not be in edit mode', function () {
          scope.cancelEditingLMPStockTable();
          expect(scope.editLMPStockTable).toEqual(false);
        });
      });
    });

  });

  describe('scope helper functions', function () {

  });

});
