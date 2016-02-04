'use strict';

describe('Controller: ExciseDutyListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var ExciseDutyListCtrl;
  var exciseDutyFactory;
  var location;
  var dateUtility;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    location = $location;
    dateUtility = $injector.get('dateUtility');
    scope = $rootScope.$new();
    exciseDutyFactory = $injector.get('exciseDutyFactory');
    ExciseDutyListCtrl = $controller('ExciseDutyListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

});
