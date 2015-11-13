'use strict';

fdescribe('Controller: StockTakeCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App',
    'served/catering-stations.json',
    'served/stock-take.json',
    'served/stock-management-dashboard.json'
  ));

  var StockTakeCtrl;
  var scope;
  var location;
  var stockTakeFactory;
  var getCatererStationListDeferred;
  var getStockTakeDeferred;
  var getItemsByCateringStationIdDeferred;
  var saveDeferred;
  var routeParams;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location,
  _servedCateringStations_, _servedStockTake_, _servedStockManagementDashboard_) {
    scope = $rootScope.$new();
    location = $location;
    stockTakeFactory = $injector.get('stockTakeFactory');

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(_servedCateringStations_);
    spyOn(stockTakeFactory, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);

    getStockTakeDeferred = $q.defer();
    getStockTakeDeferred.resolve(_servedStockTake_);
    spyOn(stockTakeFactory, 'getStockTake').and.returnValue(getCatererStationListDeferred.promise);

    saveDeferred = $q.defer();
    spyOn(stockTakeFactory, 'createStockTake').and.returnValue(saveDeferred.promise);
    spyOn(stockTakeFactory, 'updateStockTake').and.returnValue(saveDeferred.promise);

    getItemsByCateringStationIdDeferred = $q.defer();
    getItemsByCateringStationIdDeferred.resolve(_servedStockManagementDashboard_);
    spyOn(stockTakeFactory, 'getItemsByCateringStationId').and.returnValue(getItemsByCateringStationIdDeferred.promise);
  }));

  describe('invalid state passed to route', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'invalid'
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should redirect to /', function(){
      expect(location.path()).toBe('/');
    });
  });

  describe('View controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'view',
        id: 60
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should have a state scope var set to view', function(){
      expect(scope.state).toBe('view');
    });
    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function(){
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set catererStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });
    // API call #2
    it('should call stockTakeFactory.getStockTake with routeParams.id', function(){
      expect(stockTakeFactory.getStockTake).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set stockTake scope var', function(){
      expect(scope.stockTake).toBeDefined();
    });
    // Scope globals
    describe('global scope functions and vars', function(){
      it('should have a cancel scope function', function(){
        expect(scope.cancel).toBeDefined();
        expect(Object.prototype.toString.call(scope.cancel)).toBe('[object Function]');
      });
      it('should have a toggleReview scope function', function(){
        expect(scope.toggleReview).toBeDefined();
        expect(Object.prototype.toString.call(scope.toggleReview)).toBe('[object Function]');
      });
      it('should have a clearFilter scope function', function(){
        expect(scope.clearFilter).toBeDefined();
        expect(Object.prototype.toString.call(scope.clearFilter)).toBe('[object Function]');
      });
      it('should have a save scope function', function(){
        expect(scope.save).toBeDefined();
        expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
      });
    });
  });

  describe('Create controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'create',
        id: 3
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('shouldset stockTake.catererStationId scope var to routeParams.id', function(){
      expect(scope.stockTake.catererStationId).toBe(3);
    });
    it('should have a state scope var set to create', function(){
      expect(scope.state).toBe('create');
    });
    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function(){
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should redirect to /stock-take-report when cancel button is clicked', function(){
      scope.cancel();
      expect(location.path()).toBe('/stock-take-report');
    });
    describe('change LMP station', function(){
      it('should call stockTakeFactory.getItemsByCateringStationId', function(){
        var csid = 5;
        scope.stockTake.catererStationId = csid;
        scope.$digest();
        expect(stockTakeFactory.getItemsByCateringStationId).toHaveBeenCalledWith(csid);
      });
    });
    describe('save scope function, only save', function() {
      beforeEach(function(){
        scope.stockTake = {
          catererStationId: 3
        };
        scope.itemQuantities = [];
        scope.itemQuantities[1] = 10;
        scope.itemQuantities[2] = '';
        scope.itemQuantities[4] = 11;
        scope.save(false);
      });
      it('should set delivery note is accepted to whatever is passed in', function () {
        expect(scope.stockTake.isSubmitted).toBe(false);
      });
      it('should call createStockTake', function(){
        var mockedPayload = {
          catererStationId: 3,
          isSubmitted: false,
          items: [
            {
              masterItemId: 1,
              quantity: 10
            },
            {
              masterItemId: 4,
              quantity: 11
            }
          ]
        };
        expect(stockTakeFactory.createStockTake).toHaveBeenCalledWith(mockedPayload);
      });
    });

  });

  describe('Edit controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'edit',
        id: 60
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should have a state scope var set to create', function(){
      expect(scope.state).toBe('edit');
    });
    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function(){
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set catererStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });
    // API call #2
    it('should call stockTakeFactory.getStockTake with routeParams.id', function(){
      expect(stockTakeFactory.getStockTake).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set stockTake scope var', function(){
      expect(scope.stockTake).toBeDefined();
    });
    it('should switch the state to review when review button is clicked', function(){
      scope.toggleReview();
      expect(scope.state).toBe('review');
    });
    it('should switch the state back to edit when the cancel button is clicked', function(){
      scope.cancel();
      expect(scope.state).toBe('edit');
    });
    describe('clearFilter scope function', function(){
      it('should set all filters to empty string when called', function(){
        scope.filterInput = {};
        scope.filterInput.itemCode = 's';
        scope.filterInput.itemName = 's';
        scope.$digest();
        scope.clearFilter();
        expect(scope.filterInput.itemCode).toBeUndefined();
        expect(scope.filterInput.itemName).toBeUndefined();
      });
    });
    describe('save scope function submit stock take', function(){
      beforeEach(function(){
        scope.stockTake = {
          catererStationId: 3,
          id: 60
        };
        scope.itemQuantities = [];
        scope.itemQuantities[1] = 10;
        scope.itemQuantities[2] = '';
        scope.itemQuantities[4] = 11;
        scope.save(true);
      });
      it('should set delivery note is accepted to whatever is passed in', function(){
        expect(scope.stockTake.isSubmitted).toBe(true);
      });
      it('should call saveDeliveryNote', function(){
        expect(stockTakeFactory.updateStockTake).toHaveBeenCalled();
      });
    });
    describe('quantityDisabled scope function', function(){
      it('should return true if state is not create and edit', function(){
        scope.state = 'review';
        expect(scope.quantityDisabled()).toBe(true);
      });
      it('should return true if stock take is sbumitted', function(){
        scope.state = 'edit';
        scope.stockTake.isSubmitted = true;
        expect(scope.quantityDisabled()).toBe(true);
      });
      it('should return false otherwise...', function(){
        scope.state = 'edit';
        scope.stockTake.isSubmitted = false;
        expect(scope.quantityDisabled()).toBe(false);
      });
    });
    describe('toggleReview first click', function(){
      it('should set prev state to edit', function(){
        scope.state = 'edit';
        scope.toggleReview();
        expect(scope.state).toBe('review');
        expect(scope.prevState).toBe('edit');
      });
      it('should flip them back if toggled again', function(){
        scope.state = 'review';
        scope.prevState = 'edit';
        scope.toggleReview();
        expect(scope.state).toBe('edit');
        expect(scope.prevState).toBeNull();
      });
    });
    describe('cancel in review state', function(){
      it('should return if prevState is set', function(){
        scope.prevState = 'edit';
        expect(scope.cancel()).toBeUndefined();
      });
    });
    describe('save scope function if stockTake is submitted', function(){
      it('should return', function(){
        scope.stockTake = {isSubmitted:true};
        expect(scope.save()).toBeUndefined();
      });
    });
  });

  describe('error handler', function(){

    var mockError;

    beforeEach(inject(function($controller){
      mockError = {
        status:400,
        statusText:'Bad Request'
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams = {
          state: 'create',
          id: 3
        }
      });
      scope.stockTake = {
        catererStationId: 3,
        id: 60
      };
      scope.itemQuantities = [];
      scope.itemQuantities[1] = 10;
      scope.itemQuantities[2] = '';
      scope.itemQuantities[4] = 11;
      scope.save(true);
      scope.$digest();
      saveDeferred.reject(mockError);
      scope.$apply();
    }));

    it('should set the displayError flag to true', function(){
      expect(scope.displayError).toBeTruthy();
    });

    it('should set the error response as a copy the API response', function(){
      expect(scope.errorResponse).toEqual(mockError);
    });

  });

});
