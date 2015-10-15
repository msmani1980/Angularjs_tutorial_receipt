'use strict';
/*global moment*/

describe('Controller: StockDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App','config'));
  beforeEach(module(
    'served/stock-management-dashboard.json',
    'served/catering-stations.json',
    'served/company-reason-codes.json',
    'served/stock-take-list.json'
  ));

  var StockDashboardCtrl,
    stockDashboardService,
    catererStationService,
    companyReasonCodesService,
    getStockDashboardItemsDeferred,
    getCatererStationListDeferred,
    getCompanyReasonCodesDeferred,
    stockManagementDashboardJSON,
    cateringStationsJSON,
    companyReasonCodesJSON,
    stockTakeService,
    stockTakeListJOSN,
    getStockTakeListDeferred,
    scope,
    http,
    ENV;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    http = $injector.get('$http');
    ENV = $injector.get('ENV');
    stockDashboardService = $injector.get('stockDashboardService');
    catererStationService = $injector.get('catererStationService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');
    stockTakeService = $injector.get('stockTakeService');

    inject(function(_servedStockManagementDashboard_, _servedCateringStations_,
      _servedStockTakeList_, _servedCompanyReasonCodes_) {
      stockManagementDashboardJSON = _servedStockManagementDashboard_;
      cateringStationsJSON = _servedCateringStations_;
      companyReasonCodesJSON = _servedCompanyReasonCodes_;
      stockTakeListJOSN = _servedStockTakeList_;
    });

    getStockTakeListDeferred = $q.defer();
    getStockTakeListDeferred.resolve(stockTakeListJOSN);
    spyOn(stockTakeService, 'getStockTakeList').and.returnValue(
      getStockTakeListDeferred.promise);

    getStockDashboardItemsDeferred = $q.defer();
    getStockDashboardItemsDeferred.resolve(stockManagementDashboardJSON);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(companyReasonCodesJSON);

    spyOn(stockDashboardService, 'getStockDashboardItems').and.returnValue(getStockDashboardItemsDeferred.promise);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);
    spyOn(companyReasonCodesService, 'getAll').and.returnValue(getCompanyReasonCodesDeferred.promise);

    StockDashboardCtrl = $controller('StockDashboardCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
    scope.$digest();
  }));

  describe('StockDashboardCtrl', function() {

    it('should be defined', function() {
      expect(StockDashboardCtrl).toBeDefined();
    });

    it('should have a view name attached to scope', function() {
      expect(scope.viewName).toBeDefined();
    });

    describe('API Calls', function() {
      it('updateStockItems should be defined', function() {
        expect(scope.updateStockItems).toBeDefined();
      });

      it('should return a list of dashboard items', function() {
        scope.selectedCateringStation = {
          id: 1,
          name:'fakeCateringStation'
        };
        scope.$digest();
        expect(stockDashboardService.getStockDashboardItems).toHaveBeenCalled();
      });

      it('should attach the stock dashboard list to the scope', function() {
        scope.selectedCateringStation = {
          id: 1,
          name:'fakeCateringStation'
        };
        scope.$digest();
        expect(scope.stockDashboardItemsList).toBeDefined();
      });

      it('should return a list of Catering Stations', function() {
        expect(catererStationService.getCatererStationList).toHaveBeenCalled();
      });

      it('should attach the catering station list to the scope', function() {
        expect(scope.cateringStationList).toBeDefined();
      });

    });

    describe('isCatererStationListReadOnly method', function() {
      beforeEach(function() {
        spyOn(scope, 'isCatererStationListReadOnly').and.callThrough();
      });

      it('should be attached to the scope', function() {
        expect(scope.isCatererStationListReadOnly).toBeDefined();
      });

      it('should be called', function() {
        scope.isCatererStationListReadOnly();
        expect(scope.isCatererStationListReadOnly).toHaveBeenCalled();
      });

      it('should define cateringStationList', function() {
        expect(scope.cateringStationList).toBeDefined();
      });

      it('should return true if there is only 1 station', function() {
        scope.isCatererStationListReadOnly();
        expect(scope.isCatererStationListReadOnly).toBeTruthy();
      });

      it('should return false if cateringStationList is null', function() {
        scope.cateringStationList = null;
        scope.isCatererStationListReadOnly();
        scope.$digest();
        expect(scope.cateringStationList).toBe(null);
      });

    });

    describe('todaysDate', function() {
      it('variable should be set in scope', function() {
        expect(scope.todaysDate).toBeDefined();
      });

      it('variable should be populated with date', function() {
        expect(scope.todaysDate.length).toEqual(10);
      });

    });

    describe('displayLoadingModal', function() {
      beforeEach(function() {
        spyOn(StockDashboardCtrl, 'displayLoadingModal');
      });

      it('should be defined', function() {
        expect(StockDashboardCtrl.displayLoadingModal).toBeDefined();
      });

      it('should be called', function() {
        StockDashboardCtrl.displayLoadingModal();
        expect(StockDashboardCtrl.displayLoadingModal).toHaveBeenCalled();
      });

    });

    describe('hideLoadingModal', function() {
      beforeEach(function() {
        spyOn(StockDashboardCtrl, 'hideLoadingModal');
      });

      it('should be defined', function() {
        expect(StockDashboardCtrl.hideLoadingModal).toBeDefined();
      });

      it('should be called', function() {
        StockDashboardCtrl.hideLoadingModal();
        expect(StockDashboardCtrl.hideLoadingModal).toHaveBeenCalled();
      });

    });

    describe('isCurrentCountMismatched method', function() {

      it('should return true if current count is different from expected', function() {
        var stockItemTrue = {
          openingQuantity: 5,
          receivedQuantity: 5,
          dispatchedQuantity: 0,
          currentCountQuantity: 11
        };
        expect(scope.isCurrentCountMismatched(stockItemTrue)).toBeTruthy();
      });

      it('should return false if current count is same as expected', function() {
        var stockItemFalse = {
          openingQuantity: 5,
          receivedQuantity: 5,
          dispatchedQuantity: 0,
          currentCountQuantity: 10
        };
        expect(scope.isCurrentCountMismatched(stockItemFalse)).toBeFalsy();
      });

    });

    describe('isRecordUpdatedToday method', function() {
      it('should return true if date is today', function() {

        var stockItemTrue = {
          lastUpdatedOn: moment().format('YYYY/MM/DD')
        };
        expect(scope.isRecordUpdatedToday(stockItemTrue)).toBe(true);
      });

      it('should return false if current count is same as expected', function() {
        var stockItemFalse = {
          lastUpdatedOn: '2011-09-23 14:39:06.134748'
        };
        expect(scope.isRecordUpdatedToday(stockItemFalse)).toBe(false);
      });

    });

    describe('setting the exportURL', function() {

      var urlControl;
      beforeEach(function() {
        scope.selectedCateringStation = cateringStationsJSON.response[0];
        urlControl = ENV.apiUrl + '/api/stock-management/dashboard/' + scope.selectedCateringStation.id;
        urlControl += '/file/export?sessionToken=9e85ffbb3b92134fbf39a0c366bd3f12f0f5';
      });

      it('set the exportURL when the catering station is selected', function() {
        expect(scope.exportURL).toBeUndefined();
        scope.$digest();
        expect(scope.exportURL).toBeDefined();
      });

      it('set the correct export URL when the station is selected', function() {
        scope.$digest();
        expect(scope.exportURL).toEqual(urlControl);
      });

      it('set change the URL is the station is changed', function() {
        scope.selectedCateringStation = cateringStationsJSON.response[1];
        scope.$digest();
        expect(scope.exportURL).not.toEqual(urlControl);
        var newURL = ENV.apiUrl + '/api/stock-management/dashboard/' + scope.selectedCateringStation.id;
        newURL += '/file/export?sessionToken=9e85ffbb3b92134fbf39a0c366bd3f12f0f5';
        expect(scope.exportURL).toEqual(newURL);
      });

    });

    describe('when a user selects a station', function() {

      it('should have an empty stock take list before the scope is digested', function () {
        expect(scope.stockTakeList).toEqual([]);
      });

      describe('The stockTakeList array', function () {

        beforeEach(function() {
          spyOn(StockDashboardCtrl, 'getStockTakeList').and.callThrough();
          spyOn(StockDashboardCtrl, 'getStockTakeListSuccessHandler').and.callThrough();
          scope.selectedCateringStation = cateringStationsJSON.response[0];
          scope.$digest();
        });

        it('should call the getStockTakeList method', function () {
          expect(StockDashboardCtrl.getStockTakeList).toHaveBeenCalled();
        });

        it('should call the getStockTakeListSuccessHandler method', function () {
          expect(StockDashboardCtrl.getStockTakeListSuccessHandler).toHaveBeenCalled();
        });

        it('should have (1) or more stations in the stockTakeList', function () {
          expect(scope.stockTakeList.length).toBeGreaterThan(0);
        });

        it('should be match the stock take list from the delivertNotes API Respone',function () {
          expect(scope.stockTakeList).toEqual(stockTakeListJOSN.response);
        });

      });

    });

  });

  describe('canCreateStockTake functionality', function () {

    it('should return false by default', function(){
      expect(scope.canCreateStockTake()).toBeFalsy();
    });

    it('should return false even if the catering station is selected but there is an open stock take', function(){
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeFalsy();
    });

    it('should return true if the catering station is selected and there is not open stock take', function(){
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      scope.stockTakeList[0].isSubmitted = true;
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeTruthy();
    });

    it('should return true if no stock takes were returned', function(){
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      scope.stockTakeList = [];
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeTruthy();
    });

  });

});
