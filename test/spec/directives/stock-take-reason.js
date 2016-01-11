'use strict';

describe('Directive: stockTakeReason', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element;
  var controller;
  var scope;
  var stockManagementStationItemsService;
  var updateStockManagementStationItemsDeferred;
  var mockStockItem;

  beforeEach(inject(function($rootScope, $compile, $injector, $q) {
    scope = $rootScope;
    stockManagementStationItemsService = $injector.get('stockManagementStationItemsService');
    element = angular.element('<stock-take-reason></stock-take-reason>');
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('stockTakeReason');
    updateStockManagementStationItemsDeferred = $q.defer();
    updateStockManagementStationItemsDeferred.resolve({
      response: 200
    });
    spyOn(stockManagementStationItemsService, 'updateStockManagementStationItems').and.returnValue(updateStockManagementStationItemsDeferred.promise);
    mockStockItem = {
      id: 1,
      currentQuantity: 900,
      ullageQuantity: 901,
      itemMasterId: 2,
      stationId: 4
    };
  }));

  describe('When stockTakeReasonOpen is called for Count', function() {
    beforeEach(function() {
      scope.stockTakeReasonOpen(mockStockItem, 'Count');
      scope.$digest();
    });

    describe('When the stock take modal directive is compiled, it', function() {

      it('should inject the directive', function() {
        expect(element).toBeDefined();
      });

      it('should contain an element with a modal class', function() {
        expect(element.find('.modal')).toBeDefined();
      });

      it('should contain an element with a fade class', function() {
        expect(element.find('.fade')).toBeDefined();
      });

      it('should have a modal-content element', function() {
        expect(element.find('.modal-content')).toBeDefined();
      });

      it('should have a modal-body element', function() {
        expect(element.find('.modal-body')).toBeDefined();
      });

      it('should have a modal-footer element', function() {
        expect(element.find('.modal-footer')).toBeDefined();
      });

      it('should have a leave button', function() {
        expect(element.find('.btn-default')).toBeDefined();
      });

    });

    describe('When the directives controller is accessed, it', function() {

      it('should be defined', function() {
        expect(controller).toBeDefined();
      });

      describe('stockTakeReasonOpen', function() {
        it('should be defined', function() {
          expect(scope.stockTakeReasonOpen).toBeDefined();
        });

        it('should set scope.currentStockItem equal to mockStockItem', function() {
          expect(scope.currentStockItem).toEqual(mockStockItem);
        });

        it('should set scope.quantityType equal to Count', function() {
          expect(scope.quantityType).toEqual('Count');
        });

        it('should set scope.currentQuantity equal to mockStockItem.currentQuantity', function() {
          expect(scope.currentQuantity).toEqual(mockStockItem.currentQuantity);
        });
      });

      describe('stockTakeReasonClose', function() {

        it('should be defined', function() {
          expect(scope.stockTakeReasonClose).toBeDefined();
        });

        it('should call clearScopeVars', function() {
          spyOn(scope, 'clearScopeVars').and.callThrough();
          scope.stockTakeReasonClose();
          expect(scope.clearScopeVars).toHaveBeenCalled();
        });

      });

      describe('clearScopeVars scope function', function() {

        beforeEach(function() {
          scope.clearScopeVars();
        });

        it('should set scope.id to null', function() {
          expect(scope.currentStockItem).toBe(null);
        });

        it('should set scope.comment to null', function() {
          expect(scope.comment).toBe(null);
        });

        it('should set scope.currentCountQuantity to null', function() {
          expect(scope.quantityType).toBe(null);
        });

        it('should set scope.newCount to null', function() {
          expect(scope.newCount).toBe(null);
        });

        it('should set scope.stockAdjustmentReason to null', function() {
          expect(scope.stockAdjustmentReason).toBe(null);
        });

      });

      describe('stockTakeReasonSave', function() {

        var mockComment = 'My test comment';
        var mockNewCount = '902';
        var mockStockAdjustmentReason = {
          1: {
            companyReasonTypeId: 32,
            companyReasonCodeName: 'Test'
          }
        };

        it('should be defined', function() {
          expect(scope.stockTakeReasonSave).toBeDefined();
        });

        beforeEach(function() {
          spyOn(scope, 'clearScopeVars').and.callThrough();
          scope.stockAdjustmentReason = mockStockAdjustmentReason;
          scope.comment = mockComment;
          scope.newCount = mockNewCount;
          scope.currentUllageQuantity = mockStockItem.ullageQuantity;
          scope.stockTakeReasonSave();
        });

        it('should call clearScopeVars', function() {
          expect(scope.clearScopeVars).toHaveBeenCalled();
        });

        it('should call stockManagementStationItemsService.updateStockManagementStationItems API with mocked payload', function() {
          var mockPayload = {
            id: mockStockItem.id,
            stationId: mockStockItem.stationId,
            itemMasterId: mockStockItem.itemMasterId,
            currentQuantity: parseInt(mockNewCount),
            ullageQuantity: mockStockItem.ullageQuantity,
            companyReasonCodeId: mockStockAdjustmentReason.id,
            note: mockComment
          };
          expect(stockManagementStationItemsService.updateStockManagementStationItems).toHaveBeenCalledWith(1, mockPayload);
        });

      });

    });

    describe('stockTakeReasonSave', function() {

      var mockComment = 'My test comment';
      var mockNewCount = '902';
      var mockStockAdjustmentReason = {
        1: {
          companyReasonTypeId: 32,
          companyReasonCodeName: 'Test'
        }
      };

      it('should be defined', function() {
        expect(scope.stockTakeReasonSave).toBeDefined();
      });

      beforeEach(function() {
        spyOn(scope, 'clearScopeVars').and.callThrough();
        scope.stockAdjustmentReason = mockStockAdjustmentReason;
        scope.comment = mockComment;
        scope.newCount = mockNewCount;
        scope.currentUllageQuantity = mockStockItem.ullageQuantity;
        scope.stockTakeReasonSave();
      });

      it('should call clearScopeVars', function() {
        expect(scope.clearScopeVars).toHaveBeenCalled();
      });

      it('should call stockManagementStationItemsService.updateStockManagementStationItems API with mocked payload', function() {
        var mockPayload = {
          id: mockStockItem.id,
          stationId: mockStockItem.stationId,
          itemMasterId: mockStockItem.itemMasterId,
          currentQuantity: parseInt(mockNewCount),
          ullageQuantity: mockStockItem.ullageQuantity,
          companyReasonCodeId: mockStockAdjustmentReason.id,
          note: mockComment
        };
        expect(stockManagementStationItemsService.updateStockManagementStationItems).toHaveBeenCalledWith(1, mockPayload);
      });

    });
  });

  describe('When stockTakeReasonOpen is called for Ullage', function() {
    beforeEach(function() {
      scope.stockTakeReasonOpen(mockStockItem, 'Ullage');
      scope.$digest();
    });

    describe('When the directives controller is accessed, it', function() {

      it('should be defined', function() {
        expect(controller).toBeDefined();
      });

      describe('stockTakeReasonOpen', function() {
        it('should be defined', function() {
          expect(scope.stockTakeReasonOpen).toBeDefined();
        });

        it('should set scope.currentStockItem equal to mockStockItem', function() {
          expect(scope.currentStockItem).toEqual(mockStockItem);
        });

        it('should set scope.quantityType equal to Count', function() {
          expect(scope.quantityType).toEqual('Ullage');
        });

        it('should set scope.currentQuantity equal to mockStockItem.currentQuantity', function() {
          expect(scope.currentQuantity).toEqual(mockStockItem.ullageQuantity);
        });
      });
    });

    describe('stockTakeReasonSave', function() {

      var mockComment = 'My test comment';
      var mockNewCount = '902';
      var mockStockAdjustmentReason = {
        1: {
          companyReasonTypeId: 32,
          companyReasonCodeName: 'Test'
        }
      };

      beforeEach(function() {
        spyOn(scope, 'clearScopeVars').and.callThrough();
        scope.stockAdjustmentReason = mockStockAdjustmentReason;
        scope.comment = mockComment;
        scope.newCount = mockNewCount;
        scope.currentUllageQuantity = mockStockItem.ullageQuantity;
        scope.stockTakeReasonSave();
      });

      it('should call clearScopeVars', function() {
        expect(scope.clearScopeVars).toHaveBeenCalled();
      });

      it('should call stockManagementStationItemsService.updateStockManagementStationItems API with mocked payload', function() {
        var mockPayload = {
          id: mockStockItem.id,
          stationId: mockStockItem.stationId,
          itemMasterId: mockStockItem.itemMasterId,
          currentQuantity: mockStockItem.currentQuantity,
          ullageQuantity: parseInt(mockNewCount),
          companyReasonCodeId: mockStockAdjustmentReason.id,
          note: mockComment
        };
        expect(stockManagementStationItemsService.updateStockManagementStationItems).toHaveBeenCalledWith(1, mockPayload);
      });

    });
  });

});
