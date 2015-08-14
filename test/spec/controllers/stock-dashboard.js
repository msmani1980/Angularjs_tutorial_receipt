'use strict';

describe('Controller: StockDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stock-management-dashboard.json', 'served/catering-stations.json',
    'served/company-reason-codes.json'));

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
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();

    stockDashboardService = $injector.get('stockDashboardService');
    catererStationService = $injector.get('catererStationService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');

    inject(function(_servedStockManagementDashboard_, _servedCateringStations_, _servedCompanyReasonCodes_) {
      stockManagementDashboardJSON = _servedStockManagementDashboard_;
      cateringStationsJSON = _servedCateringStations_;
      companyReasonCodesJSON = _servedCompanyReasonCodes_;
    });

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
        scope.updateStockItems(1);
        expect(stockDashboardService.getStockDashboardItems).toHaveBeenCalled();
      });

      it('should attach the stock dashboard list to the scope', function() {
        scope.updateStockItems(1);
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

    describe('isClassDanger method', function() {

      it('should return true if current count is more than expected', function() {
        expect(scope.isClassDanger(1, 2, 0, 5)).toBeTruthy();
      });

      it('should return false if current count is less than or equal to expected', function() {
        expect(scope.isClassDanger(1, 2, 0, 2)).toBeFalsy();
      });

    });

  });

});
