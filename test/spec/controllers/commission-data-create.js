'use strict';

describe('Controller: CommissionDataCtrl', function () {
  beforeEach(module('ts5App', 'template-module'));
  var CommissionDataCtrl,
    location,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location) {
    location = $location;
    scope = $rootScope.$new();

    CommissionDataCtrl = $controller('CommissionDataCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('scope variables and functions', function () {

  });

  describe('init', function () {
    it('should set readOnly to true only if viewing', function () {

    });
    describe('API Calls', function () {
      it('should get crew base', function () {

      });
      it('should attach crew base to scope', function () {

      });
      it('should get crew base list', function () {

      });

      it('should call getCommissionData if id is defined', function () {

      });

      it('should attache commission data to scope', function () {

      });
    });
  });

});
