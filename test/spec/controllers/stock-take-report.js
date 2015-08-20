'use strict';

describe('Stock Take Report', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json','served/stock-take-list.json'));

  var StockTakeReportCtrl,
    $scope,
    catererStationService,
    stockTakeService,
    stockTakeListJOSN,
    getStockTakeListDeferred,
    getCatererStationListDeferred,
    stationsListJSON,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope,$injector, _servedStockTakeList_, _servedCateringStations_) {

    stockTakeListJOSN = _servedStockTakeList_;
    stationsListJSON = _servedCateringStations_;

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();
    stockTakeService = $injector.get('stockTakeService');
    catererStationService = $injector.get('catererStationService');

    getStockTakeListDeferred = $q.defer();
    getStockTakeListDeferred.resolve(stockTakeListJOSN);
    spyOn(stockTakeService, 'getStockTakeList').and.returnValue(
      getStockTakeListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(stationsListJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    spyOn(stockTakeService, 'deleteStockTake').and.returnValue({
      then: function (callBack) {
        return callBack();
      }
    });

    StockTakeReportCtrl = $controller('StockTakeReportCtrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('the controller methods', function() {

    it('should have a init method', function () {
      expect(StockTakeReportCtrl.init).toBeDefined();
    });

    it('should have a getCatererStationList method', function () {
      expect(StockTakeReportCtrl.getCatererStationList).toBeDefined();
    });

    it('should have a getStockTakeList method', function () {
      expect(StockTakeReportCtrl.getStockTakeList).toBeDefined();
    });

    it('should have a getStockTakeListSuccessHandler method', function () {
      expect(StockTakeReportCtrl.getStockTakeListSuccessHandler).toBeDefined();
    });

    it('should have a generateStockTakeQuery method', function () {
      expect(StockTakeReportCtrl.generateStockTakeQuery).toBeDefined();
    });

  });

  describe('when the controller loads', function() {

    it('should have a stationsList attached to the scope', function () {
      expect($scope.stationsList).toBeDefined();
    });

    it('should have an empty stations list before the scope is digested', function () {
      expect($scope.stationsList).toEqual([]);
    });

    describe('The stationsList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stations in the stationsList', function () {
        expect($scope.stationsList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.stationsList).toEqual(stationsListJSON.response);
      });

      describe('contains an station object which', function () {
        var station;
        beforeEach(function () {
          station = $scope.stationsList[0];
        });

        it('should be defined', function () {
          expect(station).toBeDefined();
        });

        it('should have an id property and is a string', function () {
          expect(station.id).toBeDefined();
          expect(station.id).toEqual(jasmine.any(Number));
        });

        it('should have an stationCode property and is a string', function () {
          expect(station.code).toBeDefined();
          expect(station.code).toEqual(jasmine.any(String));
        });

      });

    });

  });

  describe('when a user selects a station', function() {

    it('should have a stockTakeList attached to the scope', function () {
      expect($scope.stockTakeList).toBeDefined();
    });

    it('should have an empty deliveryt notes list before the scope is digested', function () {
      expect($scope.stockTakeList).toEqual([]);
    });

    describe('The stockTakeList array', function () {

      beforeEach(function() {
        spyOn(StockTakeReportCtrl, 'getStockTakeListSuccessHandler').and.callThrough();
        spyOn(StockTakeReportCtrl,'formatStockTakeDates').and.callThrough();
        $scope.catererStationId = 3;
        $scope.$digest();
      });

      it('should call the getStockTakeListSuccessHandler method', function () {
        expect(StockTakeReportCtrl.getStockTakeListSuccessHandler).toHaveBeenCalled();
      });


      it('should have (1) or more stations in the stockTakeList', function () {
        expect($scope.stockTakeList.length).toBeGreaterThan(0);
      });

      it('should be match the stock take list from the delivertNotes API Respone',function () {
        expect($scope.stockTakeList).toEqual(stockTakeListJOSN.response);
      });

      describe('contains an stock take object which', function () {
        var stockTake;
        beforeEach(function () {
          stockTake = $scope.stockTakeList[0];
        });

        it('should be defined', function () {
          expect(stockTake).toBeDefined();
        });

        it('should have an id property and is a number', function () {
          expect(stockTake.id).toBeDefined();
          expect(stockTake.id).toEqual(jasmine.any(Number));
        });

        it('should have an catererStationId property and is a number', function () {
          expect(stockTake.catererStationId).toBeDefined();
          expect(stockTake.catererStationId).toEqual(jasmine.any(Number));
        });

        describe('formatting the dates of the stock take', function() {

          it('should have been called when the stock takes list is received', function () {
            expect(StockTakeReportCtrl.formatStockTakeDates).toHaveBeenCalled();
          });

          it('should remove the decimal from the end of the updatedOn date', function () {
            var control = '2015-08-13 15:58:55.357607';
            var formattedControl = '2015-08-13 15:58:55';
            expect(stockTake.updatedOn).not.toEqual(control);
            expect(stockTake.updatedOn).toEqual(formattedControl);
          });

        });

      });

    });

  });

  describe('remove stock take functionality', function () {

    beforeEach(function() {
      $scope.catererStationId = 3;
      $scope.$digest();
    });

    it('should have a removeRecord() method attached to the scope',
      function () {
        expect($scope.removeRecord).toBeDefined();
      });

    it('should remove the record from the stockTakeList', function () {
      var length = $scope.stockTakeList.length;
      $scope.removeRecord(47);
      expect($scope.stockTakeList.length).toEqual(length - 1);
    });

  });

  describe('clear filter functionality', function () {
    beforeEach(function () {
      $scope.$digest();
    });
    it(
      'should have a clearSearchFilters() method attached to the scope',
      function () {
        expect($scope.clearSearchFilters).toBeDefined();
      });

    it('should clear the search ng-model when called', function () {
      $scope.search = {
        stockTakeNumber: 'VB001'
      };
      $scope.clearSearchFilters();
      expect($scope.search).toEqual({});
    });

    it('should clear the dateRange ng-model when called', function () {
      $scope.dateRange.startDate = '07-15-2015';
      $scope.dateRange.endDate = '08-15-2015';
      $scope.clearSearchFilters();
      expect($scope.dateRange).toEqual({
        startDate: '',
        endDate: ''
      });
    });

  });

  describe('searchRecords', function () {

    beforeEach(function () {
      spyOn(StockTakeReportCtrl, 'displayLoadingModal');
      spyOn(StockTakeReportCtrl, 'getStockTakeList');
      $scope.$digest();
    });

    it('should be defined', function () {
      expect($scope.searchRecords).toBeDefined();
    });

    it('should call getStockTakeList', function () {
      $scope.searchRecords();
      expect(StockTakeReportCtrl.getStockTakeList).toHaveBeenCalled();
    });

    it('should call displayLoadingModal', function () {
      $scope.searchRecords();
      expect(StockTakeReportCtrl.displayLoadingModal).toHaveBeenCalled();
    });

    describe('setting the date filters', function() {

      beforeEach(function() {
        $scope.dateRange = {
          startDate: '08/12/2015',
          endDate: '08/13/2015'
        };
        $scope.$digest();
      });

      it('should set the start and end dates in the query', function(){
        var query = StockTakeReportCtrl.generateStockTakeQuery();
        expect(query.startDate).toBeDefined();
        expect(query.endDate).toBeDefined();
      });

      it('should format the start and end dates in the query', function(){
        var query = StockTakeReportCtrl.generateStockTakeQuery();
        expect(query.startDate).toEqual('20150812');
        expect(query.endDate).toEqual('20150813');
      });

    });

  });

});
