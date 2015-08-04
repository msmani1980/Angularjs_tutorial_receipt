'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App', 'served/lmp-delivery-note.json'));

  var LmpDeliveryNoteCtrl;
  var scope;
  var stockManagementService;
  var lmpDeliveryNoteResponseJSON;
  var getDeliveryNoteDeffered;
  var routeParams;
  var location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _stockManagementService_, _servedLmpDeliveryNote_, $location) {

    scope = $rootScope.$new();
    location = $location;
    stockManagementService = _stockManagementService_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;

    getDeliveryNoteDeffered = $q.defer();
    getDeliveryNoteDeffered.resolve(lmpDeliveryNoteResponseJSON);
    spyOn(stockManagementService, 'getDeliveryNote').and.returnValue(getDeliveryNoteDeffered.promise);
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

  describe('Read controller action, aka view', function(){
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
      expect(stockManagementService.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
    });
    it('should set deliveryNote scope var', function(){
      expect(scope.deliveryNote).toBeDefined();
    });
  });
});
