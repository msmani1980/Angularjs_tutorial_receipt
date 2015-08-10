'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App',
    'served/lmp-delivery-note.json', 'served/catering-stations.json',
    'served/menu-catering-stations.json', 'served/master-item-list.json',
    'served/company-reason-codes.json'));

  var LmpDeliveryNoteCtrl;
  var scope;
  var deliveryNoteFactory;
  var lmpDeliveryNoteResponseJSON;
  var getDeliveryNoteDeferred;
  var routeParams;
  var location;
  var cateringStationsReponseJSON;
  var getCateringStationsDeferred;
  var companyId;
  var companyMenuCatererStationsResponseJSON;
  var getCompanyMenuCatererStationsDeferred;
  var getCatererStationMasterItemsResponseJSON;
  var getCatererStationMasterItemsDeferred;
  var getCompanyReasonCodesResponseJSON;
  var getCompanyReasonCodesDeferred;
  var getMasterItemResponseJSON;
  var getMasterItemDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _deliveryNoteFactory_,
                              _servedLmpDeliveryNote_, $location, _servedCateringStations_,
                              _servedMenuCateringStations_, _servedMasterItemList_,
                              _servedCompanyReasonCodes_) {

    companyId = 403;

    scope = $rootScope.$new();
    location = $location;
    deliveryNoteFactory = _deliveryNoteFactory_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;
    cateringStationsReponseJSON = _servedCateringStations_;
    companyMenuCatererStationsResponseJSON = _servedMenuCateringStations_;
    getCatererStationMasterItemsResponseJSON = _servedMasterItemList_;
    getCompanyReasonCodesResponseJSON = _servedCompanyReasonCodes_;
    getMasterItemResponseJSON = _servedMasterItemList_;

    getDeliveryNoteDeferred = $q.defer();
    getDeliveryNoteDeferred.resolve(lmpDeliveryNoteResponseJSON);
    spyOn(deliveryNoteFactory, 'getDeliveryNote').and.returnValue(getDeliveryNoteDeferred.promise);

    getCateringStationsDeferred = $q.defer();
    getCateringStationsDeferred.resolve(cateringStationsReponseJSON);
    spyOn(deliveryNoteFactory, 'getCatererStationList').and.returnValue(getCateringStationsDeferred.promise);

    spyOn(deliveryNoteFactory, 'getCompanyId').and.returnValue(companyId);

    getCompanyMenuCatererStationsDeferred = $q.defer();
    getCompanyMenuCatererStationsDeferred.resolve(companyMenuCatererStationsResponseJSON);
    spyOn(deliveryNoteFactory, 'getCompanyMenuCatererStations').and.returnValue(getCompanyMenuCatererStationsDeferred.promise);

    getCatererStationMasterItemsDeferred = $q.defer();
    getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
    spyOn(deliveryNoteFactory, 'getMasterItemsByCatererStationId').and.returnValue(getCatererStationMasterItemsDeferred.promise);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(getCompanyReasonCodesResponseJSON);
    spyOn(deliveryNoteFactory, 'getCompanyReasonCodes').and.returnValue(getCompanyReasonCodesDeferred.promise);

    getMasterItemDeferred = $q.defer();
    getMasterItemDeferred.resolve(getMasterItemResponseJSON);
    spyOn(deliveryNoteFactory, 'getAllMasterItems').and.returnValue(getMasterItemDeferred.promise);
  }));

  describe('invalid state passed to route', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'invalid'
      };
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should redirect to /', function(){
      expect(location.path()).toBe('/');
    });
  });

  describe('Read / view controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'view',
        id: 49
      };
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should have a state scope var set to view', function(){
      expect(scope.state).toBe('view');
    });
    // Apit call #1
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set deliveryNote scope var', function(){
      expect(scope.deliveryNote).toBeDefined();
    });
    // API call #2
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set cateringStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });
    // API call #3
    it('should call getAllMasterItems from factory', function(){
      expect(deliveryNoteFactory.getAllMasterItems).toHaveBeenCalled();
    });
    it('should set masterItems scope var', function(){
      expect(scope.masterItems).toBeDefined();
      expect(Object.prototype.toString.call(scope.masterItems)).toBe('[object Array]');
    });
    // Scope globals
    describe('global scope functions and vars', function(){
      it('should call getCompanyId', function(){
        expect(deliveryNoteFactory.getCompanyId).toHaveBeenCalled();
      });
    });
  });

  describe('Create controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'create'
      };
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should have a state scope var set to create', function(){
      expect(scope.state).toBe('create');
    });
    // API call #1
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set cateringStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
    });
    // API call #2
    it('should call deliveryNoteFactory.getCompanyMenuCatererStations', function(){
      expect(deliveryNoteFactory.getCompanyMenuCatererStations).toHaveBeenCalled();
    });
    // API call #3
    it('should call getCompanyReasonCodes in factory', function(){
      expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
    });
    it('should set the ullageReasons scope var', function(){
      expect(scope.ullageReasons).toBeDefined();
      expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
    });
    // API call #4
    it('should call getAllMasterItems from factory', function(){
      expect(deliveryNoteFactory.getAllMasterItems).toHaveBeenCalled();
    });
    it('should set masterItems scope var', function(){
      expect(scope.masterItems).toBeDefined();
      expect(Object.prototype.toString.call(scope.masterItems)).toBe('[object Array]');
    });
  });

  describe('Edit controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'edit',
        id: 49
      };
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));
    it('should have a state scope var set to create', function(){
      expect(scope.state).toBe('edit');
    });
    // API call #1
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set deliveryNote scope var', function(){
      expect(scope.deliveryNote).toBeDefined();
    });
    // API call #2
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set cateringStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
      expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
    });
    // API call #3
    it('should call deliveryNoteFactory.getCompanyMenuCatererStations', function(){
      expect(deliveryNoteFactory.getCompanyMenuCatererStations).toHaveBeenCalled();
    });
    // API call #4
    it('should call getCompanyReasonCodes in factory', function(){
      expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
    });
    it('should set the ullageReasons scope var', function(){
      expect(scope.ullageReasons).toBeDefined();
      expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
    });
    // API call #5
    it('should call getAllMasterItems from factory', function(){
      expect(deliveryNoteFactory.getAllMasterItems).toHaveBeenCalled();
    });
    it('should set masterItems scope var', function(){
      expect(scope.masterItems).toBeDefined();
      expect(Object.prototype.toString.call(scope.masterItems)).toBe('[object Array]');
    });
    describe('changing LMP station', function(){
      it('should call retail item master API', function(){
        var csid = 3;
        scope.deliveryNote.catererStationId = csid;
        scope.$digest();
        expect(deliveryNoteFactory.getMasterItemsByCatererStationId).toHaveBeenCalledWith(csid);
      });
      // TODO - update this test to check if length of deliveryNote.items length is increased
      it('should set scope catererStationMasterItems', function(){
        expect(scope.catererStationMasterItems).toBeDefined();
        expect(Object.prototype.toString.call(scope.catererStationMasterItems)).toBe('[object Array]');
      });
    });
    describe('removeItemByIndex scope function', function(){
      it('should have a removeItemByIndex scope function defined', function(){
        expect(scope.removeItemByIndex).toBeDefined();
        expect(Object.prototype.toString.call(scope.removeItemByIndex)).toBe('[object Function]');
      });
      it('should remove 1 item from the deliveryNote.items array', function(){
        var curCount = scope.deliveryNote.items.length;
        scope.removeItemByIndex(0);
        scope.$digest();
        expect(scope.deliveryNote.items.length).toBe((curCount - 1));
      });
    });
  });

});
