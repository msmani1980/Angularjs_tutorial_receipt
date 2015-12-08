'use strict';

describe('The Station Create Controller', function () {

  beforeEach(module(
    'ts5App',
    'template-module'
  ));

  var scope;
  var controller;
  var StationCreateCtrl;
  var templateCache;
  var compile;

  beforeEach(inject(function($controller, $rootScope,$templateCache,$compile) {
    scope = $rootScope.$new();
    controller = $controller;
    templateCache = $templateCache;
    compile = $compile;
  }));

  function initController() {
    StationCreateCtrl = controller('StationCreateCtrl', {
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

    it('should set the global stations list', function() {
      expect(scope.globalStationList).toEqual(jasmine.any(Array));
    });

  });

});
