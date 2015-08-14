'use strict';

describe('Directive: stockTakeReason', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element;
  var controller;
  var scope;
  var stockAdjustmentsService;
  var adjustStockDeferred;

  beforeEach(inject(function($rootScope, $compile, $injector, $q) {
    scope = $rootScope;
    stockAdjustmentsService = $injector.get('stockAdjustmentsService');
    element = angular.element('<stock-take-reason></stock-take-reason>');
    element = $compile(element)(scope);
    scope.$digest();
    controller = element.controller('stockTakeReason');
    adjustStockDeferred = $q.defer();
    adjustStockDeferred.resolve({response:200});
    spyOn(stockAdjustmentsService, 'adjustStock').and.returnValue(adjustStockDeferred.promise);
  }));

  describe('When the stock take modal directive is compiled, it',function() {

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
      beforeEach(inject(function() {
        scope.stockTakeReasonOpen(1, 900, 2, 4);
        scope.$digest();
      }));

      it('should be defined', function() {
        expect(scope.stockTakeReasonOpen).toBeDefined();
      });

      it('should set scope.id', function() {
        expect(scope.id).toEqual(1);
      });

      it('should set scope.currentCount to equal 900', function() {
        expect(scope.currentCount).toEqual(900);
      });
      it('should set scope.masterItemId equal to 2', function(){
        expect(scope.masterItemId).toEqual(2);
      });
      it('should set scope.catererStationId equal to 4', function(){
        expect(scope.catererStationId).toEqual(4);
      });

    });

    describe('stockTakeReasonClose', function() {
      beforeEach(inject(function() {
        scope.stockTakeReasonOpen(1, 900, 2, 4);
        scope.$digest();
      }));

      it('should be defined', function() {
        expect(scope.stockTakeReasonClose).toBeDefined();
      });

      it('should set id to null', function() {
        scope.stockTakeReasonClose();
        scope.$digest();
        expect(scope.id).toEqual(null);
      });

      it('should set comment to null', function() {
        scope.stockTakeReasonClose();
        scope.$digest();
        expect(scope.comment).toEqual(null);
      });

      it('should set currentCount to null', function() {
        scope.stockTakeReasonClose();
        scope.$digest();
        expect(scope.currentCount).toEqual(null);
      });

    });

    describe('clearScopeVars scope function', function(){
      beforeEach(function(){
        scope.stockTakeReasonOpen(1, 900, 2, 4);
        scope.$digest();
        scope.clearScopeVars();
      });
      it('should set scope.id to null', function(){
        expect(scope.id).toBe(null);
      });
      it('should set scope.comment to null', function(){
        expect(scope.comment).toBe(null);
      });
      it('should set scope.currentCount to null', function(){
        expect(scope.currentCount).toBe(null);
      });
      it('should set scope.newCount to null', function(){
        expect(scope.newCount).toBe(null);
      });
      it('should set scope.masterItemId to null', function(){
        expect(scope.masterItemId).toBe(null);
      });
      it('should set scope.catererStationId to null', function(){
        expect(scope.catererStationId).toBe(null);
      });
    });

    describe('stockTakeReasonSave', function() {
      it('should be defined', function() {
        expect(scope.stockTakeReasonSave).toBeDefined();
      });
      beforeEach(function(){
        spyOn(scope, 'clearScopeVars').and.callThrough();
        scope.stockTakeReasonOpen(1, 900, 2, 4);
        scope.$digest();
        scope.stockAdjustmentReason = [];
        scope.stockAdjustmentReason[1] = {companyReasonTypeId:32, companyReasonCodeName:'Test'};
        scope.comment = 'My test comment';
        scope.newCount = '902';
        scope.stockTakeReasonSave();
      });
      it('should call clearScopeVars', function() {
        expect(scope.clearScopeVars).toHaveBeenCalled();
      });
      it('should call stockAdjustmentsService.adjustStock API', function(){
        var mockPayload = {
          catererStationId: 4,
          masterItemId : 2,
          quantity: 902,
          companyReasonCodeId: 32,
          note: 'My test comment'
        };
        expect(stockAdjustmentsService.adjustStock).toHaveBeenCalledWith(mockPayload);
      });
    });

  });

});
