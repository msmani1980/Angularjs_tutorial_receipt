'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/features-in-role.json'));

  var MainCtrl;
  var GlobalMenuService;
  var identityAccessService;
  var featuresInRoleJSON;
  var featuresInRoleDeferred;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedFeaturesInRole_) {
      featuresInRoleJSON = _servedFeaturesInRole_;
    });

    featuresInRoleDeferred = $q.defer();
    featuresInRoleDeferred.resolve(featuresInRoleJSON);

    GlobalMenuService = $injector.get('GlobalMenuService');
    identityAccessService = $injector.get('identityAccessService');
    spyOn(GlobalMenuService, 'getCompanyData').and.returnValue({companyId: 'fake'});
    spyOn(identityAccessService, 'featuresInRole').and.returnValue(featuresInRoleDeferred.promise);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('controller init', function () {
    it('should call getCompany', function () {
      expect(GlobalMenuService.getCompanyData).toHaveBeenCalled();
    });
    it('should call featuresInRole', function () {
      expect(identityAccessService.featuresInRole).toHaveBeenCalled();
    });
    it('should define scope.features', function () {
      scope.$digest();
      expect(scope.features).toEqual(['CASHBAG', 'CASHBAGSUBMIT', 'RETAILITEM', 'RETAILITEMCATEGORY']);
    });
  });

});
