'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/features-in-role.json'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/company-types.json'));

  var MainCtrl;
  var identityAccessService;
  var featuresInRoleJSON;
  var featuresInRoleDeferred;
  var globalMenuService;
  var identityAccessFactory;
  var mainMenuService;
  var companyJSON;
  var companyTypesJSON;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedFeaturesInRole_) {
      featuresInRoleJSON = _servedFeaturesInRole_;
    });

    globalMenuService = $injector.get('globalMenuService');
    identityAccessFactory = $injector.get('identityAccessFactory');
    mainMenuService = $injector.get('mainMenuService');

    companyJSON = $injector.get('servedCompany');
    companyTypesJSON = $injector.get('servedCompanyTypes');

    spyOn(globalMenuService, 'getCompanyData').and.returnValue(companyJSON);
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({ companyTypes: companyTypesJSON });

    featuresInRoleDeferred = $q.defer();
    featuresInRoleDeferred.resolve(featuresInRoleJSON);

    identityAccessService = $injector.get('identityAccessService');
    spyOn(identityAccessService, 'featuresInRole').and.returnValue(featuresInRoleDeferred.promise);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('controller init', function () {
    it('should call featuresInRole', function () {
      expect(identityAccessService.featuresInRole).toHaveBeenCalled();
    });

    it('should define scope.dashboardMenu', function () {
      scope.$digest();
      expect(scope.dashboardMenu).toBeDefined();
    });
  });

});
