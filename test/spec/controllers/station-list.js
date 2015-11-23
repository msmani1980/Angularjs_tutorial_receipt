'use strict';

describe('The Stations List Controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module'
  ));

  var scope;
  var controller;
  var StationListCtrl;
  var templateCache;
  var compile;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile) {
    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
  }));

  function initController() {
    StationListCtrl = controller('StationListCtrl', {
      $scope: scope
    });
  }

  describe('when the controller loads', function() {

    beforeEach(function() {
      initController();
    });

    it('should have displayError set to false', function() {
      expect(scope.displayError).toBeFalsy();
    });

    it('should set the scope stations list', function() {
      expect(scope.stationList).toEqual(jasmine.any(Array));
    });

  });

});
