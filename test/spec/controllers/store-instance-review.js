'use strict';

describe('Controller: StoreInstanceReviewCtrl dispatch', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-seals.json'));
  beforeEach(module('served/seal-colors.json'));
  beforeEach(module('served/seal-types.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/store-instance-item-list.json'));
  beforeEach(module('served/company-reason-codes.json'));
  beforeEach(module('served/count-types.json'));
  beforeEach(module('served/end-instance-review-store-details.json'));

  var StoreInstanceReviewCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var routeParams;
  var getStoreDetailsDeferred;
  var storeInstanceWizardConfig;
  var getStoreInstanceMenuItemsDeferred;
  var storeInstanceReviewFactory;
  var getSealColorsDeferred;
  var getSealTypesDeferred;
  var getStoreInstanceSealsDeferred;
  var location;
  var getStoreInstanceItemsDeferred;
  var updateStoreInstanceStatusDeferred;
  var dateUtility;
  var controller;
  var getReasonCodeListDeferred;
  var getReasonCodeListJSON;
  var getCountTypesDeferred;
  var getCountTypesJSON;
  var endInstanceStoreDetailsJSON;
  var storeInstanceItemsJSON;
  var storeInstanceMenuItemsJSON;
  var lodash;
  var duplicateMenuItem;

  function initController($controller) {
    StoreInstanceReviewCtrl = $controller('StoreInstanceReviewCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }

  beforeEach(inject(function($controller, $rootScope, $injector, $q, $window,
    _servedStoreInstanceMenuItems_, _servedStoreInstanceSeals_,
    _servedSealColors_, _servedSealTypes_, $location, _servedStoreInstanceItemList_,
    _servedCompanyReasonCodes_, _servedCountTypes_,
    _servedEndInstanceReviewStoreDetails_) {
    scope = $rootScope.$new();
    routeParams = {
      storeId: 17,
      action: 'dispatch'
    };
    location = $location;

    storeInstanceWizardConfig = $injector.get('storeInstanceWizardConfig');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');

    // storeInstanceFactory
    storeInstanceFactory = $injector.get('storeInstanceFactory');
    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);

    storeInstanceItemsJSON = _servedStoreInstanceItemList_;
    storeInstanceMenuItemsJSON = _servedStoreInstanceMenuItems_;

    // add duplicate menu item to test combining duplicates
    duplicateMenuItem = {
      itemMasterId: storeInstanceItemsJSON.response[0].itemMasterId,
      menuQuantity: 100
    };
    var menuItemsWithDuplicate = angular.copy(storeInstanceMenuItemsJSON);
    menuItemsWithDuplicate.response.push(duplicateMenuItem);

    getStoreInstanceMenuItemsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred.resolve(menuItemsWithDuplicate);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(
      getStoreInstanceMenuItemsDeferred.promise);

    updateStoreInstanceStatusDeferred = $q.defer();
    updateStoreInstanceStatusDeferred.resolve({
      response: 200
    });
    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(
      updateStoreInstanceStatusDeferred.promise);
    getStoreInstanceItemsDeferred = $q.defer();
    getStoreInstanceItemsDeferred.resolve(storeInstanceItemsJSON);
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);

    storeInstanceReviewFactory = $injector.get('storeInstanceReviewFactory');

    getSealColorsDeferred = $q.defer();
    getSealColorsDeferred.resolve(_servedSealColors_);
    spyOn(storeInstanceReviewFactory, 'getSealColors').and.returnValue(getSealColorsDeferred.promise);

    getSealTypesDeferred = $q.defer();
    getSealTypesDeferred.resolve(_servedSealTypes_);
    spyOn(storeInstanceReviewFactory, 'getSealTypes').and.returnValue(getSealTypesDeferred.promise);

    getStoreInstanceSealsDeferred = $q.defer();
    getStoreInstanceSealsDeferred.resolve(_servedStoreInstanceSeals_);
    spyOn(storeInstanceReviewFactory, 'getStoreInstanceSeals').and.returnValue(getStoreInstanceSealsDeferred.promise);

    getReasonCodeListJSON = _servedCompanyReasonCodes_;
    getReasonCodeListDeferred = $q.defer();
    getReasonCodeListDeferred.resolve(getReasonCodeListJSON);
    spyOn(storeInstanceFactory, 'getReasonCodeList').and.returnValue(getReasonCodeListDeferred.promise);

    getCountTypesJSON = _servedCountTypes_;
    getCountTypesDeferred = $q.defer();
    getCountTypesDeferred.resolve(getCountTypesJSON);
    spyOn(storeInstanceFactory, 'getCountTypes').and.returnValue(getCountTypesDeferred.promise);
    endInstanceStoreDetailsJSON = _servedEndInstanceReviewStoreDetails_;

    spyOn(location, 'url').and.callThrough();
    spyOn(location, 'path').and.callThrough();

    spyOn($window, 'open');

    controller = $controller;
    initController(controller);

    storeDetailsJSON = {
      LMPStation: 'ORD',
      storeNumber: '180485',
      scheduleDate: '2015-08-13',
      scheduleNumber: 'SCHED123',
      storeInstanceNumber: scope.storeId,
      currentStatus: {
        name: '2',
        statusName: 'Ready for Dispatch'
      },
      statusList: [{
        id: 1,
        statusName: 'Ready for Packing',
        name: '1'
      }, {
        id: 2,
        statusName: 'Ready for Seals',
        name: '2'
      }, {
        id: 3,
        statusName: 'Ready for Dispatch',
        name: '3'
      }, {
        id: 7,
        statusName: 'Dispatched',
        name: '4'
      }, {
        id: 8,
        statusName: 'Un-dispatched',
        name: '7'
      }, {
        id: 9,
        statusName: 'Inbounded',
        name: '6'
      }, {
        id: 10,
        statusName: 'On Floor',
        name: '5'
      }]
    };

  }));

  describe('Init', function() {
    beforeEach(inject(function() {
      getStoreDetailsDeferred.resolve(storeDetailsJSON);
      scope.$digest();
    }));

    it('should get the store details', function() {
      expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(routeParams.storeId);
    });

    it('should attach all properties of JSON to scope', function() {
      expect(scope.storeDetails).toEqual(storeDetailsJSON);
    });

    it('should call getStoreInstanceMenuItems', function() {
      var formattedDate = dateUtility.formatDateForAPI(storeDetailsJSON.scheduleDate);
      var expectedPayload = {
        itemTypeId: 1, // this is 1 because we are requesting regular items.
        date: formattedDate
      };
      expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(routeParams.storeId,
        expectedPayload);
    });

    it('should sum overlapping store instance menu items', function () {
      scope.$digest();

      var itemMatch = lodash.findWhere(scope.items, {itemMasterId: duplicateMenuItem.itemMasterId});
      var originalMenuItem = lodash.findWhere(storeInstanceMenuItemsJSON.response, {itemMasterId: duplicateMenuItem.itemMasterId});
      var expectedQuantity = duplicateMenuItem.menuQuantity + originalMenuItem.menuQuantity;

      expect(itemMatch.menuQuantity).toEqual(expectedQuantity);
    });

    it('should call getStoreInstanceItems', function() {
      expect(storeInstanceFactory.getStoreInstanceItemList).toHaveBeenCalledWith(routeParams.storeId);
    });

    it('should format scope.items', function() {
      var expectedItemDescription = 'Ru-002 -  BabyRuth';
      var expectedItemName = 'BabyRuth';
      expect(scope.items[0].itemDescription).toEqual(expectedItemDescription);
      expect(scope.items[0].itemName).toEqual(expectedItemName);
    });

    it('should set wizardSteps', function() {
      var wizardSteps = storeInstanceWizardConfig.getSteps(routeParams.action, routeParams.storeId);
      expect(scope.wizardSteps).toEqual(wizardSteps);
    });

    it('should call seal colors API', function() {
      expect(storeInstanceReviewFactory.getSealColors).toHaveBeenCalled();
    });

    it('should call seal types API', function() {
      expect(storeInstanceReviewFactory.getSealTypes).toHaveBeenCalled();
    });

    it('should call get store status API', function() {
      expect(storeInstanceReviewFactory.getStoreInstanceSeals).toHaveBeenCalled();
    });

    it('should create a scope seals object from the 3 seal API calls', function() {
      var mockSealObj = [{
        name: 'Outbound',
        bgColor: '#000000',
        sealNumbers: ['1', '4567'],
        order: 1
      }, {
        name: 'Inbound',
        bgColor: '#000001',
        sealNumbers: ['123'],
        order: 3
      }, {
        name: 'Hand Over',
        bgColor: '#E5E500',
        sealNumbers: [],
        order: 2
      }, {
        name: 'High Security',
        bgColor: '#B70024',
        sealNumbers: [],
        order: 4
      }];
      expect(scope.seals).toEqual(mockSealObj);
    });

    describe('stepWizardPrevTrigger scope function', function() {
      it('should set showLoseDataAlert to true and return false', function() {
        expect(scope.stepWizardPrevTrigger()).toBe(false);
        expect(scope.showLoseDataAlert).toBe(false);
      });
    });

    describe('goToWizardStep scope function', function() {
      it('should set wizardStepToIndex to whatever value is passed in and call updateStatus', function() {
        scope.redirectTo('Seals');
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId,
          '2');
      });

      it('should not do anything if no valid step for provided index', function() {
        scope.redirectTo();
        expect(storeInstanceFactory.updateStoreInstanceStatus).not.toHaveBeenCalled();
      });
    });

    describe('update instance', function() {
      it('should redirect to dashboard if step is undefined', function() {
        StoreInstanceReviewCtrl.updateInstanceToByStepName();
        expect(location.url).toHaveBeenCalledWith('/store-instance-dashboard');
      });

      it('should redirect to proper url', function() {
        scope.redirectTo('Seals');
        scope.$digest();
        expect(location.url).toHaveBeenCalledWith('/store-instance-seals/dispatch/17');
      });
    });

    describe('getUllageReason', function() {
      it('should get the ullage reason', function() {
        var ullageReason = scope.getUllageReason(34);
        expect(ullageReason).toBe('Damaged');
      });

      it('should not return a value is reason code is unfined', function() {
        var ullageReason = scope.getUllageReason();
        expect(ullageReason).toBeUndefined();
      });
    });

    describe('submit scope function', function() {

      it('should set the store instance status to the proper status when action is dispatch', function() {
        routeParams.action = 'dispatch';
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId,
          '4', false, false);
        scope.$digest();
        expect(location.path).toHaveBeenCalledWith('store-instance-dashboard');
      });

      it('should set the store instance status to the proper status when action is replenish', function() {
        routeParams.action = 'replenish';
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId,
          '4', false, false);
        scope.$digest();
        expect(location.path).toHaveBeenCalledWith('store-instance-dashboard');
      });

      it('should set the store instance status to the proper status when action is end-instance', function() {
        routeParams.action = 'end-instance';
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId,
          '6', false, true);
        scope.$digest();
        expect(location.path).toHaveBeenCalledWith('store-instance-dashboard');
      });

      it('should not make a call if action is not in allowed state', function() {
        routeParams.action = 'fakeAction';
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).not.toHaveBeenCalled();
      });
    });

  });

  describe('Init for redispatch', function() {
    beforeEach(inject(function() {
      routeParams.action = 'redispatch';
      var redispatchStoreDetails = angular.copy(endInstanceStoreDetailsJSON);
      redispatchStoreDetails.prevStoreInstanceId = 165;

      getStoreDetailsDeferred.resolve(redispatchStoreDetails);
      scope.$digest();
      initController(controller);
    }));

    it('should attach action to scope', function() {
      expect(scope.action).toBe('redispatch');
    });
  });

  describe('Init for end-instance', function() {
    beforeEach(inject(function() {
      routeParams.action = 'end-instance';
      getStoreDetailsDeferred.resolve(endInstanceStoreDetailsJSON);
      scope.$digest();
      initController(controller);
    }));

    it('should attach action to scope', function() {
      expect(scope.action).toBe('end-instance');
    });
  });

  describe('if current status is not "ready for dispatch"', function() {
    beforeEach(inject(function() {
      storeDetailsJSON.currentStatus = {
        name: '45',
        statusName: 'NOT Ready for Dispatch'
      };
      getStoreDetailsDeferred.resolve(storeDetailsJSON);
      scope.$digest();
    }));

    it('should set actionNotAllowed to true if not on ready to dispatch status', function() {
      expect(scope.actionNotAllowed).toBe(true);
    });
  });

  describe('scope.exit', function() {
    it('should redirect to store instance dashboard', function() {
      scope.exit();
      scope.$apply();
      expect(location.url).toHaveBeenCalledWith('/store-instance-dashboard');
    });
  });

  describe('section title label', function() {
    it('should return the proper string for the seals when in dispatch', function() {
      routeParams.action = 'dispatch';
      var title = scope.getTitleFor('seals');
      expect(title).toBe('Seal Number Assignment');
    });

    it('should return the proper string for the items when in replenish', function() {
      routeParams.action = 'replenish';
      var title = scope.getTitleFor('items');
      expect(title).toBe('Pick List');
    });

    it('should return the proper string for the seals when in end-instance', function() {
      routeParams.action = 'end-instance';
      var title = scope.getTitleFor('seals');
      expect(title).toBe('Inbound Seals');
    });

    it('should return empty string if either section or action is invalid ', function() {
      routeParams.action = 'fake action';
      var title = scope.getTitleFor('fakeSection');
      expect(title).toBe('');
    });
  });

  describe('hasDiscrepancy', function() {
    it('should return empty string if action is dispatch', function() {
      routeParams.action = 'replenish';
      var result = scope.hasDiscrepancy({});
      expect(result).toBe('');
    });

    it('should return danger class if action is dispatch and quantities do not match', function() {
      routeParams.action = 'dispatch';
      var fakeItem = {
        menuQuantity: 1,
        quantity: 10
      };
      var result = scope.hasDiscrepancy(fakeItem);
      expect(result).toBe('danger');
    });

    it('should return empty class if action is dispatch and quantities do not match', function() {
      routeParams.action = 'dispatch';
      var fakeItem = {
        menuQuantity: 10,
        quantity: 10
      };
      var result = scope.hasDiscrepancy(fakeItem);
      expect(result).toBe('');
    });
  });

  describe('item filtering', function () {
    beforeEach(function () {
      scope.itemFilterText = 'Test Filter';
      scope.filterPackingList();
    });
    it('should only update search filter on click of search button', function () {

      expect(scope.filterItemDetails).toEqual(scope.itemFilterText);
      scope.itemFilterText = 'New Test Filter';
      expect(scope.filterItemDetails).not.toEqual(scope.itemFilterText);
    });

    it('should clear all search variables on clear button', function () {
      scope.clearFilteredPackingList();
      expect(scope.itemFilterText).toEqual('');
      expect(scope.filterItemDetails).toEqual('');
    });
  });
  
  describe('getSalesCategoryName function', function() {
    beforeEach(function() {
      StoreInstanceReviewCtrl._menuItems = [{
	    itemMasterId: 1,
	    salesCategoryName: 'Test1'
	  }, {
	    itemMasterId: 2,
	    salesCategoryName: 'Test2'
	  }, {
	    itemMasterId: 3,
	    salesCategoryName: 'Test3'
	  }];
	});

	it('should populate SalesCategoryName', function() {
	  var code = StoreInstanceReviewCtrl.getSalesCategoryName(2);
	  expect(code).not.toEqual('Test2');
	});

	it('should not load SalesCategoryName', function() {
	  var code = StoreInstanceReviewCtrl.getSalesCategoryName(5);
	  expect(code).toEqual('');
	});
  });

});
