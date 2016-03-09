'use strict';

describe('Controller: ManualStoreInstanceCtrl', function() {

  beforeEach(module('ts5App'));

  var ManualStoreInstanceCtrl;
  var scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualStoreInstanceCtrl = $controller('ManualStoreInstanceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(ManualStoreInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
