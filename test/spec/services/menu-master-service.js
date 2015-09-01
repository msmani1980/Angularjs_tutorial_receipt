'use strict';

describe('Service: menuMasterService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuMasterService;
  var $httpBackend;

  beforeEach(inject(function (_menuMasterService_, $injector) {
    menuMasterService = _menuMasterService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMenuMasterList', function () {
    it('should make a GET request when calling getMenuMasterList', function () {
      $httpBackend.whenGET(/menus\/menu-masters/).respond({done: true});
      menuMasterService.getMenuMasterList();
      $httpBackend.expectGET(/menus\/menu-masters/);
      $httpBackend.flush();
    });
  });
});
