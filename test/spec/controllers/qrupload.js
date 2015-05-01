'use strict';

describe('Controller: QruploadCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var QruploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QruploadCtrl = $controller('QruploadCtrl', {
      $scope: scope
    });
  }));
 
});