'use strict';

describe('Controller: StockTakeCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stock-take.json'));
  beforeEach(module('served/stock-management-dashboard.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/master-item.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/characteristics.json'));

  var StockTakeCtrl;
  var scope;
  var location;
  var stockTakeFactory;
  var getCatererStationListDeferred;
  var getStockTakeDeferred;
  var getItemsByCateringStationIdDeferred;
  var getMasterItemDeferred;
  var getItemsMasterListDeferred;
  var getItemTypesDeferred;
  var getCharacteristicsDeferred;
  var saveDeferred;
  var routeParams;

  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location, $filter, lodash,
    _servedCateringStations_, _servedStockTake_, _servedStockManagementDashboard_, _servedMasterItemList_,
    _servedMasterItem_, _servedItemTypes_, _servedCharacteristics_) {
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
    spyOn(stockTakeFactory, 'getItemsByCateringStationId').and.returnValue(
      getItemsByCateringStationIdDeferred.promise);

    getItemsMasterListDeferred = $q.defer();
    getItemsMasterListDeferred.resolve(_servedMasterItemList_);

    getMasterItemDeferred = $q.defer();
    getMasterItemDeferred.resolve(_servedMasterItem_);

    getItemTypesDeferred = $q.defer();
    getItemTypesDeferred.resolve(_servedItemTypes_);

    getCharacteristicsDeferred = $q.defer();
    getCharacteristicsDeferred.resolve(_servedCharacteristics_);

    spyOn(stockTakeFactory, 'getItemTypes').and.returnValue(getItemTypesDeferred.promise);
    spyOn(stockTakeFactory, 'getCharacteristics').and.returnValue(getCharacteristicsDeferred.promise);
    spyOn(stockTakeFactory, 'getItemsMasterList').and.returnValue(getItemsMasterListDeferred.promise);
    spyOn(stockTakeFactory, 'getMasterItem').and.returnValue(getMasterItemDeferred.promise);
    spyOn(stockTakeFactory, 'getCompanyId').and.returnValue(403);
  }));

  describe('invalid state passed to route', function() {
    beforeEach(inject(function($controller) {
      routeParams = {
        state: 'invalid'
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should redirect to /', function() {
      expect(location.path()).toBe('/');
    });
  });

  describe('View controller action', function() {
    beforeEach(inject(function($controller) {
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

    it('should have a state scope var set to view', function() {
      expect(scope.state).toBe('view');
    });

    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function() {
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });

    it('should set catererStationList scope var', function() {
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });

    // API call #2
    it('should call stockTakeFactory.getStockTake with routeParams.id', function() {
      expect(stockTakeFactory.getStockTake).toHaveBeenCalledWith(routeParams.id);
    });

    it('should set stockTake scope var', function() {
      expect(scope.stockTake).toBeDefined();
    });

    // Scope globals
    describe('global scope functions and vars', function() {
      it('should have a cancel scope function', function() {
        expect(scope.shouldHideItem).toBeDefined();
        expect(Object.prototype.toString.call(scope.shouldHideItem)).toBe('[object Function]');
      });

      it('should have a cancel scope function', function() {
        expect(scope.cancel).toBeDefined();
        expect(Object.prototype.toString.call(scope.cancel)).toBe('[object Function]');
      });

      it('should have a toggleReview scope function', function() {
        expect(scope.toggleReview).toBeDefined();
        expect(Object.prototype.toString.call(scope.toggleReview)).toBe('[object Function]');
      });

      it('should have a clearFilter scope function', function() {
        expect(scope.clearFilter).toBeDefined();
        expect(Object.prototype.toString.call(scope.clearFilter)).toBe('[object Function]');
      });

      it('should have a save scope function', function() {
        expect(scope.save).toBeDefined();
        expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
      });
    });
  });

  describe('Create controller action', function() {
    beforeEach(inject(function($controller) {
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

    it('shouldset stockTake.catererStationId scope var to routeParams.id', function() {
      expect(scope.stockTake.catererStationId).toBe(3);
    });

    it('should have a state scope var set to create', function() {
      expect(scope.state).toBe('create');
    });

    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function() {
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });

    it('should call stockTakeFactory.getItemsMasterList', function() {
      expect(stockTakeFactory.getItemsMasterList).toHaveBeenCalled();
    });

    it('should call stockTakeCtrl.filterAvailableItems and set filteredItems in the scope', function() {
      expect(scope.filteredItems).toBeDefined();
    });

    it('should redirect to /stock-take-report when cancel button is clicked', function() {
      scope.cancel();
      expect(location.path()).toBe('/stock-take-report');
    });

    describe('change LMP station', function() {
      it('should call stockTakeFactory.getItemsByCateringStationId', function() {
        var csid = 5;
        scope.stockTake.catererStationId = csid;
        scope.$digest();
        expect(stockTakeFactory.getItemsByCateringStationId).toHaveBeenCalledWith(csid);
      });
    });

    describe('save scope function, only save', function() {
      beforeEach(function() {
        scope.stockTake = {
          catererStationId: 3,
          createdBy: 3,
          createdOn: '2/20/2016',
          updatedBy: 4,
          updatedOn: '5/23/2017',
          stockTakeDate: '2016-10-05'
        };
        scope.itemQuantities = [];
        scope.itemQuantities[1] = 10;
        scope.itemQuantities[2] = '';
        scope.itemQuantities[3] = 0;
        scope.itemQuantities[4] = 11;
        scope.save(false);
      });

      it('should set delivery note is accepted to whatever is passed in', function() {
        expect(scope.stockTake.isSubmitted).toBe(false);
      });

      it('should call createStockTake with clean payload', function() {
        var mockedPayload = {
          catererStationId: 3,
          isSubmitted: false,
          stockTakeDate: '20161005',
          items: [{
            masterItemId: 1,
            quantity: 10
          }, {
            masterItemId: 3,
            quantity: 0
          }, {
            masterItemId: 4,
            quantity: 11
          }]
        };
        expect(stockTakeFactory.createStockTake).toHaveBeenCalledWith(mockedPayload);
      });
    });

  });

  describe('Edit controller action', function() {
    beforeEach(inject(function($controller) {
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

    it('should have a state scope var set to create', function() {
      expect(scope.state).toBe('edit');
    });

    // Api call #1
    it('should call stockTakeFactory.getCatererStationList', function() {
      expect(stockTakeFactory.getCatererStationList).toHaveBeenCalled();
    });

    it('should set catererStationList scope var', function() {
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });

    // API call #2
    it('should call stockTakeFactory.getStockTake with routeParams.id', function() {
      expect(stockTakeFactory.getStockTake).toHaveBeenCalledWith(routeParams.id);
    });

    it('should set stockTake scope var', function() {
      expect(scope.stockTake).toBeDefined();
    });

    it('should switch the state to review when review button is clicked', function() {
      scope.toggleReview();
      expect(scope.state).toBe('review');
    });

    it('should switch the state back to edit when the cancel button is clicked', function() {
      scope.cancel();
      expect(scope.state).toBe('edit');
    });

    describe('clearFilter scope function', function() {
      it('should set all filters to empty string when called', function() {
        scope.filterInput = {};
        scope.filterInput.itemCode = 's';
        scope.filterInput.itemName = 's';
        scope.$digest();
        scope.clearFilter();
        expect(scope.filterInput.itemCode).toBeUndefined();
        expect(scope.filterInput.itemName).toBeUndefined();
      });
    });

    describe('save scope function submit stock take', function() {
      beforeEach(function() {
        scope.stockTake = {
          catererStationId: 3,
          id: 60,
          items: [
            { masterItemId: 1, id: 11 },
            { masterItemId: 2, id: 12 }
          ]
        };
        scope.itemQuantities = [];
        scope.itemQuantities[1] = 10;
        scope.itemQuantities[2] = '';
        scope.itemQuantities[4] = 11;
        scope.save(true);
      });

      it('should set delivery note is accepted to whatever is passed in', function() {
        expect(scope.stockTake.isSubmitted).toBe(true);
      });

      it('should call saveDeliveryNote', function() {
        var expectedPayload = jasmine.objectContaining({
          items: [{
            masterItemId: 1,
            quantity: 10,
            id: 11
          }, {
            masterItemId: 4,
            quantity: 11
          }]
        });
        expect(stockTakeFactory.updateStockTake).toHaveBeenCalledWith(scope.stockTake.id, expectedPayload);
      });
    });

    describe('quantityDisabled scope function', function() {
      it('should return true if state is not create and edit', function() {
        scope.state = 'review';
        expect(scope.quantityDisabled()).toBe(true);
      });

      it('should return true if stock take is sbumitted', function() {
        scope.state = 'edit';
        scope.stockTake.isSubmitted = true;
        expect(scope.quantityDisabled()).toBe(true);
      });

      it('should return false otherwise...', function() {
        scope.state = 'edit';
        scope.stockTake.isSubmitted = false;
        expect(scope.quantityDisabled()).toBe(false);
      });
    });

    describe('toggleReview first click', function() {
      it('should set prev state to edit', function() {
        scope.state = 'edit';
        scope.toggleReview();
        expect(scope.state).toBe('review');
        expect(scope.prevState).toBe('edit');
      });

      it('should flip them back if toggled again', function() {
        scope.state = 'review';
        scope.prevState = 'edit';
        scope.toggleReview();
        expect(scope.state).toBe('edit');
        expect(scope.prevState).toBeNull();
      });
    });

    describe('cancel in review state', function() {
      it('should return if prevState is set', function() {
        scope.prevState = 'edit';
        expect(scope.cancel()).toBeUndefined();
      });
    });

    describe('save scope function if stockTake is submitted', function() {
      it('should return', function() {
        scope.stockTake = {
          isSubmitted: true
        };
        expect(scope.save()).toBeUndefined();
      });
    });
  });

  describe('error handler', function() {

    var mockError;

    beforeEach(inject(function($controller) {
      mockError = {
        status: 400,
        statusText: 'Bad Request'
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

    it('should set the displayError flag to true', function() {
      expect(scope.displayError).toBeTruthy();
    });

    it('should set the error response as a copy the API response', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });

  });

  describe('The scope.addItems method', function() {
    beforeEach(inject(function($controller) {
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams = {
          state: 'create',
          id: 3
        }
      });
      scope.$digest();
    }));

    it('scope.addedItems should add 3 items', function() {
      scope.numberOfItems = 3;
      scope.addItems();
      expect(scope.addedItems.length).toBe(3);
    });

    it('after removing 1 item, the length should be 2', function() {
      scope.numberOfItems = 3;
      scope.addItems();
      scope.removeAddedItem(0);
      expect(scope.addedItems.length).toBe(2);
    });

    it('if addedItems exists, dont create it, test branch', function() {
      scope.numberOfItems = 3;
      scope.addedItems = [];
      scope.addItems();
      expect(scope.addedItems.length).toBe(3);
    });

  });

  describe('The scope.showAddedItem method', function() {
    beforeEach(inject(function($controller) {
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams = {
          state: 'create',
          id: 3
        }
      });
      scope.$digest();
    }));

    it('with 3 addedItems, scope.showAddedItems should return true', function() {
      scope.numberOfItems = 3;
      scope.addItems();
      expect(scope.showAddedItem()).toBeTruthy();
    });

    it('with no addedItems, scope.showAddedItem should return false', function() {
      expect(scope.showAddedItem()).toBeFalsy();
    });

    it('if state is review, scope.showAddedItem should return true', function() {
      spyOn(scope, 'showAddedItem').and.callThrough();
      scope.$digest();
      var item = {
        id: 1,
        index: 0,
        itemCode: '7up123',
        itemName: '7up',
        itemObject: {
          itemName: '7up',
          itemCode: '7up123'
        },
        itemQuantity: 3
      };
      scope.showAddedItem(item, 'review');
      scope.$digest();
      expect(scope.showAddedItem).toHaveBeenCalled();
      expect(scope.showAddedItem(item, 'review')).toBeTruthy();
    });

  });

  describe('The scope.omitSelectedItems method', function() {
    beforeEach(inject(function($controller) {
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams = {
          state: 'create',
          id: 3
        }
      });
      scope.$digest();
    }));

    it('scope.addedItems should add 3 items', function() {
      spyOn(scope, 'omitSelectedItems').and.callThrough();
      var item = {
        id: 1,
        index: 0,
        itemCode: '7up123',
        itemName: '7up',
        itemObject: {
          itemName: '7up',
          itemCode: '7up123'
        },
        itemQuantity: 3
      };
      scope.addedItems = [];
      scope.addedItems.push(item);
      scope.omitSelectedItems(item);
      expect(scope.omitSelectedItems).toBeTruthy();
    });

  });

  describe('addSelectedItemToMasterList', function() {
    beforeEach(inject(function($controller) {
      routeParams = {
        state: 'create',
        id: 60
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.stockTake.items = [{
        id: 603,
        stockTakeId: 60,
        masterItemId: 36,
        quantity: 3
      }];
      scope.cateringStationItems = [{
        catererStationId: 60,
        currentCountQuantity: 5,
        deliveryNoteId: null,
        dispatchedQuantity: 0,
        id: null,
        itemCode: '71234',
        itemName: '7UP Free',
        lastUpdatedOn: '2015-11-20 19:00:26.090895',
        masterItemId: 157,
        offloadQuantity: 0,
        openingQuantity: 5,
        receivedQuantity: 0,
        retailCompanyId: 403,
        ullageQuantity: 0
      }];
      scope.$digest();
    }));

    it('getItemsMasterList should have been called', function() {
      expect(stockTakeFactory.getItemsMasterList).toHaveBeenCalled();
    });

    it('should have defined cateringStationItems', function() {
      expect(scope.cateringStationItems).toBeDefined();
    });

    it('should have defined stockTake', function() {
      expect(scope.stockTake).toBeDefined();
    });

    it('should have defined masterItemList', function() {
      expect(scope.masterItemsList).toBeDefined();
    });

    it('should add an item to cateringStationItems', function() {
      expect(scope.cateringStationItems.length).toBe(5);
    });
  });

  describe('should hide items', function () {
    beforeEach(inject(function($controller) {
      routeParams = {
        state: 'create',
        id: 60
      };
      StockTakeCtrl = $controller('StockTakeCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
      scope.itemQuantities = {
        0: 12,
        1: 0,
        2: '',
        3: null
      };
    }));
    it('should always return false when not in view or review state', function () {
      var mockItem = { masterItemId: 3 };
      scope.state = 'edit';
      expect(scope.shouldHideItem(mockItem)).toEqual(false);
    });

    it('should return false for 0 values', function () {
      var mockItem = { masterItemId: 1 };
      scope.state = 'view';
      expect(scope.shouldHideItem(mockItem)).toEqual(false);
    });

    it('should return true for undefined, empty, or null values', function () {
      var emptyMockItem = { masterItemId: 2 };
      var undefinedMockItem = { masterItemId: 4 };
      var nullMockItem = { masterItemId: 3 };
      scope.state = 'view';
      expect(scope.shouldHideItem(emptyMockItem)).toEqual(true);
      expect(scope.shouldHideItem(undefinedMockItem)).toEqual(true);
      expect(scope.shouldHideItem(nullMockItem)).toEqual(true);
    });

  });

});
