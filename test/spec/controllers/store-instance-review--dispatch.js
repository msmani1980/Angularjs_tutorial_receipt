'use strict';

describe('Controller: StoreInstanceReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-seals.json'));
  beforeEach(module('served/seal-colors.json'));
  beforeEach(module('served/seal-types.json'));
  beforeEach(module('served/store-status.json'));


  var StoreInstanceReviewCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var routeParams;
  var getStoreDetailsDeferred;
  var storeInstanceDispatchWizardConfig;
  var getStoreInstanceMenuItemsDeferred;
  var storeInstanceReviewFactory;
  var getSealColorsDeferred;
  var getSealTypesDeferred;
  var getStoreInstanceSealsDeferred;
  var location;
  var setStoreStatusDeferred;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q,
                              _servedStoreInstanceMenuItems_, _servedStoreInstanceSeals_,
                              _servedSealColors_, _servedSealTypes_, $location) {
    scope = $rootScope.$new();
    routeParams = {
      storeId: 17,
      action: 'dispatch'
    };
    location = $location;

    storeInstanceDispatchWizardConfig = $injector.get('storeInstanceDispatchWizardConfig');

    // storeInstanceFactory
    storeInstanceFactory = $injector.get('storeInstanceFactory');
    getStoreDetailsDeferred = $q.defer();
    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    getStoreInstanceMenuItemsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred.resolve(_servedStoreInstanceMenuItems_);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(getStoreInstanceMenuItemsDeferred.promise);
    setStoreStatusDeferred = $q.defer();
    setStoreStatusDeferred.resolve({response:200});
    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(setStoreStatusDeferred.promise);

    storeInstanceReviewFactory = $injector.get('storeInstanceReviewFactory');
    getSealColorsDeferred  = $q.defer();
    getSealColorsDeferred.resolve(_servedSealColors_);
    spyOn(storeInstanceReviewFactory, 'getSealColors').and.returnValue(getSealColorsDeferred.promise);
    getSealTypesDeferred = $q.defer();
    getSealTypesDeferred.resolve(_servedSealTypes_);
    spyOn(storeInstanceReviewFactory, 'getSealTypes').and.returnValue(getSealTypesDeferred.promise);
    getStoreInstanceSealsDeferred = $q.defer();
    getStoreInstanceSealsDeferred.resolve(_servedStoreInstanceSeals_);
    spyOn(storeInstanceReviewFactory, 'getStoreInstanceSeals').and.returnValue(getStoreInstanceSealsDeferred.promise);

    StoreInstanceReviewCtrl = $controller('StoreInstanceReviewCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    storeDetailsJSON = {
      LMPStation: 'ORD',
      storeNumber: '180485',
      scheduleDate: '2015-08-13',
      scheduleNumber: 'SCHED123',
      storeInstanceNumber: scope.storeId,
      currentStatus: {name: '2', statusName: 'Ready for Dispatch'},
      statusList: [{'id':1,'statusName':'Ready for Packing','name':'1'},{'id':2,'statusName':'Ready for Seals','name':'2'},{'id':3,'statusName':'Ready for Dispatch','name':'3'},{'id':7,'statusName':'Dispatched','name':'4'},{'id':8,'statusName':'Un-dispatched','name':'7'},{'id':9,'statusName':'Inbounded','name':'6'},{'id':10,'statusName':'On Floor','name':'5'}]
    };


  }));

  describe('Init', function () {
    beforeEach(inject(function () {
      getStoreDetailsDeferred.resolve(storeDetailsJSON);
      scope.$digest();
    }));
    it('should get the store details', function () {
      expect(storeInstanceFactory.getStoreDetails).toHaveBeenCalledWith(routeParams.storeId);
    });

    it('should attach all properties of JSON to scope', function () {
      expect(scope.storeDetails).toEqual(storeDetailsJSON);
    });

    it('should call getStoreInstanceMenuItems', function () {
      var expectedPayload = {
        itemTypeId: 1, // this is 1 because we are requesting regular items.
        scheduleDate: storeDetailsJSON.scheduleDate
      };
      expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(routeParams.storeId, expectedPayload);
    });

    it('should set wizardSteps', function () {
      var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(routeParams.storeId);
      expect(scope.wizardSteps).toEqual(wizardSteps);
    });

    it('should call seal colors API', function () {
      expect(storeInstanceReviewFactory.getSealColors).toHaveBeenCalled();
    });

    it('should call seal types API', function () {
      expect(storeInstanceReviewFactory.getSealTypes).toHaveBeenCalled();
    });

    it('should call get store status API', function () {
      expect(storeInstanceReviewFactory.getStoreInstanceSeals).toHaveBeenCalled();
    });

    it('should create a scope seals object from the 3 seal API calls', function () {
      var mockSealObj = [
        {
          name: 'Outbound',
          bgColor: '#00B200',
          sealNumbers: ['4567', '1']
        },
        { 
          name: 'Inbound',
          bgColor: '#0000FF',
          sealNumbers: ['123']
        },
        {
          name: 'Hand Over',
          bgColor: '#E5E500',
          sealNumbers: []
        },
        {
          name: 'High Security',
          bgColor: '#B70024',
          sealNumbers: []
        }
      ];
      expect(scope.seals).toEqual(mockSealObj);
    });

    describe('stepWizardPrevTrigger scope function', function () {
      it('should set showLoseDataAlert to true and return false', function () {
        expect(scope.stepWizardPrevTrigger()).toBe(false);
        expect(scope.showLoseDataAlert).toBe(true);
      });
    });

    describe('goToWizardStep scope function', function () {
      it('should set wizardStepToIndex to whatever value is passed in and call stepWizardPrevTrigger', function () {
        spyOn(scope, 'stepWizardPrevTrigger');
        var newI = 4;
        scope.goToWizardStep(newI);
        expect(scope.wizardStepToIndex).toBe(newI);
        expect(scope.stepWizardPrevTrigger).toHaveBeenCalled();
      });
    });

    describe('loseDataAlertConfirmTrigger scope function', function () {
      it('should call location URI with wizard URI', function () {
        spyOn(location, 'url');
        var mockIndex = 2;
        scope.wizardStepToIndex = mockIndex;
        var wizardSteps = storeInstanceDispatchWizardConfig.getSteps(routeParams.storeId);
        var mockUri = wizardSteps[mockIndex].uri;
        scope.loseDataAlertConfirmTrigger();
        expect(location.url).toHaveBeenCalledWith(mockUri);
      });
    });

    describe('submit scope function', function () {
      it('should set the store instance status to the name value of "Dispatched" which is 4 with current mock data', function () {
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId, '4');
      });
    });

  });

  describe('if current status is not "ready for dispatch"', function () {
    beforeEach(inject(function () {
      storeDetailsJSON.currentStatus = {name: '45', statusName: 'NOT Ready for Dispatch'};
      getStoreDetailsDeferred.resolve(storeDetailsJSON);
      scope.$digest();
    }));
    it('should set actionNotAllowed to true if not on ready to dispatch status', function () {
      expect(scope.actionNotAllowed).toBe(true);
    });
  });

});
