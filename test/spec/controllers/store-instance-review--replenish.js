'use strict';

describe('Controller: StoreInstanceReviewCtrl replenish', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-seals.json'));
  beforeEach(module('served/seal-colors.json'));
  beforeEach(module('served/seal-types.json'));
  beforeEach(module('served/store-status.json'));
  beforeEach(module('served/store-instance-item-list.json'));

  var StoreInstanceReviewCtrl;
  var scope;
  var storeInstanceFactory;
  var storeDetailsJSON;
  var routeParams;
  var getStoreDetailsDeferred;
  var storeInstanceWizardConfig;
  var getStoreInstanceMenuItemsDeferred;
  var storeInstanceReviewFactory;
  var getSealColorsDeferred;
  var getSealTypesDeferred;
  var getStoreInstanceSealsDeferred;
  var location;
  var setStoreStatusDeferred;
  var getStoreInstanceItemsDeferred;
  var dateUtility;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q,
                              _servedStoreInstanceMenuItems_, _servedStoreInstanceSeals_,
                              _servedSealColors_, _servedSealTypes_, $location, _servedStoreInstanceItemList_) {
    scope = $rootScope.$new();
    routeParams = {
      storeId: 17,
      action: 'replenish'
    };
    location = $location;

    storeInstanceWizardConfig = $injector.get('storeInstanceWizardConfig');
    dateUtility = $injector.get('dateUtility');

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
    getStoreInstanceItemsDeferred = $q.defer();
    getStoreInstanceItemsDeferred.resolve(_servedStoreInstanceItemList_);
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);

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

    spyOn(location, 'url').and.callThrough();

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
      statusList: [{'id':1,'statusName':'Ready for Packing','name':'1'},{'id':2,'statusName':'Ready for Seals','name':'2'},{'id':3,'statusName':'Ready for Dispatch','name':'3'},{'id':7,'statusName':'Dispatched','name':'4'},{'id':8,'statusName':'Un-dispatched','name':'7'},{'id':9,'statusName':'Inbounded','name':'6'},{'id':10,'statusName':'On Floor','name':'5'}],
      replenishStoreInstanceId: 1
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
      var formattedDate = dateUtility.formatDateForAPI(storeDetailsJSON.scheduleDate);
      var expectedPayload = {
        itemTypeId: 1, // this is 1 because we are requesting regular items.
        date: formattedDate
      };
      expect(storeInstanceFactory.getStoreInstanceMenuItems).toHaveBeenCalledWith(routeParams.storeId, expectedPayload);
    });

    it('should call getStoreInstanceItems', function () {
      expect(storeInstanceFactory.getStoreInstanceItemList).toHaveBeenCalledWith(routeParams.storeId);
    });

    it('should format scope.items', function(){
      var mockedItems = [{id: 1, companyId: 403, storeInstanceId: 13, itemMasterId: 3, itemCode: 'Ip015', itemName: 'Ipad Mini', quantity: 88, createdBy: null, createdOn: '2015-08-17 19:04:35.0437', updatedBy: null, updatedOn: '2015-08-19 15:13:02.863531', itemDescription: 'Ip015 -  Ipad Mini', disabled: true, menuQuantity: 50}, {id: 3, companyId: 403, storeInstanceId: 13, itemMasterId: 5, itemCode: 'Sd005', itemName: 'Pepsi', quantity: 55, createdBy: null, createdOn: '2015-08-17 19:31:27.867813', updatedBy: null, updatedOn: '2015-08-19 15:13:08.002925', itemDescription: 'Sd005 -  Pepsi', disabled: true, menuQuantity: 25}, {id: 13, companyId: 403, storeInstanceId: 13, itemMasterId: 4, itemCode: 'Ru-002', itemName: 'BabyRuth', quantity: 777, createdBy: 1, createdOn: '2015-08-17 19:08:07.817813', updatedBy: 1, updatedOn: '2015-08-31 18:44:54.609744', itemDescription: 'Ru-002 -  BabyRuth', disabled: true, menuQuantity: 15}, {id: 14, companyId: 403, storeInstanceId: 13, itemMasterId: 4, itemCode: 'Ru-002', itemName: 'BabyRuth', quantity: 77, createdBy: 1, createdOn: '2015-08-17 19:08:07.817813', updatedBy: 1, updatedOn: '2015-08-19 15:13:05.317675', itemDescription: 'Ru-002 -  BabyRuth', disabled: true, menuQuantity: 15}, {id: 15, companyId: 403, storeInstanceId: 13, itemMasterId: 4, itemCode: 'Ru-002', itemName: 'BabyRuth', quantity: 77, createdBy: 1, createdOn: '2015-08-17 19:08:07.817813', updatedBy: 1, updatedOn: '2015-08-19 15:13:05.317675', itemDescription: 'Ru-002 -  BabyRuth', disabled: true, menuQuantity: 15}, {id: 16, companyId: 2, storeInstanceId: 13, itemMasterId: 63, itemCode: 'DUP 878', itemName: 'DUP 878', quantity: 22, createdBy: 1, createdOn: '2015-09-01 16:41:37.693056', updatedBy: null, updatedOn: null, itemDescription: 'DUP 878 -  DUP 878', disabled: true, menuQuantity: 0}];
      expect(scope.items).toEqual(mockedItems);
    });

    it('should set wizardSteps', function () {
      var wizardSteps = storeInstanceWizardConfig.getSteps(routeParams.action, routeParams.storeId);
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
        expect(scope.wizardStepToIndex).toBe(2);
      });
    });

    describe('goToWizardStep scope function', function () {
      it('should set wizardStepToIndex to whatever value is passed in and call updateStatus', function () {
        spyOn(scope, 'stepWizardPrevTrigger');
        var newI = 4;
        scope.goToWizardStep(newI);
        expect(scope.wizardStepToIndex).toBe(newI);
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId, newI.toString());
      });
    });

    describe('loseDataAlertConfirmTrigger scope function', function () {
      it('should update status wit wizardStep', function () {
        var mockIndex = 2;
        scope.wizardStepToIndex = mockIndex;
        scope.loseDataAlertConfirmTrigger();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId, mockIndex.toString());
      });
    });

    describe('submit scope function', function () {
      it('should set the store instance status to the name value of "Dispatched" which is 4 with current mock data', function () {
        scope.submit();
        expect(storeInstanceFactory.updateStoreInstanceStatus).toHaveBeenCalledWith(routeParams.storeId, '4');
        scope.$apply();
        expect(location.url).toHaveBeenCalledWith('/store-instance-dashboard');
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

  describe('Init with invalid store detail model', function(){
    beforeEach(inject(function () {
      delete storeDetailsJSON.replenishStoreInstanceId;
      storeDetailsJSON.statusList = [];
      getStoreDetailsDeferred.resolve(storeDetailsJSON);
      scope.$digest();
    }));
    it('should set actionNotAllowed to true', function(){
      expect(scope.actionNotAllowed).toBe(true);
    });
  });

  describe('scope.exit', function () {
    it('should redirect to store instance dashboard', function () {
      scope.exit();
      scope.$apply();
      expect(location.url).toHaveBeenCalledWith('/store-instance-dashboard');
    });
  });

});
