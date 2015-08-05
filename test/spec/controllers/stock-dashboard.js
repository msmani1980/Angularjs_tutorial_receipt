'use strict';

describe('Controller: StockDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stock-management-dashboard.json'));

  var StockDashboardCtrl,
    stockDashboardService,
    getStockDashboardItemsDeferred,
    stockManagementDashboardJSON,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function(_servedStockManagementDashboard_) {
      stockManagementDashboardJSON = _servedStockManagementDashboard_;
    });
    getStockDashboardItemsDeferred = $q.defer();
    getStockDashboardItemsDeferred.resolve({
      response: 200
    });
    stockDashboardService = $injector.get('stockDashboardService');
    spyOn(stockDashboardService, 'getStockDashboardItems').and.returnValue(getStockDashboardItemsDeferred.promise);
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
      it('should get a list of dashboard items', function() {
        expect(stockDashboardService.getStockDashboardItems).toHaveBeenCalled();
      });
      it('should attach the list to the scope', function() {
        expect(scope.stockDashboardItemsList).toBeDefined();
      });
    });


  });


});
