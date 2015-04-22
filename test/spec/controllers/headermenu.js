'use strict';

describe('Controller: HeadermenuCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var HeadermenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeadermenuCtrl = $controller('HeadermenuCtrl', {
      $scope: scope
    });
  }));

});
