'use strict';

describe('Controller: ManualECSCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var ManualECSCtrl;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope) {

    inject(function () {

    });

    //exciseDutyFactory = $injector.get('exciseDutyFactory');
    scope = $rootScope.$new();


    ManualECSCtrl = $controller('ManualECSCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


});
