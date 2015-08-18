'use strict';

describe('Controller: StockTakeCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  // var StockTakeCtrl;
  var scope;
  var location;
  var stockTakeFactory;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    scope = $rootScope.$new();
    location = $location;
    stockTakeFactory = $injector.get('stockTakeFactory');
  }));

});
