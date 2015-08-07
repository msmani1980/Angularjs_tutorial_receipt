'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App', 'served/lmp-delivery-note.json', 'served/catering-stations.json', 'served/menu-catering-stations.json'));

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

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _deliveryNoteFactory_,
                              _servedLmpDeliveryNote_, $location, _servedCateringStations_,
                              _servedMenuCateringStations_) {

    companyId = 403;

    scope = $rootScope.$new();
    location = $location;
    deliveryNoteFactory = _deliveryNoteFactory_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;
    cateringStationsReponseJSON = _servedCateringStations_;
    companyMenuCatererStationsResponseJSON = _servedMenuCateringStations_;

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
        id: 38
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
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set deliveryNote scope var', function(){
      expect(scope.deliveryNote).toBeDefined();
    });
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
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set cateringStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
    });
    it('should call deliveryNoteFactory.getCompanyMenuCatererStations', function(){
      expect(deliveryNoteFactory.getCompanyMenuCatererStations).toHaveBeenCalled();
    });
  });

  describe('Edit controller action', function(){
    beforeEach(inject(function($controller){
      routeParams = {
        state: 'edit',
        id: 38
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
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set deliveryNote scope var', function(){
      expect(scope.deliveryNote).toBeDefined();
    });
    it('should call stock management get delivery note api with id', function(){
      expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
    });
    it('should set cateringStationList scope var', function(){
      expect(scope.catererStationList).toBeDefined();
    });
    it('should call deliveryNoteFactory.getCompanyMenuCatererStations', function(){
      expect(deliveryNoteFactory.getCompanyMenuCatererStations).toHaveBeenCalled();
    });
  });

});
