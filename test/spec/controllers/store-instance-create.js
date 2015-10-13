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
    'served/store-instance-details.json'
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
  var httpBackend;
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
  var storeDetailsJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedCateringStations_,
    _servedMenuMasterList_,
    _servedCarrierNumbers_, _servedStoresList_, _servedStoreInstanceCreated_,
    _servedSchedulesDateRange_, _servedCompanyMenuCatererStations_,
    _servedStoreInstanceDetails_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;
    carrierNumbersJSON = _servedCarrierNumbers_;
    storesListJSON = _servedStoresList_;
    storeInstanceCreatedJSON = _servedStoreInstanceCreated_;
    schedulesDateRangeJSON = _servedSchedulesDateRange_;
    companyMenuCatererStationsJSON = _servedCompanyMenuCatererStations_;
    storeDetailsJSON = _servedStoreInstanceDetails_;

    httpBackend = $injector.get('$httpBackend');
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

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  function resolveAllDependencies() {
    getMenuMasterListDeferred.resolve(menuMasterListJSON);
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    getCarrierNumbersDeferred.resolve(carrierNumbersJSON);
    getStoresListDeferred.resolve(storesListJSON);
    getSchedulesInDateRangeDeferred.resolve(schedulesDateRangeJSON);
    getRelationshipListDeferred.resolve(companyMenuCatererStationsJSON);
    getStoreDetailsDeferred.resolve(storeDetailsJSON);
  }

  function initController(action) {
    var params = {
      action: (action ? action : 'dispatch')
    };
    if (params.action !== 'dispatch') {
      params.storeId = storeInstanceId;
    }
    StoreInstanceCreateCtrl = controller('StoreInstanceCreateCtrl', {
      $scope: $scope,
      $routeParams: params
    });
  }

  function renderView() {
    var html = templateCache.get('/views/store-instance-create.html');
    var compiled = compile(angular.element(html))($scope);
    var view = angular.element(compiled[0]);
    $scope.$digest();
    return view;
  }

  function mockFormSubmission(form, saveAndExit) {
    form.triggerHandler('submit');
    $scope.submitForm((saveAndExit ? saveAndExit : false));
    $scope.$digest();
  }

  function mockStoreInstanceCreate() {
    $scope.$digest();
    StoreInstanceCreateCtrl.createStoreInstance();
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

  function mockRedispatchStoreInstance() {
    $scope.$digest();
    StoreInstanceCreateCtrl.createStoreInstance();
  }

  describe('when the Dispatch controller loads', function() {

    beforeEach(function() {
      initController();
      spyOn(StoreInstanceCreateCtrl,'determineMinDate').and.callThrough();
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

      it('should be match the stations list from the stations API Respone', function() {
        expect($scope.cateringStationList).toEqual(cateringStationsJSON.response);
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

  });

  describe('the get store details API call', function() {

    beforeEach(function() {
      initController('redispatch');
      resolveAllDependencies();
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl,'determineMinDate').and.callThrough();
      spyOn(dateUtility,'diff').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstance').and.callThrough();
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

    describe('determining the mininum date', function() {

      it('should have been called the determineMinDate method when the store instance is loaded', function() {
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
      resolveAllDependencies();
      $scope.$digest();
      spyOn(StoreInstanceCreateCtrl, 'formatDispatchPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatMenus').and.callThrough();
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
      resolveAllDependencies();
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
      spyOn(StoreInstanceCreateCtrl, 'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'formatDispatchPayload').and.callThrough();
      spyOn(storeInstanceFactory, 'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage');
      mockStoreInstanceCreate();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith(
        'Creating new Store Instance');
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
      spyOn(StoreInstanceCreateCtrl, 'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(storeInstanceFactory, 'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage');
      $scope.$digest();
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

  describe('The submit form method', function() {

    var view;
    var form;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      spyOn(StoreInstanceCreateCtrl, 'validateForm').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'resetErrors');
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstance');
      $scope.$digest();
      view = renderView();
      form = angular.element(view.find('form')[0]);
      $scope.$digest();
    });

    it('should call the validateForm method', function() {
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.validateForm).toHaveBeenCalled();
    });

    it('should reset all the form errors', function() {
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.resetErrors).toHaveBeenCalled();
    });

    describe('the form validation method', function() {

      it('should return false if the form is not valid', function() {
        $scope.formData = {
          menus: []
        };
        $scope.$digest();
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeFalsy();
      });

      it('should return false no menus are passed', function() {
        $scope.formData.menus = [];
        $scope.$digest();
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeFalsy();
      });

      it('should return true if all the correct data is passed', function() {
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
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeTruthy();
      });

    });

    it('should call createStoreInstance if the form does validate', function() {
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
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalled();
    });

  });

  describe('The save and exit functionality', function() {

    var view;
    var form;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
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
      spyOn($scope, 'submitForm').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'exitOnSave').and.callThrough();
      $scope.$digest();
      view = renderView();
      form = angular.element(view.find('form')[0]);
    });

    it('should call the submitForm method with the saveAndExit flag set as true', function() {
      $scope.saveAndExit();
      expect($scope.submitForm).toHaveBeenCalledWith(true);
    });

    it('should call the createStoreInstance method and pass the saveAndExit flag ', function() {
      $scope.saveAndExit();
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalledWith(true);
    });

    describe('exitOnSave success handler', function() {

      beforeEach(function() {
        $scope.saveAndExit();
        createStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        $scope.$digest();
      });

      it('should call exitOnSave', function() {
        expect(StoreInstanceCreateCtrl.exitOnSave).toHaveBeenCalledWith([storeInstanceCreatedJSON]);
      });

      it('should call change the location of the browser', function() {
        expect(location.path()).toEqual('/store-instance-dashboard/');
      });

    });

  });

  describe('setting the validation classes on the input', function() {

    var view;
    var form;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      view = renderView();
      form = angular.element(view.find('form')[0]);
    });

    it('should return nothing if the field is pristine', function() {
      var className = $scope.validateInput('scheduleNumber');
      expect(className).toEqual('');
    });

    it('should return .has-error if the field is invalid', function() {
      $scope.createStoreInstance.scheduleNumber.$setViewValue('');
      mockFormSubmission(form);
      var className = $scope.validateInput('scheduleNumber');
      expect(className).toEqual('has-error');
    });

    it('should return .has-success if the field is not invalid', function() {
      $scope.createStoreInstance.scheduleNumber.$setViewValue('SCHED12345');
      mockFormSubmission(form);
      var className = $scope.validateInput('scheduleNumber');
      expect(className).toEqual('has-success');
    });

  });

  describe('setting the validation classes on the menus', function() {

    var view;
    var form;
    var menuSelect;

    beforeEach(function() {
      initController();
      resolveAllDependencies();
      $scope.$digest();
      view = renderView();
      form = angular.element(view.find('form')[0]);
      menuSelect = angular.element(form.find('ui-select')[0]);
      $scope.$digest();
    });

    it('should return nothing if the form has not been submitted', function() {
      var className = $scope.validateMenus();
      expect(className).toEqual('');
    });

    it('should return .has-error if there are no menus', function() {
      $scope.formData.menus = [];
      $scope.$digest();
      mockFormSubmission(form);
      var className = $scope.validateMenus();
      expect(className).toEqual('has-error');
    });

    it('should return .has-success if there are menus', function() {
      var menus = [{
        id: 100,
        name: 'ABC43124'
      }];
      $scope.createStoreInstance.menus.$setViewValue($scope.formData.menus);
      $scope.formData.menus = menus;

      var className = $scope.validateMenus();
      expect(className).toEqual('has-success');
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
      $scope.formData = {
        cateringStationId: 13
      };
      $scope.$digest();
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

  describe('isActionState method', function() {

    it('should return true if the state passed matches the action state of the controller', function() {
      initController();
      var isDispatch = $scope.isActionState('dispatch');
      expect(isDispatch).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller', function() {
      initController();
      var isDispatch = $scope.isActionState('replenish');
      expect(isDispatch).toBeFalsy();
    });

    it('should return true if the state passed matches the action state of the controller', function() {
      initController('replenish');
      var isReplenish = $scope.isActionState('replenish');
      expect(isReplenish).toBeTruthy();
    });

    it('should return false if the state passed does not matches the action state of the controller', function() {
      initController();
      var isReplenish = $scope.isActionState('replenish');
      expect(isReplenish).toBeFalsy();
    });

  });

  describe('isEndInstanceOrRedispatch method', function() {

    it('should be true, if $routeParams.action is End Instance or ', function() {
      initController('end-instance');
      expect($scope.isEndInstanceOrRedispatch()).toBeTruthy();
    });

    it('should be false, if $routeParams.action is Replenish', function() {
      initController('replenish');
      expect($scope.isEndInstanceOrRedispatch()).toBeFalsy();
    });

    it('should be true, if $routeParams.action is Redispatch', function() {
      initController('redispatch');
      expect($scope.isEndInstanceOrRedispatch()).toBeTruthy();
    });

  });

  describe('findStatusObject functionality', function() {

    beforeEach(function(){
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

    beforeEach(function(){
      initController('redispatch');
      spyOn(storeInstanceFactory,'updateStoreInstanceStatus')();
      spyOn(StoreInstanceCreateCtrl,'findStatusObject').and.callThrough();
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
      expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(storeInstanceId,statusObject.name);
    });

  });

  describe('The endStoreInstance functionality', function() {

    beforeEach(function() {
      initController('end-instance');
      resolveAllDependencies();
      mockLoadStoreInstance();
      spyOn(StoreInstanceCreateCtrl, 'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'setWizardSteps').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'endStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'showMessage').and.callThrough();
      mockEndStoreInstance();
    });

    it('should display the loading modal', function() {
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith(
        'Starting the End Instance process');
    });

    it('should display the loading modal, when saveAndExit is passed', function() {
      mockEndStoreInstance(true);
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith(
        'Loading Store Instance Dashboard');
    });

    it('should call the updateStoreInstance method on the factory', function() {
      expect(storeInstanceService.updateStoreInstanceStatus).toHaveBeenCalled();
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
        updateStoreInstanceStatusDeferred.resolve(response);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store end-instance ' + response.id + ' created!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the new store instance id', function() {
        var url = '/store-instance-seals/' + 'end-instance' + '/' + response.id;
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
        updateStoreInstanceStatusDeferred.reject(errorResponse);
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
      spyOn(StoreInstanceCreateCtrl, 'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl, 'updateStatusToStep').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'createStoreInstance').and.callThrough();
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
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith(
        'Creating new Store Instance');
    });

    it('should call the createStoreInstance method on the controller', function() {
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalled();
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

});
