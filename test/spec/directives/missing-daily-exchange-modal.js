'use strict';

describe('Directive: missingDailyExchangeModal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/daily-exchange-rate.json'));

  var scope;
  var directiveElement;
  var compile;
  var location;
  var isolatedScope;
  var cashBagFactory;
  var getDailyExchangeRatesDeferred;
  var dailyExchangeRateJSON;
  var globalMenuService;
  var companyJSON;
  var dateUtility;

  function getCompiledElement() {
    var element = angular.element('<missing-daily-exchange-modal check-on-load="true"></missing-daily-exchange-modal>');
    var compiledElement = compile(element)(scope);
    scope.$digest();
    isolatedScope = compiledElement.children().scope();
    return compiledElement;
  }

  beforeEach(inject(function ($rootScope, $injector, $q, $compile, $location) {
    cashBagFactory = $injector.get('cashBagFactory');

    dailyExchangeRateJSON = $injector.get('servedDailyExchangeRate');
    getDailyExchangeRatesDeferred = $q.defer();
    getDailyExchangeRatesDeferred.resolve(dailyExchangeRateJSON);
    spyOn(cashBagFactory, 'getDailyExchangeRates').and.returnValue(getDailyExchangeRatesDeferred.promise);

    var chCompanyData = { chCompany: { companyId: 403 } };
    companyJSON = angular.extend(chCompanyData, $injector.get('servedCompany'));
    globalMenuService = $injector.get('globalMenuService');
    spyOn(globalMenuService, 'getCompanyData').and.returnValue(companyJSON);

    dateUtility = $injector.get('dateUtility');

    location = $location;
    spyOn(location, 'path');

    compile = $compile;
    scope = $rootScope.$new();
  }));

  describe('API Calls', function () {
    beforeEach(function () {
      directiveElement = getCompiledElement();
      scope.checkForDailyExchangeRate();
    });

    it('should get the companyId', function () {
      expect(globalMenuService.getCompanyData).toHaveBeenCalled();
    });

    it('should GET the daily exchange rate', function () {
      var dailyExchangeDate = dateUtility.formatDateForAPI(dateUtility.now(), 'x');
      expect(cashBagFactory.getDailyExchangeRates).toHaveBeenCalledWith(403, dailyExchangeDate);
    });

  });

  describe('scope functions', function () {
    beforeEach(function () {
      directiveElement = getCompiledElement();
    });

    it('should change the location', function () {
      isolatedScope.goToPage('fakeRoute');
      expect(location.path).toHaveBeenCalledWith('fakeRoute');
    });

  });
});
