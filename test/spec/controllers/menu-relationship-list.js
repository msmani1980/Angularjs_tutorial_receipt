'use strict';

describe('Controller: MenuRelationshipListCtrl', function () {

  var $rootScope,
    $scope,
    $controller,
    $location,
    MenuRelationshipListCtrl,
    menuAPIResponse;

  beforeEach(module('ts5App'));
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module(
    'served/menus.json'
  ));

  beforeEach(inject(function (_$rootScope_, _$controller_, $injector,
    _servedMenus_) {
    $location = $injector.get('$location');
    $location.path('/menu-relationship-list');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    MenuRelationshipListCtrl = $controller('MenuRelationshipListCtrl', {
      '$rootScope': $rootScope,
      '$scope': $scope
    });
    menuAPIResponse = _servedMenus_;
  }));

  describe('The MenuRelationshipListCtrl', function () {

    it('should be defined', function () {
      expect(MenuRelationshipListCtrl).toBeDefined();
    });

    it('should have a the route /menu-relationship-list', function () {
      expect($location.path()).toBe('/menu-relationship-list');
    });

  });

  describe('menus list', function () {

    it('should be defined', function () {
      expect($scope.menuList).toBeDefined();
    });

    it('should be contain at least one object in the menus array',
      function () {
        expect($scope.menuList.length).toBeGreaterThan(0);
      });

    it('should be match the menus from the menu API Respone',
      function () {
        expect($scope.menuList).toEqual(menuAPIResponse.menus);
      });

    describe('menu object', function () {

      var menuObject;

      beforeEach(function () {
        menuObject = $scope.menuList[0];
      });

      it('should be defined', function () {
        expect(menuObject).toBeDefined();
      });

      it('should have an id and it is a number', function () {
        expect(menuObject.id).toBeDefined();
        expect(menuObject.id).toEqual(jasmine.any(Number));
      });

      it('should have a companyId and it is a number', function () {
        expect(menuObject.companyId).toBeDefined();
        expect(menuObject.companyId).toEqual(jasmine.any(Number));
      });

      it('should have a menuCode and it is a number', function () {
        expect(menuObject.menuCode).toBeDefined();
        expect(menuObject.menuCode).toEqual(jasmine.any(String));
      });

      it('should have a menuName and it is a string', function () {
        expect(menuObject.menuName).toBeDefined();
        expect(menuObject.menuName).toEqual(jasmine.any(String));
      });

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
        '/views/menu-relationship-list.html');
      var compiled = $compile(angular.element(html))($scope);
      view = angular.element(compiled[0]);
      $scope.$digest();
    }));

    it('should be defined', function () {
      expect(view).toBeDefined();
    });

    it('should have an table', function () {
      expect(view.find('table').length).toEqual(1);
    });

    it(
      'should contain a list tr element which is the same length as the menu list ',
      function () {
        expect(view.find('table tbody tr').length).toEqual($scope.menuList
          .length);
      });

  });

});
