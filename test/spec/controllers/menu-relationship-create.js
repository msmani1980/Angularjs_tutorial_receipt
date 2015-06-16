'use strict';

describe('Controller: MenuRelationshipCreateCtrl', function () {

  var $rootScope,
    $scope,
    $controller,
    $location,
    MenuRelationshipCreateCtrl,
    menuAPIResponse,
    stationAPIResponse;

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/menus.json', 'served/caterer-stations.json'));

  beforeEach(inject(function (_$rootScope_, _$controller_, $injector,
    _servedMenus_, _servedCatererStations_) {
    $location = $injector.get('$location');
    $location.path('/menu-relationship-create');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    MenuRelationshipCreateCtrl = $controller(
      'MenuRelationshipCreateCtrl', {
        '$rootScope': $rootScope,
        '$scope': $scope
      });
    menuAPIResponse = _servedMenus_;
    stationAPIResponse = _servedCatererStations_;
  }));

  describe('The MenuRelationshipCreateCtrl', function () {

    it('should be defined', function () {
      expect(MenuRelationshipCreateCtrl).toBeDefined();
    });

    it('should have a the route /menu-relationship-create', function () {
      expect($location.path()).toBe('/menu-relationship-create');
    });

  });

  describe('view', function () {

    var $templateCache,
      $compile,
      html,
      view;

    beforeEach(inject(function (_$templateCache_, _$compile_) {
      $templateCache = _$templateCache_;
      $compile = _$compile_;
      html = $templateCache.get(
        '/views/menu-relationship-create.html');
      var compiled = $compile(angular.element(html))($scope);
      view = angular.element(compiled[0]);
      $scope.$digest();
    }));

    it('should be defined', function () {
      expect(view).toBeDefined();
    });

    describe('container', function () {

      var container;

      beforeEach(function () {
        container = angular.element(view.find(
          '.fluid-container')[0]);
      });

      it('should be defined', function () {
        expect(container).toBeDefined();
      });

    });

  });

});
