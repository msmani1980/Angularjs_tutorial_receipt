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

    it('should attach a list of dashboard items to the scope', function () {
        expect(scope.dashboardItems.length).toBe(12);
    });

    it('should have title and items', function () {
        expect(scope.dashboardItems[0].title).toBe('Retail Item Management')
    });
});
