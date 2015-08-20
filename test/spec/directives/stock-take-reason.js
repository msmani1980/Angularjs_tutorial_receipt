'use strict';

describe('Directive: stockTakeReason', function() {

  // load the directive's module
  beforeEach(module('ts5App', 'template-module'));

  var element;
  var controller;
  var scope;
  var stockAdjustmentsService;
  var adjustStockDeferred;
  var mockStockItem;

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
    mockStockItem = {
      id: 1,
      currentCountQuantity: 900,
      masterItemId: 2,
      catererStationId: 4
    };
    scope.stockTakeReasonOpen(mockStockItem);
    scope.$digest();
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
      it('should be defined', function() {
        expect(scope.stockTakeReasonOpen).toBeDefined();
      });

      it('should set scope.id equal to mockStockItem.id', function() {
        expect(scope.id).toEqual(mockStockItem.id);
      });

      it('should set scope.currentCountQuantity equal to mockStockItem.currentCountQuantity', function() {
        expect(scope.currentCountQuantityQuantity).toEqual(mockStockItem.currentCountQuantityQuantity);
      });

      it('should set scope.masterItemId equal to mockStockItem.masterItemId', function(){
        expect(scope.masterItemId).toEqual(mockStockItem.masterItemId);
      });

      it('should set scope.catererStationId equal to mockStockItem.catererStationId', function(){
        expect(scope.catererStationId).toEqual(mockStockItem.catererStationId);
      });

    });

    describe('stockTakeReasonClose', function() {

      it('should be defined', function() {
        expect(scope.stockTakeReasonClose).toBeDefined();
      });

      it('should call clearScopeVars', function(){
        spyOn(scope, 'clearScopeVars').and.callThrough();
        scope.stockTakeReasonClose();
        expect(scope.clearScopeVars).toHaveBeenCalled();
      });

    });

    describe('clearScopeVars scope function', function(){

      beforeEach(function(){
        scope.clearScopeVars();
      });

      it('should set scope.id to null', function(){
        expect(scope.id).toBe(null);
      });

      it('should set scope.comment to null', function(){
        expect(scope.comment).toBe(null);
      });

      it('should set scope.currentCountQuantity to null', function(){
        expect(scope.currentCountQuantity).toBe(null);
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

      var mockComment = 'My test comment';
      var mockNewCount = '902';
      var mockStockAdjustmentReason = {1:{companyReasonTypeId:32, companyReasonCodeName:'Test'}};

      it('should be defined', function() {
        expect(scope.stockTakeReasonSave).toBeDefined();
      });

      beforeEach(function(){
        spyOn(scope, 'clearScopeVars').and.callThrough();
        scope.stockAdjustmentReason = mockStockAdjustmentReason;
        scope.comment = mockComment;
        scope.newCount = mockNewCount;
        scope.stockTakeReasonSave();
      });

      it('should call clearScopeVars', function() {
        expect(scope.clearScopeVars).toHaveBeenCalled();
      });

      it('should call stockAdjustmentsService.adjustStock API with mocked payload', function(){
        var mockPayload = {
          catererStationId: mockStockItem.catererStationId,
          masterItemId : mockStockItem.masterItemId,
          quantity: parseInt(mockNewCount),
          companyReasonCodeId: mockStockAdjustmentReason[1].companyReasonTypeId,
          note: mockComment
        };
        expect(stockAdjustmentsService.adjustStock).toHaveBeenCalledWith(mockPayload);
      });

    });

  });

});
