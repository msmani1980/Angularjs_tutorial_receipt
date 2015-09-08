'use strict';

describe('Store Instance Create Controller', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
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
    createStoreInstanceDeferred;
  var storeInstanceDispatchWizardConfig;

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
      spyOn(StoreInstanceCreateCtrl,'resetErrors');
      spyOn(StoreInstanceCreateCtrl,'displayLoadingModal');
      spyOn(StoreInstanceCreateCtrl,'formatPayload').and.callThrough();
      spyOn(storeInstanceFactory,'createStoreInstance').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'hideLoadingModal');
      spyOn(StoreInstanceCreateCtrl,'createStoreInstanceSuccessHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'createStoreInstanceErrorHandler').and.callThrough();
      spyOn(StoreInstanceCreateCtrl,'showMessage');
      mockSubmission();
    });

    it('should reset all the form errors', function () {
      expect(StoreInstanceCreateCtrl.resetErrors).toHaveBeenCalled();
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

      it('should display a failure message', function() {
        var message = 'We couldn\'t create your Store Instance';
        expect(StoreInstanceCreateCtrl.showMessage).toHaveBeenCalledWith('failure',message);
      });

    });

  });

  describe('The submit form method', function () {

    beforeEach(function() {
      spyOn(StoreInstanceCreateCtrl,'createStoreInstance');
      $scope.$digest();
    });

    it('should call the createStoreInstance method', function () {
      $scope.submitForm();
      expect(StoreInstanceCreateCtrl.createStoreInstance).toHaveBeenCalled();
    });

  });

});
