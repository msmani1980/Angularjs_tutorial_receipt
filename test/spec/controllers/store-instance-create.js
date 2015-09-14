'use strict';

describe('Store Instance Create Controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/catering-stations.json',
    'served/menu-master-list.json',
    'served/carrier-numbers.json',
    'served/stores-list.json',
    'served/store-instance-created.json'
  ));

  var StoreInstanceCreateCtrl,
    $scope,
    storeInstanceFactory,
    storeInstanceService,
    catererStationService,
    cateringStationsJSON,
    getCatererStationListDeferred,
    menuMasterService,
    menuMasterListJSON,
    getMenuMasterListDeferred,
    carrierService,
    carrierNumbersJSON,
    getCarrierNumbersDeferred,
    storesService,
    storesListJSON,
    getStoresListDeferred,
    location,
    httpBackend,
    postPayloadControl,
    dateUtility,
    storeInstanceCreatedJSON,
    createStoreInstanceDeferred,
    templateCache,
    compile,
    storeInstanceDispatchWizardConfig;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope,$injector,
     _servedCateringStations_,_servedMenuMasterList_,_servedCarrierNumbers_,
     _servedStoresList_,_servedStoreInstanceCreated_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;
    carrierNumbersJSON = _servedCarrierNumbers_;
    storesListJSON = _servedStoresList_;
    storeInstanceCreatedJSON = _servedStoreInstanceCreated_;

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();
    dateUtility = $injector.get('dateUtility');

    storeInstanceFactory = $injector.get('storeInstanceFactory');
    storeInstanceService = $injector.get('storeInstanceService');
    menuMasterService = $injector.get('menuMasterService');
    catererStationService = $injector.get('catererStationService');
    carrierService = $injector.get('carrierService');
    storesService = $injector.get('storesService');
    templateCache = $injector.get('$templateCache');
    compile = $injector.get('$compile');
    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');

    getMenuMasterListDeferred = $q.defer();
    getMenuMasterListDeferred.resolve(menuMasterListJSON);
    spyOn(menuMasterService, 'getMenuMasterList').and.returnValue(
      getMenuMasterListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    getCarrierNumbersDeferred = $q.defer();
    getCarrierNumbersDeferred.resolve(carrierNumbersJSON);
    spyOn(carrierService, 'getCarrierNumbers').and.returnValue(
      getCarrierNumbersDeferred.promise);

    getStoresListDeferred = $q.defer();
    getStoresListDeferred.resolve(storesListJSON);
    spyOn(storesService, 'getStoresList').and.returnValue(
      getStoresListDeferred.promise);

    createStoreInstanceDeferred = $q.defer();
    spyOn(storeInstanceService, 'createStoreInstance').and.returnValue(
      createStoreInstanceDeferred.promise);

    StoreInstanceCreateCtrl = $controller('StoreInstanceCreateCtrl', {
      $scope: $scope
    });

    postPayloadControl = {
       scheduleDate:'20150915',
       menus:[
          { menuMasterId:19 },
          { menuMasterId:6 }
       ],
       cateringStationId:13,
       scheduleNumber:'SCH1241411',
       storeId:13
    };

    $scope.formData = {
     scheduleDate: '9/15/2015',
     menus: [
       {id:19,name:'ABC43124'},
       {id:6,name:'MNDA412'}
     ],
     cateringStationId:13,
     scheduleNumber:'SCH1241411',
     storeId:13
   };

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  function renderView() {
    var html = templateCache.get('/views/store-instance-create.html');
    var compiled = compile(angular.element(html))($scope);
    var view = angular.element(compiled[0]);
    $scope.$digest();
    return view;
  }

  function mockFormSubmission(form) {
    form.triggerHandler('submit');
    $scope.submitForm();
    $scope.$digest();
  }

  describe('when the controller loads', function() {

    it('should have an empty stations list before the scope is digested', function () {
      expect($scope.cateringStationList).toEqual([]);
    });

    it('should set wizardSteps', function(){
      var wizardSteps = storeInstanceDispatchWizardConfig.getSteps();
      expect($scope.wizardSteps).toEqual(wizardSteps);
    });

    describe('The cateringStationList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stations in the cateringStationList', function () {
        expect($scope.cateringStationList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.cateringStationList).toEqual(cateringStationsJSON.response);
      });

    });

    it('should have an empty menu list before the scope is digested', function () {
      expect($scope.menuMasterList).toEqual([]);
    });

    describe('The menuMasterList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more menus in the menuMasterList', function () {
        expect($scope.menuMasterList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.menuMasterList).toEqual(menuMasterListJSON.companyMenuMasters);
      });

    });

    it('should have an empty carrierNumbers list before the scope is digested', function () {
      expect($scope.carrierNumbers).toEqual([]);
    });

    describe('The carrierNumbers array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more carrier numbers in the carrierNumbers list', function () {
        expect($scope.carrierNumbers.length).toBeGreaterThan(0);
      });

      it('should be match the carrierNumbers list from the carrier numbers API Respone',function () {
        expect($scope.carrierNumbers).toEqual(carrierNumbersJSON.response);
      });

    });

    it('should have an empty storesList  before the scope is digested', function () {
      expect($scope.storesList).toEqual([]);
    });

    describe('The storesList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stores in the storesList', function () {
        expect($scope.storesList.length).toBeGreaterThan(0);
      });

      it('should be match the storesList list from the stores numbers API Respone',function () {
        expect($scope.storesList).toEqual(storesListJSON.response);
      });

    });

  });

  describe('The formatPayload functionality', function () {

    function mockFormatPayload() {
      $scope.$digest();
      return StoreInstanceCreateCtrl.formatPayload();
    }

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'formatMenus').and.callThrough();
    });

    it('should call the formatMenus method', function () {
      mockFormatPayload();
      expect(StoreInstanceCreateCtrl.formatMenus).toHaveBeenCalled();
    });

    it('should format the scheduleDate for the API', function () {
      var formattedDateControl = dateUtility.formatDateForAPI($scope.formData.scheduleDate);
      var payload = mockFormatPayload();
      expect(payload.scheduleDate).toEqual(formattedDateControl);
    });

    it('should return a formatted payload object', function () {
      var payload = mockFormatPayload();
      expect(payload).toEqual(postPayloadControl);
    });

  });

  describe('the formatMenus method', function () {

    var menus;

    function mockFormatMenus() {
      $scope.$digest();
      return StoreInstanceCreateCtrl.formatMenus($scope.formData.menus);
    }

    beforeEach(function() {
      menus = mockFormatMenus();
    });

    it('should return a menus array', function () {
      expect(menus).toEqual(jasmine.any(Array));
    });

    it('should replace the select ui id with the menuMasterId', function () {
      expect(menus[0].menuMasterId).toEqual($scope.formData.menus[0].id);
    });

    it('should remove the name property from the payload', function () {
      expect(menus[0].name).toBeUndefined();
    });

  });

  describe('The createStoreInstance functionality', function () {

    function mockSubmission() {
      $scope.$digest();
      StoreInstanceCreateCtrl.createStoreInstance();

    }

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl,'formatPayload').and.callThrough();
      spyOn(storeInstanceFactory,'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl,'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'showMessage');
      mockSubmission();
    });

    it('should display the loading modal', function () {
      expect(StoreInstanceCreateCtrl.displayLoadingModal).toHaveBeenCalledWith('Creating a store instance');
    });

    it('should format the payload', function () {
      expect(StoreInstanceCreateCtrl.formatPayload).toHaveBeenCalled();
    });

    it('should call the createStoreInstance method on the factory', function () {
      expect(storeInstanceFactory.createStoreInstance).toHaveBeenCalled();
    });

    describe('success handler', function(){

      beforeEach(function() {
        mockSubmission();
        createStoreInstanceDeferred.resolve(storeInstanceCreatedJSON);
        $scope.$digest();
      });

      it('should hide the loading modal', function () {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the success handler', function () {
        expect(StoreInstanceCreateCtrl.createStoreInstanceSuccessHandler).toHaveBeenCalledWith(storeInstanceCreatedJSON);
      });

      it('should display a success message if the response contains an id', function() {
        var message = 'Store Instance created id: ' + storeInstanceCreatedJSON.id;
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('success',message);
      });

    });

    describe('error handler', function(){

      var errorResponse;

      beforeEach(function() {
        errorResponse = [{
          field:'storeId',
          code:'023',
          value:null,
          rowIndex:null,
          columnIndex:null
        }];
        createStoreInstanceDeferred.reject(errorResponse);
        $scope.$digest();
      });

      it('should hide the loading modal', function () {
        expect(StoreInstanceCreateCtrl.hideLoadingModal).toHaveBeenCalled();
      });

      it('should call the error handler', function () {
        expect(StoreInstanceCreateCtrl.createStoreInstanceErrorHandler).toHaveBeenCalledWith(errorResponse);
      });

    });

  });

  describe('The submit form method', function () {

    var view;
    var form;

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'validateForm').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'resetErrors');
      spyOn(StoreInstanceCreateCtrl,'createStoreInstance');
      $scope.$digest();
      view = renderView();
      form = angular.element(view.find('form')[0]);
    });

    it('should call the validateForm method', function () {
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.validateForm).toHaveBeenCalled();
    });

    it('should reset all the form errors', function () {
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.resetErrors).toHaveBeenCalled();
    });

    describe('the form validation method', function() {

      it('should return false if the form is not valid', function () {
        $scope.formData = {
          menus:[]
        };
        $scope.$digest();
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeFalsy();
      });

      it('should return false no menus are passed', function () {
        $scope.formData.menus = [];
        $scope.$digest();
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeFalsy();
      });

      it('should return true if all the correct data is passed', function () {
        $scope.$digest();
        var formIsValid = StoreInstanceCreateCtrl.validateForm();
        expect(formIsValid).toBeTruthy();
      });

    });



    it('should call createStoreInstance if the form does validate', function () {
      $scope.$digest();
      mockFormSubmission(form);
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalled();
    });

  });

  describe('setting the validation classes on the input', function () {

    var view;
    var form;

    beforeEach(function() {
      view = renderView();
      form = angular.element(view.find('form')[0]);
    });

    it('should return nothing if the field is pristine', function () {
      var className = $scope.validateInput('ScheduleNumber');
      expect(className).toEqual('');
    });

    it('should return .has-error if the field is invalid', function () {
      $scope.createStoreInstance.ScheduleNumber.$setViewValue('');
      mockFormSubmission(form);
      var className = $scope.validateInput('ScheduleNumber');
      expect(className).toEqual('has-error');
    });

    it('should return .has-success if the field is not invalid', function () {
      $scope.createStoreInstance.ScheduleNumber.$setViewValue('SCHED12345');
      mockFormSubmission(form);
      var className = $scope.validateInput('ScheduleNumber');
      expect(className).toEqual('has-success');
    });

  });

  describe('setting the validation classes on the menus', function () {

    var view;
    var form;
    var menuSelect;

    beforeEach(function() {
      view = renderView();
      form = angular.element(view.find('form')[0]);
      menuSelect = angular.element(form.find('ui-select')[0]);
      $scope.$digest();
    });

    it('should return nothing if the form has not been submitted', function () {
      var className = $scope.validateMenus();
      expect(className).toEqual('');
    });

    it('should return .has-error if there are no menus', function () {
      $scope.formData.menus = [];
      $scope.$digest();
      $scope.createStoreInstance.Menus.$setViewValue([]);
      mockFormSubmission(form);
      var className = $scope.validateMenus();
      expect(className).toEqual('has-error');
    });

    it('should return .has-success if there are menus', function () {
      $scope.$digest();
      $scope.createStoreInstance.Menus.$setViewValue($scope.formData.menus);
      mockFormSubmission(form);
      var className = $scope.validateMenus();
      expect(className).toEqual('has-success');
    });

  });

  describe('when a user changes the scheduleDate', function () {

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'getMenuMasterList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'setMenuMasterList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'getStoresList').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'setStoresList').and.callThrough();
      $scope.$digest();
      $scope.formData.scheduleDate = '10/01/2015';
      $scope.$digest();
    });

    it('should call getMenuMasterList', function () {
      expect(StoreInstanceCreateCtrl.getMenuMasterList).toHaveBeenCalled();
    });

    it('should call setMenuMasterList', function () {
      expect(StoreInstanceCreateCtrl.setMenuMasterList).toHaveBeenCalled();
    });

    it('should call getStoresList', function () {
      expect(StoreInstanceCreateCtrl.getStoresList).toHaveBeenCalled();
    });

    it('should call setStoresList', function () {
      expect(StoreInstanceCreateCtrl.setStoresList).toHaveBeenCalled();
    });

  });

  describe('generating the query', function () {

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'generateQuery').and.callThrough();
      $scope.$digest();
    });

    it('should call the generateQuery function when getMenuMasterList is called', function () {
      StoreInstanceCreateCtrl.getMenuMasterList();
      expect(StoreInstanceCreateCtrl.generateQuery).toHaveBeenCalled();
    });

    it('should call the generateQuery function when getStoresList is called', function () {
      StoreInstanceCreateCtrl.getStoresList();
      expect(StoreInstanceCreateCtrl.generateQuery).toHaveBeenCalled();
    });

    it('should call return a query object', function () {
      $scope.formData.scheduleDate = '10/01/2015';
      $scope.$digest();
      var queryControl = {
        startDate: '20151001'
      };
      expect(StoreInstanceCreateCtrl.generateQuery()).toEqual(queryControl);
    });

  });

});
