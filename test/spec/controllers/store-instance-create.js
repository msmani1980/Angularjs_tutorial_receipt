'use strict';

describe('Store Instance Create Controller', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/catering-stations.json',
    'served/menu-master-list.json',
    'served/carrier-numbers.json',
    'served/stores-list.json',
    'served/store-instance-created.json',
    'served/schedules-date-range.json',
    'served/company-menu-caterer-stations.json',
    'served/store-instance-details.json',
    'served/store-instances-list-onfloor.json',
    'served/seal-types.json',
    'served/store-instance-seals.json',
    'served/store-instance-item-list.json'
  ));

  var StoreInstanceCreateCtrl;
  var $scope;
  var storeInstanceFactory;
  var storeInstanceService;
  var catererStationService;
  var menuCatererStationsService;
  var cateringStationsJSON;
  var getCatererStationListDeferred;
  var menuMasterService;
  var menuMasterListJSON;
  var getMenuMasterListDeferred;
  var carrierService;
  var carrierNumbersJSON;
  var getCarrierNumbersDeferred;
  var storesService;
  var storesListJSON;
  var getStoresListDeferred;
  var location;
  var postPayloadControl;
  var dateUtility;
  var storeInstanceCreatedJSON;
  var createStoreInstanceDeferred;
  var templateCache;
  var compile;
  var storeInstanceWizardConfig;
  var schedulesService;
  var getSchedulesInDateRangeDeferred;
  var schedulesDateRangeJSON;
  var companyMenuCatererStationsJSON;
  var getRelationshipListDeferred;
  var controller;
  var storeInstanceId;
  var getStoreInstanceDeferred;
  var updateStoreInstanceStatusDeferred;
  var getStoreDetailsDeferred;
  var updateStoreInstanceDeferred;
  var storeDetailsJSON;
  var getOnFloorInstancesDeferred;
  var onFloorInstanceJSON;
  var sealTypesService;
  var sealTypesJSON;
  var getSealTypesDeferred;
  var storeInstanceSealService;
  var storeInstanceAssignSealsFactory;
  var getStoreInstanceSealsDeferred;
  var servedStoreInstanceItemsJSON;
  var getStoreInstanceItemsDeferred;
  var storeInstanceSealsJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedCateringStations_,
    _servedMenuMasterList_, _servedCarrierNumbers_, _servedStoresList_, _servedStoreInstanceCreated_,
    _servedSchedulesDateRange_, _servedCompanyMenuCatererStations_, _servedStoreInstanceDetails_,
    _servedStoreInstancesListOnfloor_, _servedSealTypes_, _servedStoreInstanceItemList_,
    _servedStoreInstanceSeals_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;
    carrierNumbersJSON = _servedCarrierNumbers_;
    storesListJSON = _servedStoresList_;
    storeInstanceCreatedJSON = _servedStoreInstanceCreated_;
    schedulesDateRangeJSON = _servedSchedulesDateRange_;
    companyMenuCatererStationsJSON = _servedCompanyMenuCatererStations_;
    storeDetailsJSON = _servedStoreInstanceDetails_;
    onFloorInstanceJSON = _servedStoreInstancesListOnfloor_;
    sealTypesJSON = _servedSealTypes_;
    storeInstanceSealsJSON = _servedStoreInstanceSeals_;
    servedStoreInstanceItemsJSON = _servedStoreInstanceItemList_;

    location = $injector.get('$location');
    $scope = $rootScope.$new();
    dateUtility = $injector.get('dateUtility');
    controller = $controller;

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceService = $injector.get('storeInstanceService');
    menuMasterService = $injector.get('menuMasterService');
    catererStationService = $injector.get('catererStationService');
    carrierService = $injector.get('carrierService');
    storesService = $injector.get('storesService');
    menuCatererStationsService = $injector.get('menuCatererStationsService');
    templateCache = $injector.get('$templateCache');
    compile = $injector.get('$compile');
    storeInstanceWizardConfig = $injector.get('storeInstanceWizardConfig');
    schedulesService = $injector.get('schedulesService');
    sealTypesService = $injector.get('sealTypesService');
    storeInstanceSealService = $injector.get('storeInstanceSealService');
    storeInstanceAssignSealsFactory = $injector.get('storeInstanceAssignSealsFactory');

    getMenuMasterListDeferred = $q.defer();
    spyOn(menuMasterService, 'getMenuMasterList').and.returnValue(getMenuMasterListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(getCatererStationListDeferred.promise);

    getCarrierNumbersDeferred = $q.defer();
    spyOn(carrierService, 'getCarrierNumbers').and.returnValue(getCarrierNumbersDeferred.promise);

    getStoresListDeferred = $q.defer();
    spyOn(storesService, 'getStoresList').and.returnValue(getStoresListDeferred.promise);

    createStoreInstanceDeferred = $q.defer();
    spyOn(storeInstanceService, 'createStoreInstance').and.returnValue(createStoreInstanceDeferred.promise);

    getSchedulesInDateRangeDeferred = $q.defer();
    spyOn(schedulesService, 'getSchedulesInDateRange').and.returnValue(getSchedulesInDateRangeDeferred.promise);

    getRelationshipListDeferred = $q.defer();
    spyOn(menuCatererStationsService, 'getRelationshipList').and.returnValue(getRelationshipListDeferred.promise);

    getStoreInstanceDeferred = $q.defer();
    spyOn(storeInstanceService, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);

    updateStoreInstanceStatusDeferred = $q.defer();
    spyOn(storeInstanceService, 'updateStoreInstanceStatus').and.returnValue(
      updateStoreInstanceStatusDeferred.promise);

    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);

    updateStoreInstanceDeferred = $q.defer();
    spyOn(storeInstanceService, 'updateStoreInstance').and.returnValue(updateStoreInstanceDeferred.promise);

    getOnFloorInstancesDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreInstancesList').and.returnValue(getOnFloorInstancesDeferred.promise);

    getSealTypesDeferred = $q.defer();
    spyOn(sealTypesService, 'getSealTypes').and.returnValue(getSealTypesDeferred.promise);

    getStoreInstanceSealsDeferred = $q.defer();
    spyOn(storeInstanceAssignSealsFactory, 'getStoreInstanceSeals').and.returnValue(
      getStoreInstanceSealsDeferred.promise);

    getStoreInstanceItemsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);

    storeInstanceId = 13;

    postPayloadControl = {
      scheduleDate: '20150915',
      menus: [{
        menuMasterId: 19
      }, {
        menuMasterId: 6
      }],
      cateringStationId: 13,
      scheduleNumber: {
        scheduleNumber: 'SCH1241411'
      },
      storeId: storeInstanceId
    };

  }));

  function resolveAllDependencies() {
    getMenuMasterListDeferred.resolve(menuMasterListJSON);
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    getCarrierNumbersDeferred.resolve(carrierNumbersJSON);
    getStoresListDeferred.resolve(storesListJSON);
    getSchedulesInDateRangeDeferred.resolve(schedulesDateRangeJSON);
    getRelationshipListDeferred.resolve(companyMenuCatererStationsJSON);
    getStoreDetailsDeferred.resolve(storeDetailsJSON);
    getOnFloorInstancesDeferred.resolve(onFloorInstanceJSON);
    getSealTypesDeferred.resolve(sealTypesJSON);
    getStoreInstanceSealsDeferred.resolve(storeInstanceSealsJSON);
    getStoreInstanceItemsDeferred.resolve(servedStoreInstanceItemsJSON);
  }

  function initController(action, edit) {
    var params = {
      action: (action ? action : 'dispatch')
    };
    if (params.action !== 'dispatch' || edit) {
      params.storeId = storeInstanceId;
    }
    StoreInstanceCreateCtrl = controller('StoreInstanceCreateCtrl', {
      $scope: $scope,
      $routeParams: params
    });
  }

  function mockStoreInstanceCreate() {
    $scope.$digest();
    StoreInstanceCreateCtrl.createStoreInstance();
  }

  function mockStoreInstanceUpdate() {
    $scope.$digest();
    StoreInstanceCreateCtrl.updateStoreInstance();
  }

  function mockLoadStoreInstance(data) {
    getStoreInstanceDeferred.resolve(
      (data ? data : storeInstanceCreatedJSON)
    );
    $scope.$digest();
  }

  function mockEndStoreInstance(exitOnSave) {
    $scope.$digest();
    StoreInstanceCreateCtrl.endStoreInstance(exitOnSave);
  }

  function mockRedispatchStoreInstance(exitOnSave) {
    $scope.$digest();
    StoreInstanceCreateCtrl.redispatchStoreInstance(exitOnSave);
  }

  function mockEditDispatchedStoreInstance(saveAndExit) {
    $scope.$digest();
    StoreInstanceCreateCtrl.editDispatchedStoreInstance(saveAndExit);
  }

  function mockEditRedispatchedStoreInstance(saveAndExit) {
    $scope.$digest();
    StoreInstanceCreateCtrl.editRedispatchedStoreInstance(saveAndExit);
  }

  describe('when the Dispatch controller loads', function() {

    beforeEach(function() {
      initController();
      spyOn(StoreInstanceCreateCtrl, 'determineMinDate').and.callThrough();
    });

    it('should set wizardSteps', function() {
      resolveAllDependencies();
      $scope.$digest();
      var wizardSteps = storeInstanceWizardConfig.getSteps('dispatch');
      expect($scope.wizardSteps).toEqual(wizardSteps);
    });

    it('should determine the minimum date on success', function() {
      resolveAllDependencies();
      $scope.$digest();
      expect(StoreInstanceCreateCtrl.determineMinDate).toHaveBeenCalled();
    });

    it('should set the minimum date in the scope on success', function() {
      resolveAllDependencies();
      $scope.$digest();
      var minDateControl = StoreInstanceCreateCtrl.determineMinDate();
      expect($scope.minDate).toEqual(minDateControl);
    });

    it('should have an empty stations list before the scope is digested', function() {
      expect($scope.cateringStationList).toEqual([]);
    });

    describe('The cateringStationList array', function() {

      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });

      it('should have (1) or more stations in the cateringStationList', function() {
        expect($scope.cateringStationList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Response', function() {
        var response;
        var makeResponsePayload = function() {
          var cateringStations = cateringStationsJSON.response;
          delete cateringStations[0].$$hashKey;
          delete cateringStations[1].$$hashKey;
          response = cateringStations;
        };
        makeResponsePayload();
        expect($scope.cateringStationList).toEqual(response);
      });

    });

    it('should have an empty menu list before the scope is digested', function() {
      expect($scope.menuMasterList).toEqual([]);
    });

    describe('The menuMasterList array', function() {

      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });

      it('should have (1) or more menus in the menuMasterList', function() {
        expect($scope.menuMasterList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone', function() {
        expect($scope.menuMasterList).toEqual(menuMasterListJSON.companyMenuMasters);
      });

    });

    it('should have an empty carrierNumbers list before the scope is digested', function() {
      expect($scope.carrierNumbers).toEqual([]);
    });

    describe('The carrierNumbers array', function() {

      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });

      it('should have (1) or more carrier numbers in the carrierNumbers list', function() {
        expect($scope.carrierNumbers.length).toBeGreaterThan(0);
      });

      it('should be match the carrierNumbers list from the carrier numbers API Respone', function() {
        expect($scope.carrierNumbers).toEqual(carrierNumbersJSON.response);
      });

    });

    it('should have an empty storesList  before the scope is digested', function() {
      expect($scope.storesList).toEqual([]);
    });

    describe('The storesList array', function() {

      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });

      it('should have (1) or more stores in the storesList', function() {
        expect($scope.storesList.length).toBeGreaterThan(0);
      });

      it('should be match the storesList list from the stores numbers API Respone', function() {
        expect($scope.storesList).toEqual(storesListJSON.response);
      });

    });

    it('should have an empty scheduleNumbers array before the scope is digested', function() {
      expect($scope.scheduleNumbers).toEqual([]);
    });

    describe('the scheduleNumbers array', function() {
      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });
      it('should be set to same lenght as API response', function() {
        expect($scope.scheduleNumbers.length).toBe(schedulesDateRangeJSON.meta.count);
      });

    });

    describe('The get the onFloorInstance list', function() {

      beforeEach(function() {
        resolveAllDependencies();
        $scope.$digest();
      });

      it('should set the onFloor list from the stations API Respone', function() {
        expect($scope.storeInstancesOnFloor).toEqual(onFloorInstanceJSON.response);
      });

    });

  });

  describe('the get store details API call', function() {

    beforeEach(function() {
      initController('redispatch');
      resolveAllDependencies();
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'determineMinDate').and.callThrough();
      spyOn(dateUtility, 'diff').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setCateringStationId').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setScheduleDate').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreId').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setCarrierId').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setMenus').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreNumber').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setPrevStoreInstanceId').and.callThrough();
      $scope.$digest();
    });

    it('should get the store details', function() {
      mockLoadStoreInstance();
      expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(storeInstanceId);
    });

    it('should attach all properties of JSON to scope', function() {
      mockLoadStoreInstance();
      $scope.$digest();
      expect($scope.storeDetails).toEqual(storeDetailsJSON);
    });

    it('should should call all set dependancy methods, and return null or undefined', function() {
      $scope.$digest();
      expect(StoreInstanceCreateCtrl.setCateringStationId()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setScheduleDate()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setStoreId()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setCarrierId()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setMenus()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setStoreNumber()).toEqual(null);
      expect(StoreInstanceCreateCtrl.setPrevStoreInstanceId()).toEqual(null);
    });

    describe('determining the mininum date', function() {

      it('should have been called the determineMinDate method when the store instance is loaded',
        function() {
          mockLoadStoreInstance();
          expect(StoreInstanceCreateCtrl.determineMinDate).toHaveBeenCalled();
        });

      it('should call the date utility diff method', function() {
        mockLoadStoreInstance();
        expect(dateUtility.diff).toHaveBeenCalled();
      });

      it('should set the minDate in the scope', function() {
        mockLoadStoreInstance();
        expect($scope.minDate).toEqual(StoreInstanceCreateCtrl.determineMinDate());
      });

      it('should return a formatted string', function() {
        var mockData = angular.copy(storeDetailsJSON);
        mockData.scheduleDate = '20201010';
        mockLoadStoreInstance(mockData);
        var controlDiff = dateUtility.diff(
          dateUtility.nowFormatted(),
          $scope.formData.scheduleDate
        );
        var dateStringControl = '+' + controlDiff.toString() + 'd';
        var dateStringTest = StoreInstanceCreateCtrl.determineMinDate();
        expect(dateStringTest).toEqual(dateStringControl);
      });

    });

  });

  describe('formatting the payload for a dispatch', function() {

    var payloadControl;
    beforeEach(function() {
      initController();
      spyOn(StoreInstanceCreateCtrl, 'formatDispatchPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatMenus').and.callThrough();
      $scope.$digest();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      $scope.$digest();
      payloadControl = StoreInstanceCreateCtrl.formatPayload();
    });

    it('should call the formatDispatchPayload method', function() {
      expect(StoreInstanceCreateCtrl.formatDispatchPayload).toHaveBeenCalled();
    });

    it('should format the scheduleDate for the API', function() {
      var formattedDateControl = dateUtility.formatDateForAPI($scope.formData.scheduleDate);
      expect(payloadControl.scheduleDate).toEqual(formattedDateControl);
    });

    it('should return a formatted payload object', function() {
      var mockPayload = {
        scheduleDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        menus: [{
          menuMasterId: 100
        }],
        cateringStationId: 13,
        scheduleNumber: 'SCH1241411',
        storeId: 13
      };
      expect(mockPayload).toEqual(payloadControl);
    });

  });

  describe('formatting the payload for a replenish', function() {

    var payloadControl;
    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      mockLoadStoreInstance();
      $scope.$digest();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        dispatchedCateringStationId: 3,
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatReplenishPayload').and.callThrough();
      $scope.$digest();
      payloadControl = StoreInstanceCreateCtrl.formatPayload();
    });

    it('should call the formatReplenishPayload method', function() {
      expect(StoreInstanceCreateCtrl.formatReplenishPayload).toHaveBeenCalled();
    });

    it('should format the scheduleDate for the API', function() {
      var formattedDateControl = dateUtility.formatDateForAPI($scope.formData.scheduleDate);
      expect(payloadControl.scheduleDate).toEqual(formattedDateControl);
    });

    it('should return a formatted payload object', function() {
      var mockPayload = {
        scheduleDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        cateringStationId: 13,
        storeId: 13,
        scheduleNumber: 'SCH1241411',
        replenishStoreInstanceId: storeInstanceId
      };
      expect(mockPayload).toEqual(payloadControl);
    });

  });

  describe('the formatMenus method', function() {

    var menus;

    function mockFormatMenus() {
      return StoreInstanceCreateCtrl.formatMenus($scope.formData.menus);
    }

    beforeEach(function() {
      initController();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      menus = mockFormatMenus();
    });

    it('should return a menus array', function() {
      expect(menus).toEqual(jasmine.any(Array));
    });

    it('should replace the select ui id with the menuMasterId', function() {
      expect(menus[0].menuMasterId).toEqual($scope.formData.menus[0].id);
    });

    it('should remove the name property from the payload', function() {
      expect(menus[0].name).toBeUndefined();
    });

  });

  describe('The createStoreInstance functionality', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.formData = {
        scheduleDate: '9/15/2015',
        menus: [{
          id: 100,
          name: 'ABC43124'
        }, {
          id: 6,
          name: 'MNDA412'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatDispatchPayload').and.callThrough();
      spyOn(storeInstanceFactory, 'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'checkForOnFloorInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage');
      mockStoreInstanceCreate();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Creating new Store Instance');
    });

    it('should check if we are trying to perform a redispatch or end instance', function() {
      expect(StoreInstanceCreateCtrl.checkForOnFloorInstance).toHaveBeenCalled();
    });

    it('should format the payload', function() {
      expect(StoreInstanceCreateCtrl.formatPayload).toHaveBeenCalled();
    });

    it('should call the createStoreInstance method on the factory', function() {
      expect(storeInstanceFactory.createStoreInstance).toHaveBeenCalled();
    });

    describe('success handler', function() {

      beforeEach(function() {
        resolveAllDependencies();
        createStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the success handler', function() {
        expect(StoreInstanceCreateCtrl.createStoreInstanceSuccessHandler).toHaveBeenCalledWith([
          storeInstanceCreatedJSON
        ]);
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store dispatch ' + storeInstanceCreatedJSON.id + ' created!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the new store instance id', function() {
        var mockResponse = [storeInstanceCreatedJSON];
        var uriTest = StoreInstanceCreateCtrl.nextStep.uri.replace('undefined', mockResponse.id);
        var uriControl = '/store-instance-packing/dispatch/' + mockResponse.id;
        expect(uriTest).toEqual(uriControl);
      });

    });

    describe('error handler', function() {

      var errorResponse;

      beforeEach(function() {
        errorResponse = [{
          field: 'storeId',
          code: '023',
          value: null,
          rowIndex: null,
          columnIndex: null
        }];
        createStoreInstanceDeferred.reject(errorResponse);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the error handler', function() {
        expect(StoreInstanceCreateCtrl.createStoreInstanceErrorHandler).toHaveBeenCalledWith(
          errorResponse);
      });

    });

  });

  describe('The create replenish functionality', function() {

    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      getStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(storeInstanceFactory, 'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage');
      $scope.$digest();
      $scope.formData.scheduleNumber = {
        scheduleNumber: '194231'
      };
      mockStoreInstanceCreate();
    });

    describe('success handler', function() {

      beforeEach(function() {
        mockStoreInstanceCreate();
        createStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        $scope.$digest();
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store replenish ' + storeInstanceCreatedJSON.id + ' created!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the new store replenish id', function() {
        var url = '/store-instance-packing/replenish/' + storeInstanceCreatedJSON.id;
        expect(location.path()).toEqual(url);
      });

    });

  });

  describe('The update replenish functionality', function() {

    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      getStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'updateStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage');
      $scope.$digest();
      $scope.formData.scheduleNumber = {
        scheduleNumber: '194231'
      };
      mockStoreInstanceUpdate();
    });

    describe('success handler', function() {

      beforeEach(function() {
        mockStoreInstanceCreate();
        updateStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        updateStoreInstanceStatusDeferred.resolve({
          id: 13,
          statusId: 11
        });
        $scope.$digest();
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store replenish ' + storeInstanceCreatedJSON.id + ' updated!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the same store replenish id', function() {
        var url = '/store-instance-packing/replenish/' + storeInstanceId;
        expect(location.path()).toEqual(url);
      });

    });

  });

  describe('submitFormConditions method', function() {

    it('should call createStoreInstance if action state is default', function() {
      initController('dispatch');
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalled();
    });

    it('should call endStoreInstance if action state is end-instance', function() {
      initController('end-instance');
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'endStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.endStoreInstance).toHaveBeenCalled();
    });

    it('should call updateStoreInstance if action state is replenish', function() {
      initController('replenish');
      $scope.formData.replenishStoreInstanceId = 102;
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'updateStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.updateStoreInstance).toHaveBeenCalled();
    });

    it('should call editRedispatchedStoreInstance if action state is redispatch', function() {
      initController('redispatch');
      $scope.stepOneFromStepTwo = true;
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'editRedispatchedStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.editRedispatchedStoreInstance).toHaveBeenCalled();
    });

    it('should call redispatchStoreInstance if action state is redispatch', function() {
      initController('redispatch');
      $scope.stepOneFromStepTwo = false;
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'redispatchStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.redispatchStoreInstance).toHaveBeenCalled();
    });

    it('should call editDispatchedStoreInstance if action state is dispatch', function() {
      initController('dispatch', true);
      $scope.stepOneFromStepTwo = true;
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'editDispatchedStoreInstance');
      StoreInstanceCreateCtrl.submitFormConditions(true);
      expect(StoreInstanceCreateCtrl.editDispatchedStoreInstance).toHaveBeenCalled();
    });

  });

  describe('when a user changes the scheduleDate', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'getMenuMasterList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'registerScopeWatchers').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setUIReady').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setMenuMasterList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'getStoresList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoresList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'updateInstanceDependenciesSuccess').and.callThrough();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      $scope.$digest();
      $scope.formData.scheduleDate = '10/01/2020';
      $scope.$digest();
    });

    it('should call getMenuMasterList', function() {
      expect(StoreInstanceCreateCtrl.getMenuMasterList).toHaveBeenCalled();
    });

    it('should call setMenuMasterList', function() {
      expect(StoreInstanceCreateCtrl.setMenuMasterList).toHaveBeenCalled();
    });

    it('should call getStoresList', function() {
      expect(StoreInstanceCreateCtrl.getStoresList).toHaveBeenCalled();
    });

    it('should call setStoresList', function() {
      expect(StoreInstanceCreateCtrl.setStoresList).toHaveBeenCalled();
    });

    it('should call updateInstanceDependenciesSuccess', function() {
      expect(StoreInstanceCreateCtrl.updateInstanceDependenciesSuccess).toHaveBeenCalled();
    });

    it('should call getRelationshipList from menuCatererStationsService', function() {
      expect(menuCatererStationsService.getRelationshipList).toHaveBeenCalled();
    });
    it('should update the filtered menu list', function() {
      expect($scope.filteredMenuList.length).toBeGreaterThan(0);
    });

  });

  describe('when a user changes the cateringStationId', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'getMenuMasterList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'getMenuCatererList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'registerScopeWatchers').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'updateInstanceDependenciesSuccess').and.callThrough();
      $scope.formData = {
        cateringStationId: 3
      };
      $scope.$digest();
    });

    it('should call getMenuMasterList', function() {
      expect(StoreInstanceCreateCtrl.getMenuMasterList).toHaveBeenCalled();
    });

    it('should call getMenuCatererList', function() {
      expect(StoreInstanceCreateCtrl.getMenuCatererList).toHaveBeenCalled();
    });

    it('should call updateInstanceDependenciesSuccess', function() {
      expect(StoreInstanceCreateCtrl.updateInstanceDependenciesSuccess).toHaveBeenCalled();
    });

  });

  describe('generating the query', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceCreateCtrl, 'getFormattedDatesPayload').and.callThrough();
      $scope.$digest();
    });

    it('should call the getFormattedDatesPayload function when getMenuMasterList is called', function() {
      StoreInstanceCreateCtrl.getMenuMasterList();
      expect(StoreInstanceCreateCtrl.getFormattedDatesPayload).toHaveBeenCalled();
    });

    it('should call the getFormattedDatesPayload function when getStoresList is called', function() {
      StoreInstanceCreateCtrl.getStoresList();
      expect(StoreInstanceCreateCtrl.getFormattedDatesPayload).toHaveBeenCalled();
    });

    it('should call return a query object', function() {
      $scope.formData.scheduleDate = '10/01/2015';
      $scope.$digest();
      var queryControl = {
        startDate: '20151001',
        endDate: '20151001'
      };
      expect(StoreInstanceCreateCtrl.getFormattedDatesPayload()).toEqual(queryControl);
    });

  });

  describe('getting a stores list', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(storeInstanceFactory, 'getStoresList').and.callThrough();
      $scope.$digest();
    });

    it('should get stores that are ready to use', function() {
      $scope.formData.scheduleDate = '10/01/2015';
      var queryControl = {
        startDate: '20151001',
        endDate: '20151001',
        readyToUse: true
      };
      StoreInstanceCreateCtrl.getStoresList();
      expect(storeInstanceFactory.getStoresList).toHaveBeenCalledWith(queryControl);
    });

  });

  describe('get stores during replenish', function() {

    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      spyOn(storeInstanceFactory, 'getStoresList').and.callThrough();
      $scope.$digest();
    });

    it('should get stores that are not ready to use', function() {
      $scope.formData.scheduleDate = '10/01/2015';
      var queryControl = {
        startDate: '20151001',
        endDate: '20151001',
        readyToUse: false
      };
      StoreInstanceCreateCtrl.getStoresList();
      expect(storeInstanceFactory.getStoresList).toHaveBeenCalledWith(queryControl);
    });

  });

  describe('get store instance during replenish', function() {

    beforeEach(function() {
      storeDetailsJSON.scheduleDate = '20150902';
      initController('replenish', true);
      resolveAllDependencies();
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstance').and.callThrough();
      mockLoadStoreInstance();
    });

    it('should not have a scheduleNumber set', function() {
      expect($scope.formData.scheduleNumber).toBeUndefined();
    });

    it('should set the scheduleDate to todays date', function() {
      expect($scope.formData.scheduleDate).toEqual(dateUtility.formatDateForApp(storeDetailsJSON.scheduleDate));
    });

  });

  describe('get store instance during replenish when editing the instance', function() {

    beforeEach(function() {
      storeDetailsJSON.replenishStoreInstanceId = 123;
      storeDetailsJSON.cateringStationId = 13;
      storeDetailsJSON.parentStoreInstance = {
        menus: [{
          menuMasterId: 100,
          menuCode: 'SortTest'
        }]
      };
      initController('replenish');
      resolveAllDependencies();
      spyOn(StoreInstanceCreateCtrl, 'setStoreDetails').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setReplenishInstance').and.callThrough();
      mockLoadStoreInstance();
    });

    afterEach(function() {
      delete storeDetailsJSON.replenishStoreInstanceId;
      delete storeDetailsJSON.parentStoreInstance;
    });

    it('should set replenish ID in the formData object', function() {
      expect($scope.formData.replenishStoreInstanceId).toEqual(storeDetailsJSON.replenishStoreInstanceId);
    });

    it('should set catering station ID in the formData object', function() {
      expect($scope.formData.cateringStationId).toEqual(storeDetailsJSON.cateringStationId.toString());
    });

    it('should set the menus ID the formData object', function() {
      var menuControl = [{
        id: 100,
        menuCode: 'SortTest'
      }];
      expect($scope.formData.menus).toEqual(menuControl);
    });

  });

  describe('isActionState method', function() {

    it('should return true if the state passed matches the action state of the controller', function() {
      initController();
      var isDispatch = StoreInstanceCreateCtrl.isActionState('dispatch');
      expect(isDispatch).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller',
      function() {
        initController();
        var isDispatch = StoreInstanceCreateCtrl.isActionState('replenish');
        expect(isDispatch).toBeFalsy();
      });

    it('should return true if the state passed matches the action state of the controller', function() {
      initController('replenish');
      var isReplenish = StoreInstanceCreateCtrl.isActionState('replenish');
      expect(isReplenish).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller',
      function() {
        initController();
        var isReplenish = StoreInstanceCreateCtrl.isActionState('replenish');
        expect(isReplenish).toBeFalsy();
      });

    describe('when calling it from the $scope', function() {
      beforeEach(function() {
        initController();
        spyOn(StoreInstanceCreateCtrl, 'isActionState');
        $scope.$digest();
      });

      it('should call the controllers method', function() {
        $scope.isActionState('dispatch');
        expect(StoreInstanceCreateCtrl.isActionState).toHaveBeenCalledWith('dispatch');
      });

      it('should return what the controller method returns', function() {
        var scopeTest = $scope.isActionState('dispatch');
        var actionStateControl = StoreInstanceCreateCtrl.isActionState('dispatch');
        expect(scopeTest).toEqual(actionStateControl);
      });

    });

  });

  describe('isDispatchOrRedispatch method', function() {

    it('should be true is action state is dispatch', function() {
      initController('dispatch');
      expect(StoreInstanceCreateCtrl.isDispatchOrRedispatch()).toBeTruthy();
    });

    it('should be false is action state is not dispatch', function() {
      initController('replenish');
      expect(StoreInstanceCreateCtrl.isDispatchOrRedispatch()).toBeFalsy();
    });

    it('should be true is action state is redispatch', function() {
      initController('redispatch');
      expect(StoreInstanceCreateCtrl.isDispatchOrRedispatch()).toBeTruthy();
    });

  });

  describe('isEndInstanceOrRedispatch method', function() {

    it('should be true is action state is end-instance', function() {
      initController('end-instance');
      expect(StoreInstanceCreateCtrl.isEndInstanceOrRedispatch()).toBeTruthy();
    });

    it('should be false is action state is not end-instance', function() {
      initController();
      expect(StoreInstanceCreateCtrl.isEndInstanceOrRedispatch()).toBeFalsy();
    });

    it('should be true is action state is redispatch', function() {
      initController('redispatch');
      expect(StoreInstanceCreateCtrl.isEndInstanceOrRedispatch()).toBeTruthy();
    });

    describe('when calling it from the $scope', function() {

      beforeEach(function() {
        initController('end-instance');
        spyOn(StoreInstanceCreateCtrl, 'isEndInstanceOrRedispatch');
        $scope.$digest();
      });

      it('should call the controllers method', function() {
        $scope.isEndInstanceOrRedispatch();
        expect(StoreInstanceCreateCtrl.isEndInstanceOrRedispatch).toHaveBeenCalled();
      });

      it('should return what the controller method returns', function() {
        var scopeTest = $scope.isEndInstanceOrRedispatch();
        var actionStateControl = StoreInstanceCreateCtrl.isEndInstanceOrRedispatch();
        expect(scopeTest).toEqual(actionStateControl);
      });

    });

  });

  describe('findStatusObject functionality', function() {

    beforeEach(function() {
      initController('redispatch');
      mockLoadStoreInstance();
      resolveAllDependencies();
      $scope.$digest();
    });

    it('should return a status object ', function() {
      var statusObject = StoreInstanceCreateCtrl.findStatusObject(StoreInstanceCreateCtrl.nextStep);
      expect(statusObject).toBeDefined();
    });

  });

  describe('updateStatusToStep functionality', function() {

    beforeEach(function() {
      initController('redispatch');
      spyOn(storeInstanceFactory, 'updateStoreInstanceStatus');
      spyOn(StoreInstanceCreateCtrl, 'findStatusObject').and.callThrough();
      mockLoadStoreInstance();
      resolveAllDependencies();
      $scope.$digest();
      StoreInstanceCreateCtrl.updateStatusToStep(StoreInstanceCreateCtrl.nextStep);
    });

    it('should call the findStatusObject function with the controllers next step ', function() {
      expect(StoreInstanceCreateCtrl.findStatusObject).toHaveBeenCalledWith(StoreInstanceCreateCtrl.nextStep);
    });

    it('should call the update status factore call', function() {
      var statusObject = StoreInstanceCreateCtrl.findStatusObject(StoreInstanceCreateCtrl.nextStep);
      expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(storeInstanceId,
        statusObject.name);
    });

  });

  describe('The endStoreInstance functionality', function() {

    beforeEach(function() {
      initController('end-instance');
      resolveAllDependencies();
      mockLoadStoreInstance();
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'setWizardSteps').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'endStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage').and.callThrough();
      mockEndStoreInstance();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Starting the End Instance process');
    });

    it('should display the loading modal, when saveAndExit is passed', function() {
      mockEndStoreInstance(true);
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Loading Store Instance Dashboard');
    });

    it('should call the updateStoreInstance method on the factory', function() {
      expect(storeInstanceService.updateStoreInstance).toHaveBeenCalled();
    });

    it('should call the endStoreInstance method on the controller', function() {
      expect(StoreInstanceCreateCtrl.endStoreInstance).toHaveBeenCalled();
    });

    describe('success handler', function() {
      var response;
      beforeEach(function() {
        response = [
          storeInstanceCreatedJSON, {
            id: 13,
            statusId: 11
          }
        ];
        updateStoreInstanceDeferred.resolve(response[0]);
        updateStoreInstanceStatusDeferred.resolve(response[1]);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store end-instance ' + response[response.length - 1].id + ' created!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the new store instance id', function() {
        var url = '/store-instance-seals/' + 'end-instance' + '/' + response[response.length - 1].id;
        expect(location.path()).toEqual(url);
      });

    });

    describe('error handler', function() {

      var errorResponse;

      beforeEach(function() {
        errorResponse = {
          id: 13,
          statusId: 11
        };
        updateStoreInstanceDeferred.reject(errorResponse);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the error handler', function() {
        expect(StoreInstanceCreateCtrl.createStoreInstanceErrorHandler).toHaveBeenCalledWith(
          errorResponse);
      });

    });

  });

  describe('The redispatchStoreInstance functionality', function() {

    beforeEach(function() {
      initController('redispatch');
      resolveAllDependencies();
      mockLoadStoreInstance();
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'exitToDashboard');
      spyOn(StoreInstanceCreateCtrl, 'updateStatusToStep').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'makeCreatePromises').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'makeRedispatchPromises').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage').and.callThrough();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      $scope.$digest();
      mockRedispatchStoreInstance();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Redispatching Store Instance ' + $scope.formData.cateringStationId);
    });

    it('should call the makeCreatePromises method on the controller', function() {
      expect(StoreInstanceCreateCtrl.makeCreatePromises).toHaveBeenCalled();
    });

    it('should call the makeRedispatchPromises method on the controller', function() {
      expect(StoreInstanceCreateCtrl.makeRedispatchPromises).toHaveBeenCalled();
    });

    it('should call the saveAndExit method on the controller', function() {
      mockRedispatchStoreInstance(true);
      expect(StoreInstanceCreateCtrl.exitToDashboard).toHaveBeenCalled();
    });

  });

  describe('The editDispatchedStoreInstance functionality', function() {

    beforeEach(function() {
      initController('dispatch', true);
      resolveAllDependencies();
      mockLoadStoreInstance();
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'exitToDashboard');
      spyOn(StoreInstanceCreateCtrl, 'updateStatusToStep').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage').and.callThrough();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      $scope.$digest();
      mockEditDispatchedStoreInstance();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Updating Store Instance ' + storeInstanceId);
    });

    it('should call the updateStoreInstance method on the controller', function() {
      spyOn(StoreInstanceCreateCtrl, 'removeAllDataForInstances').and.returnValue(true);
      mockEditDispatchedStoreInstance();
      expect(storeInstanceService.updateStoreInstance).toHaveBeenCalled();
    });

    it('should call the saveAndExit method on the controller', function() {
      mockEditDispatchedStoreInstance(true);
      expect(StoreInstanceCreateCtrl.exitToDashboard).toHaveBeenCalled();
    });

  });

  describe('The editRedispatchedStoreInstance functionality', function() {

    beforeEach(function() {
      initController('redispatch', true);
      $scope.stepOneFromStepTwo = true;
      resolveAllDependencies();
      mockLoadStoreInstance();
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'exitToDashboard');
      spyOn(StoreInstanceCreateCtrl, 'showWarningModal');
      spyOn(StoreInstanceCreateCtrl, 'hideWarningModal');
      spyOn(StoreInstanceCreateCtrl, 'updateStatusToStep').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'isActionState').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'registerScopeWatchers').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'registerMenusScopeWatchers').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'checkIfMenusHaveChanged').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreDetails').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'validateForm').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'submitFormConditions');
      spyOn($scope, 'submitForm');


      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: {
          scheduleNumber: 'SCH1241411'
        },
        storeId: storeInstanceId
      };
      $scope.prevStoreInstanceId = 12;
      $scope.$digest();
      mockEditRedispatchedStoreInstance();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.showLoadingModal).toHaveBeenCalledWith(
        'Updating Current Store Instance ' + storeInstanceId + ' and Previous Store Instance ' +
        $scope.prevStoreInstanceId
      );
    });

    it('should call the updateStoreInstance method on the controller', function() {
      spyOn(StoreInstanceCreateCtrl, 'removeAllDataForInstances').and.returnValue(true);
      mockEditRedispatchedStoreInstance();
      expect(storeInstanceService.updateStoreInstance).toHaveBeenCalled();
    });

    it('should call the saveAndExit method on the controller', function() {
      mockEditRedispatchedStoreInstance(true);
      expect(StoreInstanceCreateCtrl.exitToDashboard).toHaveBeenCalled();
    });

    it('should set showDataLossWarning to true, if the menus have changed', function() {
      $scope.formData.menus = [{
        id: 112,
        name: 'ABC43122'
      }];
      $scope.storeDetails.menuList = [{
        id: 101,
        name: 'ABC43125'
      }];
      $scope.$digest();
      expect($scope.showDataLossWarning).toBeTruthy();
    });

    it('should set showDataLossWarning to false, if the menus have not changed', function() {
      $scope.formData.menus = [{
        id: 100,
        name: 'ABC43124'
      }];
      $scope.storeDetails.menuList = [{
        id: 100,
        name: 'ABC43124'
      }];
      $scope.$digest();
      expect($scope.showDataLossWarning).toBeFalsy();
    });

    it('should showWarningModal if showDataLossWarning is true', function() {
      $scope.showDataLossWarning = true;
      StoreInstanceCreateCtrl.validateForm();
      expect(StoreInstanceCreateCtrl.showWarningModal).toHaveBeenCalled();
    });

    it('should hideWarningModal if the user proceedsToStepTwo', function() {
      $scope.proceedToStepTwo();
      expect(StoreInstanceCreateCtrl.hideWarningModal).toHaveBeenCalled();
    });

    it('on saveAndExit, submit form should be called with true', function() {
      $scope.saveAndExit();
      expect($scope.submitForm).toHaveBeenCalledWith(true);
    });

  });

  describe('menuPlaceholderText functionality', function() {

    it('should return nothing if the controller is not dispatch action', function() {
      initController('replenish');
      var menuPlaceholderText = $scope.menuPlaceholderText();
      expect(menuPlaceholderText).toEqual('');
    });

    it('should return text telling the user when there are menus to select', function() {
      initController();
      $scope.filteredMenuList = [{
        'id': 184,
        'menuCode': 'Replenish1234',
        'companyId': 403,
        'createdBy': 1,
        'createdOn': '2015-10-05 20:04:23.738279',
        'updatedBy': null,
        'updatedOn': null,
        'menuName': 'Replenish',
        'companyMenus': [{
          'startDate': '2015-10-06',
          'endDate': '2018-10-06',
          'createdBy': 1,
          'createdOn': '2015-10-05 20:04:23.89218',
          'updatedBy': null,
          'updatedOn': null,
          'id': 350,
          'menuCode': null,
          'menuName': null,
          'description': null,
          'companyId': null,
          'menuId': 184,
          'menuItems': null
        }]
      }];
      $scope.$digest();
      var menuPlaceholderText = $scope.menuPlaceholderText();
      expect(menuPlaceholderText).toEqual('Select one or more Menus');
    });

    it('should return text telling the user when there are no menus to select', function() {
      initController();
      var menuPlaceholderText = $scope.menuPlaceholderText();
      expect(menuPlaceholderText).toEqual('No menus are available to select');
    });

  });

  describe('when a user changes the cateringStationId during redispatch', function() {

    beforeEach(function() {
      initController('redispatch');
      resolveAllDependencies();
      spyOn(StoreInstanceCreateCtrl, 'removeInvalidMenus').and.callThrough();
      mockLoadStoreInstance();
      $scope.formData.cateringStationId = 3;
      $scope.formData.menus = [{
        id: 100,
        name: 'BOGAN123'
      }];
      $scope.$digest();
    });

    it('should call removeInvalidMenus', function() {
      expect(StoreInstanceCreateCtrl.removeInvalidMenus).toHaveBeenCalled();
    });

    it('should remove an invalid menu', function() {
      $scope.formData.cateringStationId = 13;
      $scope.formData.menus = [{
        id: 105,
        name: 'BOGAN123'
      }];
      $scope.$digest();
      expect($scope.formData.menus.length).toEqual(0);

    });

  });

  describe('omitting menus that have already been selected', function() {

    beforeEach(function() {
      initController('redispatch');
      resolveAllDependencies();
      mockLoadStoreInstance();
    });

    it('should return true if the menu is in the formData', function() {
      var filterMenu = $scope.omitSelectedMenus({
        id: 100,
        name: 'BOGAN123'
      });
      expect(filterMenu).toBeTruthy();
    });

    it('should return false if the menu is not in the formData', function() {
      $scope.formData.menus = [{
        id: 105,
        name: 'BOGAN123'
      }];
      $scope.$digest();
      var filterMenu = $scope.omitSelectedMenus({
        id: 105,
        name: 'BOGAN123'
      });
      expect(filterMenu).toBeFalsy();
    });

  });

  describe('when an existing seal is deleted', function() {

    var sealTypeObject;
    var storeId;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
      sealTypeObject = {
        id: 1,
        name: 'Outbound',
        color: '#00B200',
        seals: {
          numbers: ['21']
        },
        actions: undefined,
        required: true,
        order: 1
      };
      storeId = 1;
      spyOn(StoreInstanceCreateCtrl, 'determineSealsToDelete').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'getExistingSealsByType').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'getExistingSealByNumber').and.callThrough();
    });

    it('should determine what seals to be created', function() {
      spyOn(StoreInstanceCreateCtrl, 'makeDeleteSealsPromise').and.callThrough();
      StoreInstanceCreateCtrl.makeDeleteSealsPromise(sealTypeObject, storeId);
      expect(StoreInstanceCreateCtrl.determineSealsToDelete).toHaveBeenCalledWith(sealTypeObject, storeId);
    });

    it('should find a list of existing seals by type', function() {
      StoreInstanceCreateCtrl.determineSealsToDelete(sealTypeObject, storeId);
      expect(StoreInstanceCreateCtrl.getExistingSealsByType).toHaveBeenCalledWith(sealTypeObject.id,
        storeId);
    });

    it('should call makeDeleteSealsPromise', function() {
      spyOn(StoreInstanceCreateCtrl, 'makeDeleteSealsPromise');
      $scope.sealTypesList = sealTypeObject;
      StoreInstanceCreateCtrl.makeDeleteSealsPromises(storeId);
      expect(StoreInstanceCreateCtrl.makeDeleteSealsPromise).toHaveBeenCalled();
    });

  });

});
