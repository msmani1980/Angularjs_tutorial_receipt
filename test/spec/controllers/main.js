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

    it('should have a viewName property', function () {
        expect(scope.viewName).toBeDefined();
    });

    it('should attach a list of dashboard items to the scope', function () {
        expect(scope.dashboardMenu.length).toBe(12);
    });

    it('should have a title property', function () {
        expect(scope.dashboardMenu[0].title).toMatch(/retail item management/i);
    });

    it('should have a menuItems Array with 3 elements', function () {
        expect(scope.dashboardMenu[0].menuItems.length).toBe(3);
    });
});
