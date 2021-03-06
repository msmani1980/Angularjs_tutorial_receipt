'use strict';
/*global moment*/

describe('Controller: StockDashboardCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('config'));
  beforeEach(module('served/stock-management-dashboard.json'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/company-reason-codes.json'));
  beforeEach(module('served/stock-take-list.json'));

  var StockDashboardCtrl;
  var stockManagementStationItemsService;
  var catererStationService;
  var companyReasonCodesService;
  var globalMenuService;
  var mockCompanyId;
  var getStockManagementStationItemsDeferred;
  var getCatererStationListDeferred;
  var getCompanyReasonCodesDeferred;
  var stockManagementDashboardJSON;
  var cateringStationsJSON;
  var companyReasonCodesJSON;
  var stockTakeService;
  var stockTakeListJOSN;
  var getStockTakeListDeferred;
  var scope;
  var http;
  var ENV;
  var identityAccessFactory;

  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    http = $injector.get('$http');
    ENV = $injector.get('ENV');
    stockManagementStationItemsService = $injector.get('stockManagementStationItemsService');
    catererStationService = $injector.get('catererStationService');
    companyReasonCodesService = $injector.get('companyReasonCodesService');
    stockTakeService = $injector.get('stockTakeService');
    identityAccessFactory = $injector.get('identityAccessFactory');
    globalMenuService = $injector.get('globalMenuService');

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

    getStockManagementStationItemsDeferred = $q.defer();
    getStockManagementStationItemsDeferred.resolve(stockManagementDashboardJSON);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(companyReasonCodesJSON);

    spyOn(stockManagementStationItemsService, 'getStockManagementStationItems').and.returnValue(
      getStockManagementStationItemsDeferred.promise);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);
    spyOn(companyReasonCodesService, 'getAll').and.returnValue(getCompanyReasonCodesDeferred.promise);
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({
      sessionToken: 'fakeSessionToken'
    });

    mockCompanyId = 123;
    spyOn(globalMenuService.company, 'get').and.returnValue(mockCompanyId);

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
          name: 'fakeCateringStation'
        };
        scope.$digest();
        expect(stockManagementStationItemsService.getStockManagementStationItems).toHaveBeenCalled();
      });

      it('should attach the stock dashboard list to the scope', function() {
        scope.selectedCateringStation = {
          id: 1,
          name: 'fakeCateringStation'
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

      it('selected catering station should not be set by default when station length is greater than 1', function () {
        expect(scope.cateringStationList.length > 0).toEqual(true);
        expect(scope.selectedCateringStation).not.toBeDefined();
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
        urlControl = ENV.apiUrl + '/rsvr-pdf/api/stock-management/dashboard/' + scope.selectedCateringStation.id;
        urlControl += '/file/export?sortOn=itemName&companyId=' + mockCompanyId +
          '&sessionToken=fakeSessionToken';
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
        var newURL = ENV.apiUrl + '/rsvr-pdf/api/stock-management/dashboard/' + scope.selectedCateringStation.id;
        newURL += '/file/export?sortOn=itemName&companyId=' + mockCompanyId +
          '&sessionToken=fakeSessionToken';
        expect(scope.exportURL).toEqual(newURL);
      });

    });

    describe('when a user selects a station', function() {

      it('should have an empty stock take list before the scope is digested', function() {
        expect(scope.stockTakeList).toEqual([]);
      });

      describe('The stockTakeList array', function() {

        beforeEach(function() {
          spyOn(StockDashboardCtrl, 'getStockTakeList').and.callThrough();
          spyOn(StockDashboardCtrl, 'getStockTakeListSuccessHandler').and.callThrough();
          scope.selectedCateringStation = cateringStationsJSON.response[0];
          scope.$digest();
        });

        it('should call the getStockTakeList method', function() {
          expect(StockDashboardCtrl.getStockTakeList).toHaveBeenCalled();
        });

        it('should call the getStockTakeListSuccessHandler method', function() {
          expect(StockDashboardCtrl.getStockTakeListSuccessHandler).toHaveBeenCalled();
        });

        it('should have (1) or more stations in the stockTakeList', function() {
          expect(scope.stockTakeList.length).toBeGreaterThan(0);
        });

        it('should be match the stock take list from the delivertNotes API Respone', function() {
          expect(scope.stockTakeList).toEqual(stockTakeListJOSN.response);
        });

      });

    });

  });

  describe('stock dashboard canCreateStockTake functionality', function() {

    it('should return false by default', function() {
      expect(scope.canCreateStockTake()).toBeFalsy();
    });

    it('should return false even if the catering station is selected but there is an open stock take', function() {
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeFalsy();
    });

    it('should return true if the catering station is selected and there is not open stock take', function() {
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      scope.stockTakeList[0].isSubmitted = true;
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeTruthy();
    });

    it('should return true if no stock takes were returned', function() {
      scope.selectedCateringStation = cateringStationsJSON.response[0];
      scope.$digest();
      scope.stockTakeList = [];
      scope.$digest();
      expect(scope.canCreateStockTake()).toBeTruthy();
    });

  });

});
