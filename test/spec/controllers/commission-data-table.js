'use strict';

describe('Controller: CommissionDataTableCtrl', function () {
  beforeEach(module('ts5App', 'template-module'));
  var CommissionDataTableCtrl,
    location,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location) {
    location = $location;
    scope = $rootScope.$new();

    CommissionDataTableCtrl = $controller('CommissionDataTableCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('scope vars', function () {
    it('should have viewName defined', function () {
      expect(scope.viewName).toBeDefined();
    });
    it('should have commissionData defined', function () {
      expect(scope.commissionData).toBeDefined();
    });
  });

  describe('scope functions', function () {
    describe('canDelete', function () {
      // test business rules here
    });

    describe('searchCommissionData', function () {
      it('search query should be defined', function () {
        expect(scope.search).toBeDefined();
      });
      it('should call getCommissionData with search query', function () {
        scope.searchCommissionData();
        //expect(commissionFactory.getCommissionDataList).toHaveBeenCalledWith(scope.search);
      });
      it('should set commissionData with new response', function () {
        scope.searchCommissionData();
        //expect(scope.commissionData).toEqual(response);
      });
    });

    describe('clearSearch', function () {
      it('should clear search query', function () {
        scope.clearSearch();
        expect(scope.search).toEqual({});
      });
      it('should call getCommissionData with empty search query', function () {
        //expect(commissionFactory.getCommissionDataList).toHaveBeenCalledWith({});
      });
    });

    describe('delete', function () {
      it('should call delete API with record id', function () {
        //expect(commissionFactory.deleteCommissionData).toHaveBeenCalledWith(id);
      });
    });

  });

  describe('get commission data', function () {
    it('should call commissionData factory', function () {
      //expect(commissionFactory.getCommissionDataList).toHaveBeenCalled();
    });
    it('should populate scope variable', function () {
      //expect(scope.commissionData).toEqual(mock);
    });
  });

});
