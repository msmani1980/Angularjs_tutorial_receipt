'use strict';
/*global moment*/

describe('Controller: StoreInstanceDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/stores-list.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/store-status-response.json'));
  beforeEach(module('served/store-time-config.json'));
  beforeEach(module('served/features.json'));

  var StoreInstanceDashboardCtrl;
  var scope;
  var storeInstanceDashboardFactory;
  var cateringStationDeferred;
  var cateringStationResponseJSON;
  var stationDeferred;
  var stationResponseJSON;
  var storeInstanceListDeferred;
  var storeInstanceListResponseJSON;
  var storeInstanceDeferred;
  var storeInstanceResponseJSON;
  var storesListDeferred;
  var storesListResponseJSON;
  var statusListDeferred;
  var statusListResponseJSON;
  var statusDeferred;
  var statusResponseJSON;
  var storeTimeConfig;
  var storeTimeConfigDeferred;
  var storeTimeConfigResponseJSON;
  var storeInstanceService;
  var updateStoreInstanceStatusDeferred;
  var featuresListDeferred;
  var featuresListResponseJSON;
  var location;
  var _lodash;
  var identityAccessFactory;
  var ENV;


  beforeEach(inject(function($controller, $rootScope, $injector, $q, $location, lodash) {
    inject(function(_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedStoresList_,
      _servedStoreStatus_, _servedStoreStatusResponse_, _servedStoreTimeConfig_, _servedFeatures_,
      _servedStoreInstance_) {
      cateringStationResponseJSON = _servedCateringStations_;
      stationResponseJSON = _servedStations_;
      storeInstanceListResponseJSON = _servedStoreInstanceList_;
      storeInstanceResponseJSON = _servedStoreInstance_;
      storesListResponseJSON = _servedStoresList_;
      statusListResponseJSON = _servedStoreStatus_;
      statusResponseJSON = _servedStoreStatusResponse_;
      storeTimeConfigResponseJSON = _servedStoreTimeConfig_;
      featuresListResponseJSON = _servedFeatures_;

    });
    scope = $rootScope.$new();
    location = $location;
    _lodash = lodash;

    storeInstanceDashboardFactory = $injector.get('storeInstanceDashboardFactory');
    storeTimeConfig = $injector.get('storeTimeConfig');
    storeInstanceService = $injector.get('storeInstanceService');
    identityAccessFactory = $injector.get('identityAccessFactory');
    ENV = $injector.get('ENV');

    cateringStationDeferred = $q.defer();
    cateringStationDeferred.resolve(cateringStationResponseJSON);
    stationDeferred = $q.defer();
    stationDeferred.resolve(stationResponseJSON);
    storeInstanceListDeferred = $q.defer();
    storeInstanceListDeferred.resolve(storeInstanceListResponseJSON);
    storeInstanceDeferred = $q.defer();
    storeInstanceDeferred.resolve(storeInstanceResponseJSON);
    storesListDeferred = $q.defer();
    storesListDeferred.resolve(storesListResponseJSON);
    statusListDeferred = $q.defer();
    statusListDeferred.resolve(statusListResponseJSON);
    statusDeferred = $q.defer();
    statusDeferred.resolve(statusResponseJSON);
    storeTimeConfigDeferred = $q.defer();
    storeTimeConfigDeferred.resolve(storeTimeConfigResponseJSON);
    updateStoreInstanceStatusDeferred = $q.defer();
    featuresListDeferred = $q.defer();
    featuresListDeferred.resolve(featuresListResponseJSON);


    spyOn(storeInstanceDashboardFactory, 'getCatererStationList').and.returnValue(cateringStationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStationList').and.returnValue(stationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoreInstanceList').and.returnValue(storeInstanceListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoreInstance').and.returnValue(storeInstanceDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoresList').and.returnValue(storesListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStatusList').and.returnValue(statusListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'updateStoreInstanceStatus').and.returnValue(statusDeferred.promise);
    spyOn(storeTimeConfig, 'getTimeConfig').and.returnValue(storeTimeConfigDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getFeaturesList').and.returnValue(featuresListDeferred.promise);
    spyOn(location, 'path').and.callThrough();
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({
      sessionToken: 'fakeSessionToken'
    });

    StoreInstanceDashboardCtrl = $controller('StoreInstanceDashboardCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  describe('init', function() {
    beforeEach(function() {
      scope.$digest();
    });

    describe('getCatererStation', function() {
      it('should get catererStation from storeInstanceDashboardFactory', function() {
        expect(storeInstanceDashboardFactory.getCatererStationList).toHaveBeenCalled();
      });

      it('should attach caterStationList to Scope', function() {
        expect(scope.catererStationList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function() {
        expect(scope.catererStationList.length).toEqual(cateringStationResponseJSON.response.length);
      });
    });

    describe('getStation', function() {
      it('should get station from storeInstanceDashboardFactory', function() {
        expect(storeInstanceDashboardFactory.getStationList).toHaveBeenCalled();
      });

      it('should attach stationList to Scope', function() {
        expect(scope.stationList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function() {
        expect(scope.stationList).toEqual(stationResponseJSON.response);
      });
    });

    describe('getStoreInstanceList', function() {
      it('should get getStoreInstanceList from storeInstanceDashboardFactory', function() {
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalled();
      });

      it('should attach storeInstanceList to Scope', function() {
        expect(scope.storeInstanceList).toBeDefined();
      });

      it('should attach all objects of JSON to scope', function() {
        expect(scope.storeInstanceList.length).toEqual(storeInstanceListResponseJSON.response.length);
      });
    });

    describe('searchStoreInstanceDashboardData', function() {
      beforeEach(function() {
        scope.search = {
          dispatchLMPStation: '1',
          inboundLMPStation: '2',
          storeNumber: '3',
          scheduleStartDate: '10/06/2015',
          scheduleEndDate: '10/08/2015',
          departureStations: [{
            code: 'ORD',
            companyId: 403,
            id: 1,
            name: 'Chicago O\'Hara'
          }, {
            code: 'MDW',
            companyId: 403,
            id: 2,
            name: 'Chicago Midway'
          }],
          arrivalStations: [{
            code: 'LON3',
            companyId: 403,
            id: 3,
            name: 'London'
          }, {
            code: 'MDW',
            companyId: 403,
            id: 2,
            name: 'Chicago Midway'
          }],
          storeInstance: '4',
          storeStatusId: '5'
        };
        scope.$digest();
      });


      it('should get getStoresList from storeInstanceDashboardFactory', function() {
        scope.searchStoreInstanceDashboardData();
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalledWith({
          cateringStationId: '1',
          inboundStationId: '2',
          storeNumber: '3',
          startDate: '10/06/2015',
          endDate: '10/08/2015',
          departureStationCode: ['ORD', 'MDW'],
          arrivalStationCode: ['LON3', 'MDW'],
          storeInstanceId: '4',
          statusId: '5',
          limit: 100, offset: 0
        });
      });
    });

    describe('getStoresList', function() {
      it('should get getStoresList from storeInstanceDashboardFactory', function() {
        expect(storeInstanceDashboardFactory.getStoresList).toHaveBeenCalled();
      });

      it('should attach storesList to Scope', function() {
        expect(scope.storesList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function() {
        expect(scope.storesList).toEqual(storesListResponseJSON.response);
      });
    });

    describe('getStatusList', function() {
      it('should get getStatusList from storeInstanceDashboardFactory', function() {
        expect(storeInstanceDashboardFactory.getStatusList).toHaveBeenCalled();
      });

      it('should attach storeStatusList to Scope', function() {
        expect(scope.storeStatusList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function() {
        expect(scope.storeStatusList).toEqual(statusListResponseJSON);
      });
    });

    describe('getUndispatchFeatureid', function() {
      it('should get featureList', function() {
        expect(storeInstanceDashboardFactory.getFeaturesList).toHaveBeenCalled();
      });
      it('should set undispatchFeatureid', function() {
        expect(scope.undispatchFeatureId).toBeDefined();
      });
    });

    describe('getTimeConfig', function() {
      it('should get getTimeConfig from storeTimeConfig', function() {
        expect(storeTimeConfig.getTimeConfig).toHaveBeenCalled();
      });

      it('should attach timeConfigList to Scope', function() {
        expect(scope.timeConfigList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function() {
        expect(scope.timeConfigList).toEqual(storeTimeConfigResponseJSON.response);
      });
    });

    describe('format store instance response', function() {
      beforeEach(function() {
        scope.$digest();
      });

      it('should add store number', function() {
        expect(scope.storeInstanceList[0].storeNumber).toBeDefined();
      });

      it('should add status name', function() {
        expect(scope.storeInstanceList[0].storeNumber).toBeDefined();
      });

      it('should add actionButtons name', function() {
        expect(scope.storeInstanceList[0].actionButtons).toBeDefined();
      });
    });
  });

  describe('Table Accordion functions', function() {

    describe('toggleAccordion', function() {
      var testStore = {
        id: 2,
        replenishments: [{
          id: 3
        }]
      };

      it('should only close if toggling current open accordion', function() {
        scope.openStoreInstanceId = 2;
        scope.toggleAccordionView(testStore);
        scope.$digest();
        expect(scope.openStoreInstanceId).toEqual(-1);
      });
      it('should set new openRowId if toggling a closed accordion', function() {
        scope.openStoreInstanceId = 5;
        scope.$digest();
        scope.toggleAccordionView(testStore);
        expect(scope.openStoreInstanceId).toEqual(2);
      });
    });

    describe('scope check functions', function() {
      var testStore = {
        id: 2,
        replenishments: [{
          id: 3
        }]
      };
      it('should check store replenishments array for doesStoreInstanceHaveReplenishments', function() {
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(true);
        testStore.replenishments = [];
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(false);

      });
      it('should return false for isStoreViewExpanded when given store is expanded', function() {
        scope.openStoreInstanceId = 2;
        expect(scope.isStoreViewExpanded(testStore)).toEqual(true);
        testStore.id = 3;
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(false);
      });
    });
  });

  describe('toggle checkboxes', function() {
    it('should set all stores with a Checkbox to be selected', function() {
      scope.storeInstanceList = [{
        id: 1,
        selected: false,
        actionButtons: ['Checkbox']
      }, {
        id: 2,
        selected: false,
        actionButtons: ['Delete']
      }];
      scope.allCheckboxesSelected = true;
      scope.toggleAllCheckboxes();
      expect(scope.storeInstanceList[0].selected).toEqual(true);
      expect(scope.storeInstanceList[1].selected).toEqual(false);
    });
  });

  describe('bulk actions', function() {
    describe('bulk dispatch', function() {
      it('should not update items that are not ready for dispatch', function() {
        scope.storeInstanceList = [{
          id: 1,
          actionButtons: ['Pack'],
          selected: true
        }, {
          id: 2,
          actionButtons: ['Seals'],
          selected: true
        }, {
          id: 3,
          actionButtons: ['Dispatch'],
          selected: true
        }];
        scope.bulkDispatch();
        expect(storeInstanceDashboardFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(3, '4');

      });
      it('should call update status for each selected item', function() {
        scope.storeInstanceList = [{
          id: 1,
          actionButtons: ['Dispatch'],
          selected: true
        }, {
          id: 2,
          actionButtons: ['Dispatch'],
          selected: true
        }, {
          id: 3,
          actionButtons: ['Dispatch'],
          selected: false
        }];
        scope.bulkDispatch();
        expect(storeInstanceDashboardFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(1, '4');
        expect(storeInstanceDashboardFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(2, '4');
      });

    });

  });

  describe('isUndispatchPossible', function() {
    beforeEach(function() {
      scope.storeInstanceList = [{
        id: 1,
        hours: 3
      }];
    });

    it('should return true if current time is within set hours of updatedTime', function() {
      scope.storeInstanceList[0].updatedOn = moment.utc().subtract(1, 'hour').format(
        'YYYY-MM-DD HH:mm:ss.SSSSSS');
      expect(scope.isUndispatchPossible(scope.storeInstanceList[0])).toEqual(true);
    });

    it('should return false if current time is within set hours of updatedTime', function() {
      scope.storeInstanceList[0].updatedOn = moment.utc().subtract(50, 'hour').format(
        'YYYY-MM-DD HH:mm:ss.SSSSSS');
      expect(scope.isUndispatchPossible(scope.storeInstanceList[0])).toEqual(false);
    });

    it('should return false if updatedOn is null', function() {
      scope.storeInstanceList[0].updatedOn = null;
      expect(scope.isUndispatchPossible(scope.storeInstanceList[0])).toEqual(false);
    });

    it('should return false if the store instance has replenishments', function() {
      scope.storeInstanceList[0].updatedOn = moment.utc().subtract(1, 'hour').format(
        'YYYY-MM-DD HH:mm:ss.SSSSSS');
      scope.storeInstanceList[0].replenishments = [{
        id: 3
      }];
      expect(scope.isUndispatchPossible(scope.storeInstanceList[0])).toEqual(false);
    });

    it('should return true if hours equal -1 (the default hours)', function() {
      scope.storeInstanceList[0].updatedOn = moment.utc().subtract(50, 'hour').format(
        'YYYY-MM-DD HH:mm:ss.SSSSSS');
      scope.storeInstanceList[0].hours = -1;
      expect(scope.isUndispatchPossible(scope.storeInstanceList[0])).toEqual(true);
    });
  });

  describe('undispatch', function() {
    beforeEach(function() {
      scope.undispatch(2);
    });
    it('should update status to 1', function() {
      expect(storeInstanceDashboardFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(2, 1);
    });
  });

  describe('storeStatusReceived', function() {
    beforeEach(function() {
      spyOn(scope, 'storeStatusReceived').and.callThrough();
      updateStoreInstanceStatusDeferred.resolve();
      scope.$digest();
    });

    it('updateStoreInstance should have been called', function() {
      scope.storeStatusReceived(33);
      expect(storeInstanceDashboardFactory.updateStoreInstanceStatus).toHaveBeenCalled();
    });
  });

  describe('doesStoreInstanceContainAction', function() {

    beforeEach(function() {
      scope.storeStatusList = statusListResponseJSON;
    });

    it('should exist on scope', function() {
      expect(scope.doesStoreInstanceContainAction).toBeDefined();
    });

    it('should return direct mapping of actionButtons', function() {
      var testStoreInstance = {
        actionButtons: ['Pack', 'Seal', 'Dispatch'],
        statusId: 7
      };
      var doesContainAllActions = scope.doesStoreInstanceContainAction(testStoreInstance, 'Pack') &&
        scope.doesStoreInstanceContainAction(testStoreInstance, 'Seal') &&
        scope.doesStoreInstanceContainAction(testStoreInstance, 'Dispatch');
      expect(doesContainAllActions).toEqual(true);
    });

    it('should return false if store instance has no actionButtons', function() {
      var testStoreInstance = {
        statusId: 7
      };
      var doesContainAction = scope.doesStoreInstanceContainAction(testStoreInstance, 'Pack');
      expect(doesContainAction).toEqual(false);
    });
  });

  describe('shouldShowReplenishAction', function() {
    var parentStoreInstance;
    beforeEach(function() {
      scope.storeStatusList = statusListResponseJSON;
      parentStoreInstance = {
        statusId: 7
      };
    });

    it('should exist on scope', function() {
      expect(scope.shouldShowReplenishAction).toBeDefined();
    });

    it('should return direct mapping for non dispatched replenishments', function() {
      var testStoreInstance = {
        actionButtons: ['Pack', 'Seal', 'Dispatch'],
        statusId: 1
      };
      var doesContainAllActions = scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance,
          'Pack') &&
        scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance, 'Seal') &&
        scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance, 'Dispatch');
      expect(doesContainAllActions).toEqual(true);
    });

    it('should allow get docs for replenishments after dispatch', function() {
      var testStoreInstance = {
        actionButtons: ['Get Flight Docs'],
        statusId: 7 // 7 to test with Dispatched status
      };
      var doesContainAction = scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance,
        'Get Flight Docs');
      expect(doesContainAction).toEqual(true);
    });

    it('should not allow actions after a replenishment has been dispatch', function() {
      var testStoreInstance = {
        actionButtons: ['End Instance'],
        statusId: 7 // 7 to test with Dispatched status
      };
      var doesContainAction = scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance,
        'End Instance');
      expect(doesContainAction).toEqual(false);
    });

    it('should allow get docs for replenishments with parents that are onfloor', function() {
      parentStoreInstance.statusId = 10; // 10 to test with onfloor status
      var testStoreInstance = {
        actionButtons: ['Get Flight Docs'],
        statusId: 7 // 7 to test with Dispatched status
      };
      var doesContainAction = scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance,
        'Get Flight Docs');
      expect(doesContainAction).toEqual(true);
    });

    it('should not allow other actions after a replenishment with parents that are onfloor', function() {
      parentStoreInstance.statusId = 10; // 10 to test with onfloor status
      var testStoreInstance = {
        actionButtons: ['End Instance'],
        statusId: 7 // 7 to test with Dispatched status
      };
      var doesContainAction = scope.shouldShowReplenishAction(testStoreInstance, parentStoreInstance,
        'End Instance');
      expect(doesContainAction).toEqual(false);
    });
  });

  describe('navigateToAction', function() {
    var testStoreInstance;
    beforeEach(function() {
      scope.$digest();
      testStoreInstance = {
        id: 1,
        replenishStoreInstanceId: null,
        prevStoreInstanceId: null
      };
    });

    it('should navigate to dispatch wizard if replenishId and prevId is null for packing/seals/dispatch',
      function() {
        scope.navigateToAction(testStoreInstance, 'Seal');
        expect(location.path).toHaveBeenCalledWith('store-instance-seals/dispatch/1');
        scope.navigateToAction(testStoreInstance, 'Pack');
        expect(location.path).toHaveBeenCalledWith('store-instance-packing/dispatch/1');
        scope.navigateToAction(testStoreInstance, 'Dispatch');
        expect(location.path).toHaveBeenCalledWith('store-instance-review/dispatch/1');
      });
    it('should navigate to replenish wizard if replenishID is not null for packing/seals', function() {
      testStoreInstance.replenishStoreInstanceId = 2;
      scope.navigateToAction(testStoreInstance, 'Seal');
      expect(location.path).toHaveBeenCalledWith('store-instance-seals/replenish/1');
      scope.navigateToAction(testStoreInstance, 'Pack');
      expect(location.path).toHaveBeenCalledWith('store-instance-packing/replenish/1');
    });
    it('should navigate to redispatch wizard if prevId is not null for seals/dispatch', function() {
      testStoreInstance.prevStoreInstanceId = 5;
      scope.navigateToAction(testStoreInstance, 'Seal');
      expect(location.path).toHaveBeenCalledWith('store-instance-seals/redispatch/1');
      scope.navigateToAction(testStoreInstance, 'Dispatch');
      expect(location.path).toHaveBeenCalledWith('store-instance-review/redispatch/1');
    });
    it('should call get store instance to find parent instance for pack', function() {
      testStoreInstance.prevStoreInstanceId = 5;
      scope.navigateToAction(testStoreInstance, 'Pack');
      expect(storeInstanceDashboardFactory.getStoreInstance).toHaveBeenCalledWith(5);
    });
    it('should call get store instances to find a redispatched child store instance for offload/inbound seals',
      function() {
        scope.navigateToAction(testStoreInstance, 'Offload');
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalledWith({
          prevStoreInstanceId: 1,
          limit: 1
        });
        scope.navigateToAction(testStoreInstance, 'Inbound Seals');
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalledWith({
          prevStoreInstanceId: 1,
          limit: 1
        });
      });
    it('should navigate to create for replenish/redispatch/end-instance actions', function() {
      scope.navigateToAction(testStoreInstance, 'Replenish');
      expect(location.path).toHaveBeenCalledWith('store-instance-create/replenish/1');
      scope.navigateToAction(testStoreInstance, 'Redispatch');
      expect(location.path).toHaveBeenCalledWith('store-instance-create/redispatch/1');
      scope.navigateToAction(testStoreInstance, 'End Instance');
      expect(location.path).toHaveBeenCalledWith('store-instance-create/end-instance/1');
    });
  });

  describe('showClearButton', function() {
    it('should return true when search has input', function() {
      scope.search.scheduleStartDate = '2012-02-02';
      scope.getStoreInstanceDashboardData();
      scope.$digest();
      expect(scope.showClearButton()).toBeTruthy();
    });

    it('should return false when search is clear', function() {
      scope.search.scheduleStartDate = '';
      scope.getStoreInstanceDashboardData();
      scope.$digest();
      expect(scope.showClearButton()).toBeFalsy();
    });

    it('should return true when searchIsActive and search is clear', function() {
      scope.search.scheduleStartDate = '';
      scope.getStoreInstanceDashboardData();
      scope.$digest();
      scope.searchIsActive = true;
      expect(scope.showClearButton()).toBeTruthy();
    });
  });

  describe('storeSelectionToggled', function() {
    it('should set hasSelectedStore to false and exportBulkURL to empty string', function() {
      scope.getStoreInstanceDashboardData();
      scope.$digest();
      scope.storeSelectionToggled();
      expect(scope.hasSelectedStore).toBeFalsy();
      expect(scope.exportBulkURL).toEqual('');
    });

    it('should set hasSelectedStore to true and exportBulkURL to valid values', function() {
      scope.getStoreInstanceDashboardData();
      scope.$digest();
      var store = _lodash.filter(scope.storeInstanceList, function(s) { return s.id === 53; })[0];
      expect(store.id).toEqual(53);
      store.selected = true;
      store.actionButtons = ['Get Flight Docs'];
      store.replenishments[0].selected = true;
      store.replenishments[0].actionButtons = ['Get Flight Docs'];
      scope.storeSelectionToggled();
      expect(scope.hasSelectedStore).toBeTruthy();
      expect(scope.exportBulkURL).toEqual(ENV.apiUrl + '/api/dispatch/store-instances/documents/C208.pdf?sessionToken=fakeSessionToken&storeInstanceIds=53+1038');
    });
  });

});
