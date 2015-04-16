'use strict';

describe('Controller: ExchangeRatesCtrl', function () {
  // load the controller's module
  beforeEach(module('ts5App'));

  var ExchangeRatesCtrl,
    scope,
    $httpBackend,
    currenciesRequestHandler,
    createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
      $httpBackend = $injector.get('$httpBackend');
      currenciesRequestHandler = $httpBackend.when('GET', 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies')
        .respond({
          'response': [{
            createdOn: '2014-08-19',
            currencyCode: 'USD',
            currencyId: 1,
            currencyName: 'U.S. Dollar',
            currencySymbol: '$',
            decimalPrecision: 2,
            id: 1
          }]
        });
      scope = $rootScope.$new();
      createController = function () {
        ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
          $scope: scope
        });
      };
    })
  );

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch currencies list from services', function () {
    $httpBackend.expectGET('https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies');
    ExchangeRatesCtrl = createController();
    $httpBackend.flush();
  });

  it('should have a breadcrumb property', function () {
    ExchangeRatesCtrl = createController();
    expect(scope.breadcrumb).toBeDefined();
    $httpBackend.flush();
  });
});
