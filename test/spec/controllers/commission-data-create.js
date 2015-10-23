'use strict';

describe('Controller: CommissionDataCtrl', function () {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/crew-base-types.json'));
  beforeEach(module('served/commission-payable-types.json'));
  beforeEach(module('served/discount-types.json'));
  beforeEach(module('served/commission-payable.json'));

  var CommissionDataCtrl;
  var location;
  var scope;
  var controller;
  var commissionFactory;
  var crewBaseDeferred;
  var crewBaseResponseJSON;
  var commissionPayableDeferred;
  var commissionPayableResponseJSON;
  var discountTypesDeferred;
  var discountTypesResponseJSON;
  var commissionDataDeferred;
  var commissionDataResponseJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    inject(function (_servedCrewBaseTypes_, _servedCommissionPayableTypes_, _servedDiscountTypes_, _servedCommissionPayable_) {
      crewBaseResponseJSON = _servedCrewBaseTypes_;
      commissionPayableResponseJSON = _servedCommissionPayableTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
      commissionDataResponseJSON = _servedCommissionPayable_;
    });
    location = $location;
    scope = $rootScope.$new();
    commissionFactory = $injector.get('commissionFactory');
    controller = $controller;

    crewBaseDeferred = $q.defer();
    crewBaseDeferred.resolve(crewBaseResponseJSON);
    commissionPayableDeferred = $q.defer();
    commissionPayableDeferred.resolve(commissionPayableResponseJSON);
    discountTypesDeferred = $q.defer();
    discountTypesDeferred.resolve(discountTypesResponseJSON);
    commissionDataDeferred = $q.defer();
    commissionDataDeferred.resolve(commissionDataResponseJSON);

    spyOn(commissionFactory, 'getCrewBaseTypes').and.returnValue(crewBaseDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableTypes').and.returnValue(commissionPayableDeferred.promise);
    spyOn(commissionFactory, 'getDiscountTypes').and.returnValue(discountTypesDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableData').and.returnValue(commissionDataDeferred.promise);
    spyOn(commissionFactory, 'updateCommissionData').and.returnValue(commissionDataDeferred.promise);
    spyOn(commissionFactory, 'createCommissionData').and.returnValue(commissionDataDeferred.promise);
  }));

  function initController(action, id) {
    CommissionDataCtrl = controller('CommissionDataCtrl', {
      $scope: scope,
      $routeParams: {
        id: (id ? id : ''),
        state: ( action ? action : 'create')
      }
    });
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
        expect(scope.commissionData.commissionPercentage).toEqual('0');
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
        expect(scope.manualBarsCharLimit).toEqual(5);
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
        expect(scope.manualBarsCharLimit).toEqual(10);
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
        expect(scope.commissionValueCharLimit).toEqual(5);
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
        expect(scope.commissionValueCharLimit).toEqual(10);
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
          expect(commissionFactory.getCrewBaseTypes).toHaveBeenCalled();
          scope.$digest();
          expect(scope.crewBaseList).toEqual(crewBaseResponseJSON);
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
      });

      describe('view init', function () {
        beforeEach(function () {
          initController('view', 1);
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
          endDate: '10/21/2015'
        };
        var expectedPayload = {
          startDate: '20151020',
          endDate: '20151021'
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
        var payload = CommissionDataCtrl.createPayload();
        expect(commissionFactory.createCommissionData).toHaveBeenCalledWith(payload);
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
        expect(commissionFactory.updateCommissionData).toHaveBeenCalledWith(payload);
      });
    });
  });

});
