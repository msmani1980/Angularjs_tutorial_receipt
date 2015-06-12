'use strict';

describe('Controller: MenuRelationshipListCtrl', function () {

  var $rootScope,
    $scope,
    $controller,
    $location,
    MenuRelationshipListCtrl,
    $httpBackend;

  beforeEach(module('ts5App'));
  //beforeEach(module('ts5App', 'template-module'));
  /*beforeEach(module(
    'served/caterer-stations-list.json'
  ));*/


  beforeEach(inject(function (_$rootScope_, _$controller_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
    $location.path('/menu-relationship-list');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    MenuRelationshipListCtrl = $controller('MenuRelationshipListCtrl', {
      '$rootScope': $rootScope,
      '$scope': $scope
    });
  }));

  describe('The MenuRelationshipListCtrl', function () {

    it('should be defined', function () {
      expect(MenuRelationshipListCtrl).toBeDefined();
    });

    it('should have a the route /menu-relationship-list', function () {
      expect($location.path()).toBe('/menu-relationship-list');
    });

  });


});
