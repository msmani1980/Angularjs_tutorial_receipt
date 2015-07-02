'use strict';

describe('Service: menuFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuFactory,
    menuService,
    itemsService;

  beforeEach(inject(function (_menuFactory_, $injector) {

    menuService = $injector.get('menuService');
    itemsService = $injector.get('itemsService');

    spyOn(menuService, 'getMenu').and.stub();
    spyOn(menuService, 'updateMenu').and.stub();
    spyOn(itemsService, 'getItemsList').and.stub();

    menuFactory = _menuFactory_;
  }));

  it('should exists', function () {
    expect(!!menuFactory).toBe(true);
  });

});
