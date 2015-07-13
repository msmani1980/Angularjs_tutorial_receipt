'use strict';

describe('Service: employeeCommissionService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));

  // instantiate service
  var employeeCommissionService,
    $httpBackend,
    menuResponseJSON;

  beforeEach(inject(function (_employeeCommissionService_, $injector) {
    inject(function (_servedMenus_) {
      menuResponseJSON = _servedMenus_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/employee-commissions\/\d+/).respond(menuResponseJSON);

    employeeCommissionService = _employeeCommissionService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exists', function () {
    expect(!!employeeCommissionService).toBe(true);
  });

  describe('API requests', function () {


  });


});
