'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company.json'));

  var MainCtrl;
  var GlobalMenuService;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    GlobalMenuService = $injector.get('GlobalMenuService');
    spyOn(GlobalMenuService, 'getCompanyData').and.returnValue({companyId: 'fake'});
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('controller init', function () {
    it('should call getCompany', function () {
      expect(GlobalMenuService.getCompanyData).toHaveBeenCalled();
    });
  });

});
