'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company.json'));

  var MainCtrl,
    scope,
    companiesFactory,
    companyResponseJSON,
    getCompanyDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _companiesFactory_) {
    inject(function (_servedCompany_) {
      companyResponseJSON = _servedCompany_;
    });

    companiesFactory = _companiesFactory_;

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(companiesFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('controller init', function(){
    it('should call getCompany', function(){
      expect(companiesFactory.getCompany).toHaveBeenCalled();
    });
  });

});
