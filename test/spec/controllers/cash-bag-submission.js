'use strict';

fdescribe('Controller: CashBagSubmissionCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/cash-bag-list.json'));

  var CashBagSubmissionCtrl;
  var scope;
  var cashBagFactory;
  var GlobalMenuService;
  var getCompanyDeferred;
  var getCompanyJSON;
  var getCashBagListDeferred;
  var getCashBagListJSON;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {

    scope = $rootScope.$new();
    cashBagFactory = $injector.get('cashBagFactory');

    GlobalMenuService = $injector.get('GlobalMenuService');
    spyOn(GlobalMenuService.company, 'get').and.returnValue(403);

    getCompanyDeferred = $q.defer();
    getCompanyJSON = $injector.get('servedCompany');
    getCompanyDeferred.resolve(getCompanyJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCashBagListDeferred = $q.defer();
    getCashBagListJSON = $injector.get('servedCashBagList');
    getCashBagListDeferred.resolve(getCashBagListJSON);
    spyOn(cashBagFactory, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);

    CashBagSubmissionCtrl = $controller('CashBagSubmissionCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('controller init', function () {
    it('should exist', function () {
      expect(CashBagSubmissionCtrl).toBeDefined();
    });

    describe('API call to getCompany', function () {
      it('should call getCompany', function () {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(362);
      });

      it('should attach getCompany response to scope', function () {
        expect(scope.CHCompany).toEqual(getCompanyJSON);
      });

    });
  });

  describe('getCashBagList', function () {
    it('should call getCashBagList', function () {
      scope.updateCashBagList();
      expect(cashBagFactory.getCashBagList).toHaveBeenCalled();
    });
  });

});
