'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/lmp-delivery-note.json'));

  var LmpDeliveryNoteCtrl,
    scope,
    stockManagementService,
    lmpDeliveryNoteResponseJSON,
    getDeliveryNoteDeffered;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _stockManagementService_, _servedLmpDeliveryNote_) {

    scope = $rootScope.$new();
    stockManagementService = _stockManagementService_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;

    getDeliveryNoteDeffered = $q.defer();
    getDeliveryNoteDeffered.resolve(lmpDeliveryNoteResponseJSON);
    spyOn(stockManagementService, 'getDeliveryNote').and.returnValue(getDeliveryNoteDeffered.promise);

    LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
      $scope: scope
    });
  }));

  describe('scope vars', function(){
    it('should have a state scope var defined', function(){
      expect(scope.state).toBeDefined();
    });
    it('should have an id scope var defined', function(){
      expect(scope.id).toBeDefined();
    });
  });

  describe('controller init', function(){
    it('should call stock management get delivery note api', function(){
      expect(stockManagementService.getDeliveryNote).toHaveBeenCalled();
    });
  });
});
