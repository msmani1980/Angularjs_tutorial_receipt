'use strict';

describe('Controller: StockDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stock-management-dashboard.json', 'served/catering-stations.json'));

  var StockDashboardCtrl,
    stockDashboardService,
    catererStationService,
    getStockDashboardItemsDeferred,
    getCatererStationListDeferred,
    stockManagementDashboardJSON,
    cateringStationsJSON,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();

    stockDashboardService = $injector.get('stockDashboardService');
    catererStationService = $injector.get('catererStationService');

    inject(function(_servedStockManagementDashboard_, _servedCateringStations_) {
      stockManagementDashboardJSON = _servedStockManagementDashboard_;
      cateringStationsJSON = _servedCateringStations_;
    });

    getStockDashboardItemsDeferred = $q.defer();
    getStockDashboardItemsDeferred.resolve(stockManagementDashboardJSON);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);

    spyOn(stockDashboardService, 'getStockDashboardItems').and.returnValue(getStockDashboardItemsDeferred.promise);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);

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
      it('should return a list of dashboard items', function() {
        expect(stockDashboardService.getStockDashboardItems).toHaveBeenCalled();
      });

      it('should attach the stock dashboard list to the scope', function() {
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
        spyOn(scope, 'isCatererStationListReadOnly');
      });

      it('should be attached to the scope', function() {
        expect(scope.isCatererStationListReadOnly).toBeDefined();
      });

      it('should be called', function() {
        scope.isCatererStationListReadOnly();
        expect(scope.isCatererStationListReadOnly).toHaveBeenCalled();
      });

      it('should return true if there is only 1 station', function() {
        scope.cateringStationList.length = 1;
        scope.$digest();
        scope.isCatererStationListReadOnly();
        expect(scope.isCatererStationListReadOnly).toBeTruthy();
      });

    });

  });


});
