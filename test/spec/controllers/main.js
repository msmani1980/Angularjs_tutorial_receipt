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
        expect(MainCtrl.retailMenu.length).toBe(12);
    });

    it('should have a title property', function () {
        expect(MainCtrl.retailMenu[0].title).toMatch(/retail item management/i);
    });

    it('should have a menuItems Array with 3 elements', function () {
        expect(MainCtrl.retailMenu[0].menuItems.length).toBe(3);
    });

    it('should have a stock owner menu collection', function () {
        expect(MainCtrl.stockOwnerMenu.length).toBe(1);
    });

    it('should have a title property', function () {
        expect(MainCtrl.stockOwnerMenu[0].title).toMatch(/stock owner item management/i);
    });

    it('should have a menuItems Array with 3 elements', function () {
        expect(MainCtrl.stockOwnerMenu[0].menuItems.length).toBe(3);
    });

});
