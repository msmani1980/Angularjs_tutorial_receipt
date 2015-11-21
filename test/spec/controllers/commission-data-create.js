'use strict';

fdescribe('Controller: CommissionDataCtrl', function () {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/crew-base-types.json'));
  beforeEach(module('served/commission-payable-types.json'));
  beforeEach(module('served/discount-types.json'));
  beforeEach(module('served/commission-payable.json'));
  beforeEach(module('served/employees.json'));

  var CommissionDataCtrl;
  var location;
  var scope;
  var controller;
  var commissionFactory;
  var employeesService;
  var crewBaseDeferred;
  var crewBaseResponseJSON;
  var commissionPayableDeferred;
  var employeesDeferred;
  var commissionPayableResponseJSON;
  var discountTypesDeferred;
  var discountTypesResponseJSON;
  var commissionDataDeferred;
  var commissionDataResponseJSON;
  var employeesResponseJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    inject(function (_servedCrewBaseTypes_, _servedCommissionPayableTypes_, _servedDiscountTypes_, _servedCommissionPayable_, _servedEmployees_) {
      crewBaseResponseJSON = _servedCrewBaseTypes_;
      commissionPayableResponseJSON = _servedCommissionPayableTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
      commissionDataResponseJSON = _servedCommissionPayable_;
      employeesResponseJSON = _servedEmployees_;
    });
    location = $location;
    scope = $rootScope.$new();
    commissionFactory = $injector.get('commissionFactory');
    employeesService = $injector.get('employeesService');
    controller = $controller;

    crewBaseDeferred = $q.defer();
    crewBaseDeferred.resolve(crewBaseResponseJSON);
    commissionPayableDeferred = $q.defer();
    commissionPayableDeferred.resolve(commissionPayableResponseJSON);
    discountTypesDeferred = $q.defer();
    discountTypesDeferred.resolve(discountTypesResponseJSON);
    commissionDataDeferred = $q.defer();

    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesResponseJSON);

    spyOn(employeesService,  'getEmployees').and.returnValue(employeesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableTypes').and.returnValue(commissionPayableDeferred.promise);
    spyOn(commissionFactory, 'getDiscountTypes').and.returnValue(discountTypesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableData').and.returnValue(commissionDataDeferred.promise);
    spyOn(commissionFactory, 'updateCommissionData').and.returnValue(commissionDataDeferred.promise);
    spyOn(commissionFactory, 'createCommissionData').and.returnValue(commissionDataDeferred.promise);
    spyOn(location, 'path').and.callThrough();

  }));

  function initController(action, id) {
    CommissionDataCtrl = controller('CommissionDataCtrl', {
      $scope: scope,
      $routeParams: {
        id: (id ? id : ''),
        state: ( action ? action : 'create')
      }
    });
    scope.commissionDataForm = { $invalid: false};
  }

  describe('scope variables and functions', function () {
    beforeEach(function () {
      initController();
      scope.$digest();
    });

    it('should have view name defined', function () {
      expect(scope.viewName).toBeDefined();
    });
    it('should have readOnly be defined', function () {
      expect(scope.readOnly).toBeDefined();
    });
    it('should have commission data be defined', function () {
      expect(scope.commissionData).toBeDefined();
    });

    describe('commission percent behavior', function () {
      beforeEach(function () {
        initController();
        scope.$digest();
      });

      it('should be disabled when commission payable type is Retail', function () {
        scope.commissionData = {
          commissionPayableTypeId: 1, // 1 for Retail item
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(true);
      });
      it('should default commission percent to 0 when type is Retail', function () {
        scope.commissionData = {
          commissionPayableTypeId: 1, // 1 for Retail item
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionData.commissionPercentage).toEqual(null);
      });
      it('should not be disabled when commission payable is ePos sales', function () {
        scope.commissionData = {
          commissionPayableTypeId: 2, // 2 for epos sales
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(false);
      });
      it('should not change commission percent when commission payable is epos sales', function () {
        scope.commissionData = {
          commissionPayableTypeId: 2, // 2 for epos sales
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionData.commissionPercentage).toEqual(100);
      });
      it('should not be disabled when commission payable is cash banked', function () {
        scope.commissionData = {
          commissionPayableTypeId: 3, // 3 for cash banked
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(false);
      });
      it('should not change commission percent when commission payable is cash banked', function () {
        scope.commissionData = {
          commissionPayableTypeId: 3, // 3 for cash banked
          commissionPercentage: 100
        };
        scope.updateCommissionPercent();
        expect(scope.commissionData.commissionPercentage).toEqual(100);
      });
    });

    describe('manual bars behavior', function () {
      beforeEach(function () {
        initController();
        scope.$digest();
      });

      it('should set unit to % when type is Percent', function () {
        scope.commissionData = {manualBarsCommissionValueTypeId: 1}; // 1 for percentage
        scope.updateManualBars();
        expect(scope.manualBarsCommissionUnit).toEqual('%');
      });
      it('should set char limit to 5 when type is percent', function () {
        scope.commissionData = {manualBarsCommissionValueTypeId: 1}; // 1 for percentage
        scope.updateManualBars();
        expect(scope.manualBarsCharLimit).toEqual(6);
      });
      it('should set unit to company base currency when type is amount', function () {
        scope.commissionData = {manualBarsCommissionValueTypeId: 2}; // 1 for amount
        scope.baseCurrency = 'GBP';
        scope.updateManualBars();
        expect(scope.manualBarsCommissionUnit).toEqual('GBP');
      });

      it('should set char limit to 10 when type is amount', function () {
        scope.commissionData = {manualBarsCommissionValueTypeId: 2}; // 1 for amount
        scope.baseCurrency = 'GBP';
        scope.updateManualBars();
        expect(scope.manualBarsCharLimit).toEqual(11);
      });
    });

    describe('incentive increment behavior', function () {
      beforeEach(function () {
        initController();
        scope.$digest();
      });

      it('should set unit to % when type is Percent', function () {
        scope.commissionData = {commissionValueTypeId: 1};  // 1 for percentage
        scope.updateIncentiveIncrement();
        expect(scope.commissionValueUnit).toEqual('%');
      });
      it('should set char limit to 5 when type is percent', function () {
        scope.commissionData = {commissionValueTypeId: 1};  // 1 for percentage
        scope.updateIncentiveIncrement();
        expect(scope.commissionValueCharLimit).toEqual(6);
      });
      it('should set unit to company base currency when type is amount', function () {
        scope.commissionData = {commissionValueTypeId: 2};  // 1 for amount
        scope.baseCurrency = 'GBP';
        scope.updateIncentiveIncrement();
        expect(scope.commissionValueUnit).toEqual('GBP');
      });

      it('should set char limit to 10 when type is amount', function () {
        scope.commissionData = {commissionValueTypeId: 2};  // 1 for amount
        scope.baseCurrency = 'GBP';
        scope.updateIncentiveIncrement();
        expect(scope.commissionValueCharLimit).toEqual(11);
      });
    });
  });

  describe('init', function () {
    describe('API Calls', function () {

      describe('common init calls', function () {
        beforeEach(function () {
          initController();
          scope.$digest();
        });

        it('should get crew base', function () {
          expect(employeesService.getEmployees).toHaveBeenCalled();
        });
        it('should get commission payable types', function () {
          expect(commissionFactory.getCommissionPayableTypes).toHaveBeenCalled();
          scope.$digest();
          expect(scope.commissionPayableTypes).toEqual(commissionPayableResponseJSON);
        });
        it('should get discount types', function () {
          expect(commissionFactory.getDiscountTypes).toHaveBeenCalled();
          scope.$digest();
          expect(scope.discountTypes).toEqual(discountTypesResponseJSON);
        });
      });

      describe('create init', function () {
        beforeEach(function () {
          initController();
          scope.$digest();
        });

        it('should set readOnly to false', function () {
          expect(scope.readOnly).toEqual(false);
        });
        it('should init commissionData to empty', function () {
          expect(scope.commissionData).toEqual({});
        });
        it('should set viewName to Creating', function () {
          expect(scope.viewName).toEqual('Creating Commission Data');

        });
      });

      describe('edit init', function () {
        beforeEach(function () {
          initController('edit', 1);
          commissionDataDeferred.resolve(commissionDataResponseJSON);
          scope.$digest();
        });

        it('should set readOnly to false', function () {
          expect(scope.readOnly).toEqual(false);
        });
        it('should set viewName to Editing', function () {
          expect(scope.viewName).toEqual('Editing Commission Data');
        });
        it('should call getCommissionData with routeParams id', function () {
          expect(commissionFactory.getCommissionPayableData).toHaveBeenCalledWith(1);
        });
        it('should attach commission data to scope', function () {
          expect(scope.commissionData).toBeDefined();
          expect(scope.commissionData).not.toEqual({});
        });
        it('should format decimal numbers', function () {
          expect(scope.commissionData.commissionValue).toEqual('16.60');
          expect(scope.commissionData.discrepancyDeductionsCashPercentage).toEqual('14.40');
          expect(scope.commissionData.discrepancyDeductionsStockPercentage).toEqual('15.50');
          expect(scope.commissionData.manualBarsCommissionValue).toEqual('13.30');
        });
      });

      describe('view init', function () {
        beforeEach(function () {
          initController('view', 1);
          commissionDataDeferred.resolve(commissionDataResponseJSON);
          scope.$digest();
        });

        it('should set readOnly to true', function () {
          expect(scope.readOnly).toEqual(true);
        });
        it('should set viewName to Editing', function () {
          expect(scope.viewName).toEqual('Viewing Commission Data');
        });
        it('should call getCommissionData with routeParams id', function () {
          expect(commissionFactory.getCommissionPayableData).toHaveBeenCalledWith(1);
        });
        it('should attach commission data to scope', function () {
          expect(scope.commissionData).toBeDefined();
          expect(scope.commissionData).not.toEqual({});
        });
      });
    });
  });

  describe('saveData', function () {
    describe('payload', function () {
      beforeEach(function () {
        initController('view', 1);
        scope.$digest();
      });

      it('should format date to YYYMMDD format', function () {
        scope.commissionData = {
          startDate: '10/20/2015',
          endDate: '10/21/2015',
          commissionPercentage: '123.00'
        };
        var expectedPayload = {
          startDate: '20151020',
          endDate: '20151021',
          commissionPercentage: '123.00'

        };
        var payload = CommissionDataCtrl.createPayload();
        expect(payload).toEqual(expectedPayload);
      });
    });

    describe('create Data', function () {
      beforeEach(function () {
        initController('create');
        scope.$digest();
        scope.commissionData = {
          startDate: '10/20/2015',
          endDate: '10/21/2015'
        };
        scope.saveData();
      });

      it('should call createCommissionData with payload', function () {
        commissionDataDeferred.resolve(commissionDataResponseJSON);
        var payload = CommissionDataCtrl.createPayload();
        expect(commissionFactory.createCommissionData).toHaveBeenCalledWith(payload);
      });

      it('should redirect to commission data table', function () {
        commissionDataDeferred.resolve(commissionDataResponseJSON);
        CommissionDataCtrl.createSuccess();
        expect(location.path).toHaveBeenCalledWith('commission-data-table');
      });

      it('should show errors if there is a promise that fails', function () {
        commissionDataDeferred.reject({status:400,statusText:'Bad Request'});
        scope.$apply();
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the error response in controller', function () {
        commissionDataDeferred.reject({status:400,statusText:'Bad Request'});
        scope.$apply();
        expect(scope.errorResponse).toEqual({status:400,statusText:'Bad Request'});
      });


    });

    describe('edit data', function () {
      beforeEach(function () {
        initController('edit', 1);
        scope.$digest();
        scope.commissionData = {
          startDate: '10/20/2015',
          endDate: '10/21/2015'
        };
        scope.saveData();
      });

      it('should call createCommissionData with payload', function () {
        var payload = CommissionDataCtrl.createPayload();
        expect(commissionFactory.updateCommissionData).toHaveBeenCalledWith(1, payload);
      });
    });
  });

});
