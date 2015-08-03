'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var LmpDeliveryNoteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
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
});
