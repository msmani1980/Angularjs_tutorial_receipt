'use strict';

describe('Controller: CommissionDataCtrl', function () {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/crew-base-types.json'));
  beforeEach(module('served/commission-payable-types.json'));
  beforeEach(module('served/discount-types.json'));

  var CommissionDataCtrl;
  var location;
  var scope;
  var commissionFactory;
  var crewBaseDeferred;
  var crewBaseResponseJSON;
  var commissionPayableDeferred;
  var commissionPayableResponseJSON;
  var discountTypesDeferred;
  var discountTypesResponseJSON;

  beforeEach(inject(function ($q, $controller, $rootScope, $location, $injector) {
    inject(function (_servedCrewBaseTypes_, _servedCommissionPayableTypes_, _servedDiscountTypes_) {
      crewBaseResponseJSON = _servedCrewBaseTypes_;
      commissionPayableResponseJSON = _servedCommissionPayableTypes_;
      discountTypesResponseJSON = _servedDiscountTypes_;
    });
    location = $location;
    scope = $rootScope.$new();
    commissionFactory = $injector.get('commissionFactory');

    crewBaseDeferred = $q.defer();
    crewBaseDeferred.resolve(crewBaseResponseJSON);
    commissionPayableDeferred = $q.defer();
    commissionPayableDeferred.resolve(commissionPayableResponseJSON);
    discountTypesDeferred = $q.defer();
    discountTypesDeferred.resolve(discountTypesResponseJSON);

    spyOn(commissionFactory, 'getCrewBaseTypes').and.returnValue(crewBaseDeferred.promise);
    spyOn(commissionFactory, 'getCommissionPayableTypes').and.returnValue(commissionPayableDeferred.promise);
    spyOn(commissionFactory, 'getDiscountTypes').and.returnValue(discountTypesDeferred.promise);


    CommissionDataCtrl = $controller('CommissionDataCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('scope variables and functions', function () {
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
      it('should be disabled when commission payable type is Retail', function () {
        scope.commissionData = {commissionPayable: 'Retail Item', commissionPercent: 100};
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(true);
      });
      it('should default commission percent to 0 when type is Retail', function () {
        scope.commissionData = {commissionPayable: 'Retail Item', commissionPercent: 100};
        scope.updateCommissionPercent();
        expect(scope.commissionData.commissionPercent).toEqual(0);
      });
      it('should  not be disabled when commission payable is not ePos Sales', function () {
        scope.commissionData = {commissionPayable: 'ePos Sales', commissionPercent: 100};
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(false);

        scope.commissionData = {commissionPayable: 'Cash Banked', commissionPercent: 100};
        scope.updateCommissionPercent();
        expect(scope.commissionPercentDisabled).toEqual(false);
      });
    });

    describe('manual bars behavior', function () {
      it('should set unit to % when type is Percent', function () {
        scope.commissionData = {manualBarsType: 'Percentage'};
        scope.updateManualBars();
        expect(scope.manualBarsUnit).toEqual('%');
      });
      it('should set char limit to 5 when type is percent', function () {
        scope.commissionData = {manualBarsType: 'Percentage'};
        scope.updateManualBars();
        expect(scope.manualBarsCharLimit).toEqual(5);
      });
      it('should set unit to company base currency when type is amount', function () {
        scope.commissionData = {manualBarsType: 'Amount'};
        scope.baseCurrency = 'GBP';
        scope.updateManualBars();
        expect(scope.manualBarsUnit).toEqual('GBP');
      });

      it('should set char limit to 10 when type is amount', function () {
        scope.commissionData = {manualBarsType: 'Amount'};
        scope.baseCurrency = 'GBP';
        scope.updateManualBars();
        expect(scope.manualBarsCharLimit).toEqual(10);
      });
    });

    describe('incentive increment behavior', function () {
      it('should set unit to % when type is Percent', function () {
        scope.commissionData = {commissionType: 'Percentage'};
        scope.updateIncentiveIncrement();
        expect(scope.incentiveIncrementUnit).toEqual('%');
      });
      it('should set char limit to 5 when type is percent', function () {
        scope.commissionData = {commissionType: 'Percentage'};
        scope.updateIncentiveIncrement();
        expect(scope.incentiveIncrementCharLimit).toEqual(5);
      });
      it('should set unit to company base currency when type is amount', function () {
        scope.commissionData = {commissionType: 'Amount'};
        scope.baseCurrency = 'GBP';
        scope.updateIncentiveIncrement();
        expect(scope.incentiveIncrementUnit).toEqual('GBP');
      });

      it('should set char limit to 10 when type is amount', function () {
        scope.commissionData = {commissionType: 'Amount'};
        scope.baseCurrency = 'GBP';
        scope.updateIncentiveIncrement();
        expect(scope.incentiveIncrementCharLimit).toEqual(10);
      });
    });
  });

  describe('init', function () {
    describe('API Calls', function () {
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

      it('should call getCommissionData if id is defined', function () {

      });

      it('should attach commission data to scope', function () {

      });
    });
  });

  describe('view/create/edit specific attributes', function () {
    describe('create', function () {
      var routeParams = {
        state: 'create'
      };
      beforeEach(inject(function ($controller) {
        CommissionDataCtrl = $controller('CommissionDataCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
        CommissionDataCtrl.init();
      }));
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

    describe('view', function () {
      var routeParams = {
        state: 'view',
        id: 1
      };
      beforeEach(inject(function ($controller) {
        CommissionDataCtrl = $controller('CommissionDataCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
        CommissionDataCtrl.init();
      }));
      it('should set readOnly to true', function () {
        expect(scope.readOnly).toEqual(true);
      });
      it('should set viewName to Viewing', function () {
        expect(scope.viewName).toEqual('Viewing Commission Data');
      });
    });

    describe('edit', function () {
      var routeParams = {
        state: 'edit',
        id: 1
      };
      beforeEach(inject(function ($controller) {
        CommissionDataCtrl = $controller('CommissionDataCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
        CommissionDataCtrl.init();
      }));
      it('should set readOnly to false', function () {
        expect(scope.readOnly).toEqual(false);
      });
      it('should set viewName to Editing', function () {
        expect(scope.viewName).toEqual('Editing Commission Data');
      });
    });
  });

});
