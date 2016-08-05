'use strict';

describe('Controller: MainCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/features-in-role.json'));
  beforeEach(module('served/features-in-role-report.json'));
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
  var menuService;
  var isMenuCashbagRestrictUseDeferred;
  var isShowManageCashBagDeferred;
  var isShowCashBagSubmissionDeferred;
  var localStorage;
  beforeEach(inject(function($controller, $localStorage, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function(_servedFeaturesInRole_) {
      featuresInRoleJSON = _servedFeaturesInRole_;
    });
    localStorage = $localStorage;
    globalMenuService = $injector.get('globalMenuService');
    identityAccessFactory = $injector.get('identityAccessFactory');
    mainMenuService = $injector.get('mainMenuService');
    menuService = $injector.get('menuService');

    companyJSON = $injector.get('servedCompany');
    companyTypesJSON = $injector.get('servedCompanyTypes');

    spyOn(globalMenuService, 'getCompanyData').and.returnValue(companyJSON);
    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({
      companyTypes: companyTypesJSON
    });
    localStorage = $injector.get('servedFeaturesInRoleReport');
    isMenuCashbagRestrictUseDeferred = $q.defer();
    isMenuCashbagRestrictUseDeferred.resolve(true);
  	isShowManageCashBagDeferred = $q.defer();
  	isShowManageCashBagDeferred.resolve(true);
  	isShowCashBagSubmissionDeferred = $q.defer();
  	isShowCashBagSubmissionDeferred.resolve(true);
    spyOn(menuService, 'isMenuCashbagRestrictUse').and.returnValue(isMenuCashbagRestrictUseDeferred.promise);
    spyOn(menuService, 'isShowManageCashBag').and.returnValue(isShowManageCashBagDeferred.promise);
    spyOn(menuService, 'isShowCashBagSubmission').and.returnValue(isShowCashBagSubmissionDeferred.promise);

    featuresInRoleDeferred = $q.defer();
    featuresInRoleDeferred.resolve(featuresInRoleJSON);

    identityAccessService = $injector.get('identityAccessService');
    spyOn(identityAccessService, 'featuresInRole').and.returnValue(featuresInRoleDeferred.promise);
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  scope.$digest();
  }));

  describe('controller init', function() {

    it('should call featuresInRole', function() {
	  scope.$digest();
      expect(identityAccessService.featuresInRole).toHaveBeenCalled();
    });

    it('should define scope.dashboardMenu', function() {
      scope.$digest();
      expect(scope.dashboardMenu).toBeDefined();
    });
    
    it('should call featuresInRole Report', function() {
  	  expect(localStorage.REPORT.REPORT[0].featureCode).toEqual('REPORT');
    });
  });

});
