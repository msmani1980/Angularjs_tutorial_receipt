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
    'served/company-menu-caterer-stations.json'
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedCateringStations_,
    _servedMenuMasterList_,
    _servedCarrierNumbers_, _servedStoresList_, _servedStoreInstanceCreated_,
    _servedSchedulesDateRange_, _servedCompanyMenuCatererStations_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;
    carrierNumbersJSON = _servedCarrierNumbers_;
    storesListJSON = _servedStoresList_;
    storeInstanceCreatedJSON = _servedStoreInstanceCreated_;
    schedulesDateRangeJSON = _servedSchedulesDateRange_;
    companyMenuCatererStationsJSON = _servedCompanyMenuCatererStations_;

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

    storeInstanceId = 13;

    postPayloadControl = {
      scheduleDate: '20150915',
      menus: [{
        menuMasterId: 19
      }, {
        menuMasterId: 6
      }],
      cateringStationId: 13,
      scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
  }

  function initController(action) {
    var params = {
      action: (action ? action : 'dispatch')
    };
    if(params.action !== 'dispatch'){
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

  function mockLoadStoreInstance() {
    spyOn(StoreInstanceCreateCtrl, 'setStoreInstanceData').and.callThrough();
    getStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
  }

  describe('when the Dispatch controller loads', function() {

    beforeEach(function(){
      initController();
    });

    it('should set wizardSteps', function() {
      var wizardSteps = storeInstanceWizardConfig.getSteps('dispatch');
      expect($scope.wizardSteps).toEqual(wizardSteps);
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


  describe('loading the dispatch for replenish', function() {

    beforeEach(function() {
      initController('replenish');
      resolveAllDependencies();
      mockLoadStoreInstance();
      $scope.$digest();
    });

    it('should have called the setStoreInstanceData method', function(){
      expect(StoreInstanceCreateCtrl.setStoreInstanceData).toHaveBeenCalled();
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
        scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
        scheduleDate:  dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        menus: [{
          menuMasterId:100
        }],
        cateringStationId:13,
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
        scheduleDate: '20150902',
        cateringStationId: '13',
        scheduleNumber: 'SCH1241411',
        carrierId: null,
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
      $scope.$digest();
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
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith('Creating a store dispatch');
    });

    it('should format the payload', function() {
      expect(StoreInstanceCreateCtrl.formatPayload).toHaveBeenCalled();
    });

    it('should call the createStoreInstance method on the factory', function() {
      expect(storeInstanceFactory.createStoreInstance).toHaveBeenCalled();
    });

    describe('success handler', function() {

      beforeEach(function() {
        mockStoreInstanceCreate();
        createStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        $scope.$digest();
      });

      it('should hide the loading modal', function() {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the success handler', function() {
        expect(StoreInstanceCreateCtrl.createStoreInstanceSuccessHandler).toHaveBeenCalledWith(
          storeInstanceCreatedJSON);
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store dispatch '+ storeInstanceCreatedJSON.id + ' created!';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success', message);
      });

      it('should redirect the user to the packing page with the new store instance id', function() {
        var url = '/store-instance-packing/dispatch/' + storeInstanceCreatedJSON.id;
        expect(location.path()).toEqual(url);
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
      spyOn(StoreInstanceCreateCtrl, 'loadStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoreInstanceData').and.callThrough();
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
        var message = 'Store replenish '+ storeInstanceCreatedJSON.id + ' created!';
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
          scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
        scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
        scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
        expect(StoreInstanceCreateCtrl.exitOnSave).toHaveBeenCalledWith(storeInstanceCreatedJSON);
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
      spyOn(StoreInstanceCreateCtrl, 'menuMasterResponseHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'getStoresList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl, 'setStoresList').and.callThrough();
      $scope.formData = {
        scheduleDate: dateUtility.nowFormatted(),
        menus: [{
          id: 100,
          name: 'ABC43124'
        }],
        cateringStationId: 13,
        scheduleNumber: { scheduleNumber: 'SCH1241411' },
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
      expect(StoreInstanceCreateCtrl.menuMasterResponseHandler).toHaveBeenCalled();
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
        endDate: '20151001',
        startDate: '20151001'
      };
      expect(StoreInstanceCreateCtrl.getFormattedDatesPayload()).toEqual(queryControl);
    });

  });

  describe('isReplenish method', function() {

    it('should be true, if $routeParams.action is Replenish', function() {
      initController('replenish');
      expect($scope.isReplenish()).toBeTruthy();
    });

    it('should be false, if $routeParams.action is End-Dispatch', function() {
      initController('end-dispatch');
      expect($scope.isReplenish()).toBeFalsy();
    });

  });

  describe('isEndInstance method', function() {

    it('should be true, if $routeParams.action is End-Dispatch', function() {
      initController('end-instance');
      expect($scope.isEndInstance()).toBeTruthy();
    });

    it('should be false, if $routeParams.action is Replenish', function() {
      initController('replenish');
      expect($scope.isEndInstance()).toBeFalsy();
    });

  });

});
