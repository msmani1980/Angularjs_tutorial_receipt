'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  // TODO: Need to add in company AJAX call before any of these Test. Left out companies factory test is incomplete

  it('should have a viewName property', function () {
    expect(scope.viewName).toBeDefined();
  });
  it('should have a retail menu collection', function () {
    expect(MainCtrl.retailMenu.length).toBe(17);
  });
  it('should have a title property', function () {
    expect(MainCtrl.retailMenu[0].title).toMatch(
      /retail item management/i);
  });
  it('should have a menuItems Array with 3 elements', function () {
    expect(MainCtrl.retailMenu[0].menuItems.length).toBe(3);
  });
  it('should have a stock owner menu collection', function () {
    expect(MainCtrl.stockOwnerMenu.length).toBe(1);
  });
  it('should have a title property', function () {
    expect(MainCtrl.stockOwnerMenu[0].title).toMatch(
      /stock owner item management/i);
  });
  it('should have a menuItems Array with 3 elements', function () {
    expect(MainCtrl.stockOwnerMenu[0].menuItems.length).toBe(3);
  });

  describe('Menu Management', function () {
    var menuNavigation;
    beforeEach(function () {
      menuNavigation = MainCtrl.retailMenu[4];
    });
    it('should have the correct title', function () {
      expect(menuNavigation.title.trim()).toEqual('Menu Management');
    });
    it('should have (2) navigation items', function () {
      expect(menuNavigation.menuItems.length).toEqual(2);
    });

    describe('Manage Menu Link', function () {
      var navigationItem;
      beforeEach(function () {
        navigationItem = menuNavigation.menuItems[0];
      });
      it('should have the correct label', function () {
        expect(navigationItem.name.trim()).toEqual(
          'Manage Menus');
      });
      it('should have the correct route', function () {
        expect(navigationItem.route).toEqual(
          '/#/menu-list');
      });
    });

    describe('Create Menu Link', function () {
      var navigationItem;
      beforeEach(function () {
        navigationItem = menuNavigation.menuItems[1];
      });
      it('should have the correct label', function () {
        expect(navigationItem.name.trim()).toEqual(
          'Create Menu');
      });
      it('should have the correct route', function () {
        expect(navigationItem.route).toEqual(
          '/ember/#/menus/create');
      });
    });
  });

  describe('Menu Relationships', function () {
    var menuRelationship;
    beforeEach(function () {
      menuRelationship = MainCtrl.retailMenu[6];
    });
    it('should have the correct title', function () {
      expect(menuRelationship.title.trim()).toEqual(
        'Menu-Catering Station Relationship');
    });
    it('should have (2) navigation items', function () {
      expect(menuRelationship.menuItems.length).toEqual(2);
    });

    describe('Manage Relationship Link', function () {
      var navigationItem;
      beforeEach(function () {
        navigationItem = menuRelationship.menuItems[0];
      });
      it('should have the correct label', function () {
        expect(navigationItem.name.trim()).toEqual(
          'Manage Relationships');
      });
      it('should have the correct route', function () {
        expect(navigationItem.route).toEqual(
          '/#/menu-relationship-list');
      });
    });

    describe('Create Relationship Link', function () {
      var navigationItem;
      beforeEach(function () {
        navigationItem = menuRelationship.menuItems[1];
      });
      it('should have the correct label', function () {
        expect(navigationItem.name.trim()).toEqual(
          'Create Relationship');
      });
      it('should have the correct route', function () {
        expect(navigationItem.route).toEqual(
          '/#/menu-relationship-create');
      });
    });
  });


  describe('Manage Store Number', function () {
    var menuRelationship;
    beforeEach(function () {
      menuRelationship = MainCtrl.retailMenu[16];
    });
    it('should have the correct title', function () {
      expect(menuRelationship.title.trim()).toEqual(
        'Manage Store Number');
    });
    it('should have (1) navigation items', function () {
      expect(menuRelationship.menuItems.length).toEqual(1);
    });

    describe('Store Number Create', function () {
      var navigationItem;
      beforeEach(function () {
        navigationItem = menuRelationship.menuItems[0];
      });
      it('should have the correct label', function () {
        expect(navigationItem.name.trim()).toEqual(
          'Store Number Create');
      });
      it('should have the correct route', function () {
        expect(navigationItem.route).toEqual(
          '/#/store-number');
      });
    });
  });

});
