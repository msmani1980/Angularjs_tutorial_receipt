'use strict';

describe('Controller: CommissionDataTableCtrl', function () {
  beforeEach(module('ts5App', 'template-module', 'served/commission-payable-list.json', 'served/crew-base-types.json', 'served/discount-types.json', 'served/commission-payable-types.json'));
  var CommissionDataTableCtrl,
    commissionPayableListDeferred,
    commissionPayableListResponseJSON,
    crewBaseListDeferred,
    crewBaseListJSON,
    discountTypesDeferred,
    discountTypesResponseJSON,
    commissionPayableTypesDeferred,
    commissionPayableTypesResponseJSON,
    commissionFactory,
    location,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedCommissionPayableList_, _servedCrewBaseTypes_, _servedDiscountTypes_, _servedCommissionPayableTypes_) {
      commissionPayableListResponseJSON = _servedCommissionPayableList_;
      crewBaseListJSON = _servedCrewBaseTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
      commissionPayableTypesResponseJSON = _servedCommissionPayableTypes_;
    });

    location = $location;
    scope = $rootScope.$new();
    commissionFactory = $injector.get('commissionFactory');


    commissionPayableListDeferred = $q.defer();
    commissionPayableListDeferred.resolve(commissionPayableListResponseJSON);
    crewBaseListDeferred = $q.defer();
    crewBaseListDeferred.resolve(crewBaseListJSON);
    discountTypesDeferred = $q.defer();
    discountTypesDeferred.resolve(discountTypesResponseJSON);
    commissionPayableTypesDeferred = $q.defer();
    commissionPayableTypesDeferred.resolve(commissionPayableTypesResponseJSON);

    spyOn(commissionFactory, 'getCommissionPayableList').and.returnValue(commissionPayableListDeferred.promise);
    spyOn(commissionFactory, 'getCrewBaseTypes').and.returnValue(crewBaseListDeferred.promise);
    spyOn(commissionFactory, 'getDiscountTypes').and.returnValue(discountTypesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableTypes').and.returnValue(commissionPayableTypesDeferred.promise);

    CommissionDataTableCtrl = $controller('CommissionDataTableCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should get crew base types', function () {
      expect(commissionFactory.getCrewBaseTypes).toHaveBeenCalled();
    });

    it('should get Commission Payable types', function () {
      expect(commissionFactory.getCommissionPayableTypes).toHaveBeenCalled();
    });

    it('should get Discount Types', function () {
      expect(commissionFactory.getDiscountTypes).toHaveBeenCalled();
    });
  });

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
      it('should return true if start date is in the future', function () {
        expect(scope.canDelete({startDate: '08/20/2050'})).toEqual(true);
      });
      it('should return false if start date is not in the future', function () {
        expect(scope.canDelete({startDate: '08/20/1990', endDate: '08/20/2050'})).toEqual(false);
      });
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
        scope.clearSearchForm();
        expect(scope.search).toEqual({});
      });
      it('should call getCommissionData with empty search query', function () {
        scope.clearSearchForm();
        expect(commissionFactory.getCommissionPayableList).toHaveBeenCalledWith({});
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
      expect(commissionFactory.getCommissionPayableList).toHaveBeenCalled();
    });
    it('should populate scope variable', function () {
      //expect(scope.commissionData).toEqual(mock);
    });
  });

});
