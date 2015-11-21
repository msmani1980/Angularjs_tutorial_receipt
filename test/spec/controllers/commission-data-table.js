'use strict';

describe('Controller: CommissionDataTableCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/commission-payable-list.json'));
  beforeEach(module('served/crew-base-types.json'));
  beforeEach(module('served/discount-types.json'));
  beforeEach(module('served/commission-payable-types.json'));
  beforeEach(module('served/employees.json'));

  var CommissionDataTableCtrl;

  var commissionPayableListDeferred;
  var commissionPayableTypesDeferred;
  var discountTypesDeferred;
  var crewBaseListDeferred;
  var deleteCommissionDataDeferred;
  var employeesDeferred;

  var commissionPayableListResponseJSON;
  var commissionPayableTypesResponseJSON;
  var discountTypesResponseJSON;
  var crewBaseListJSON;
  var employeesResponseJSON;

  var commissionFactory;
  var employeesService;
  var location;
  var dateUtility;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {

    inject(function (_servedCommissionPayableList_, _servedCrewBaseTypes_, _servedDiscountTypes_,
                     _servedCommissionPayableTypes_, _servedEmployees_) {
      commissionPayableListResponseJSON = _servedCommissionPayableList_;
      crewBaseListJSON = _servedCrewBaseTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
      commissionPayableTypesResponseJSON = _servedCommissionPayableTypes_;
      employeesResponseJSON = _servedEmployees_;
    });

    location = $location;
    dateUtility = $injector.get('dateUtility');
    scope = $rootScope.$new();
    commissionFactory = $injector.get('commissionFactory');
    employeesService = $injector.get('employeesService');


    commissionPayableListDeferred = $q.defer();
    commissionPayableListDeferred.resolve(commissionPayableListResponseJSON);

    crewBaseListDeferred = $q.defer();
    crewBaseListDeferred.resolve(crewBaseListJSON);

    discountTypesDeferred = $q.defer();
    discountTypesDeferred.resolve(discountTypesResponseJSON);

    commissionPayableTypesDeferred = $q.defer();
    commissionPayableTypesDeferred.resolve(commissionPayableTypesResponseJSON);

    deleteCommissionDataDeferred = $q.defer();
    deleteCommissionDataDeferred.resolve();

    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesResponseJSON);

    spyOn(employeesService,  'getEmployees').and.returnValue(employeesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableList').and.returnValue(commissionPayableListDeferred.promise);
    spyOn(commissionFactory, 'getDiscountTypes').and.returnValue(discountTypesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableTypes').and.returnValue(commissionPayableTypesDeferred.promise);
    spyOn(commissionFactory, 'deleteCommissionData').and.returnValue(deleteCommissionDataDeferred.promise);

    CommissionDataTableCtrl = $controller('CommissionDataTableCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should get crew base types', function () {
      expect(employeesService.getEmployees).toHaveBeenCalled();
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
    describe('searchCommissionData', function () {
      beforeEach(function () {
        scope.search = {};
      });

      it('should call getCommissionData with crewBaseTypeId', function () {
        scope.search = {
          crewBaseType: {
            id: 'fakeId'
          }
        };

        scope.searchCommissionData();
        expect(commissionFactory.getCommissionPayableList).toHaveBeenCalledWith({
          crewBaseTypeId: 'fakeId'
        });
      });

      it('should call getCommissionData with dates', function () {
        scope.search = {
          startDate: '01/01/2015',
          endDate: '01/01/2015'
        };

        var expectedPayload = {
          startDate: dateUtility.formatDateForAPI(scope.search.startDate),
          endDate: dateUtility.formatDateForAPI(scope.search.endDate)
        };

        scope.searchCommissionData();
        expect(commissionFactory.getCommissionPayableList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should set commissionData with new response', function () {
        delete scope.commissionData;
        scope.searchCommissionData();
        scope.$digest();
        expect(angular.isArray(scope.commissionData)).toEqual(true);
      });

      describe('clearSearch', function () {
        beforeEach(function () {
          scope.search.startDate = '01/01/2017';
        });

        it('should clear search query', function () {
          scope.clearSearchForm();
          expect(scope.search).toEqual({});
        });

        it('should call getCommissionData with empty search query', function () {
          scope.clearSearchForm();
          expect(commissionFactory.getCommissionPayableList).toHaveBeenCalledWith({});
        });
      });
    });

    describe('delete', function () {
      it('should call delete API with record id', function () {
        var fakeData = {id: 1};
        scope.removeRecord(fakeData);
        expect(commissionFactory.deleteCommissionData).toHaveBeenCalledWith(1);
      });
    });

    describe('get commission data', function () {
      it('should call commissionData factory', function () {
        expect(commissionFactory.getCommissionPayableList).toHaveBeenCalled();
      });
    });

    describe('getCrewBaseName helper', function () {
      it('should match crew id to crew base name', function () {
        scope.crewBaseTypes = [{id: 1, name: 'test1'}];
        scope.$digest();
        var crewName = scope.getCrewBaseName(1);  // 1 for BFS, from JSON mock
        expect(crewName).toEqual('test1');
      });
    });

    describe('getCommissionTypeName helper', function () {
      it('should match commission type id to name', function () {
        scope.commissionTypes = [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}];
        var crewName = scope.getCommissionTypeName(2);  // 2 for Epos sales, from JSON mock
        expect(crewName).toEqual('test2');
      });

    });

    describe('getUnitById helper', function () {
      it('should match percentage to % unit, and amount to company base unit', function () {
        scope.discountTypes = [{id: 1, name: 'Percentage'}, {id: 2, name: 'Amount'}];
        scope.$digest();
        var unit = scope.getUnitById(1);
        expect(unit).toEqual('%');
        unit = scope.getUnitById(2);
        expect(unit).toEqual('GBP');
      });
    });

  });

});
