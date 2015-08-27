'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App',
    'served/lmp-delivery-note.json', 'served/catering-stations.json',
    'served/master-item-list.json',
    'served/company-reason-codes.json', 'served/items-by-caterer-station-id.json'));

  var LmpDeliveryNoteCtrl;
  var scope;
  var deliveryNoteFactory;
  var lmpDeliveryNoteResponseJSON;
  var getDeliveryNoteDeferred;
  var routeParams;
  var location;
  var cateringStationsReponseJSON;
  var getCateringStationsDeferred;
  var companyId;
  var getCatererStationMasterItemsResponseJSON;
  var getCatererStationMasterItemsDeferred;
  var getCompanyReasonCodesResponseJSON;
  var getCompanyReasonCodesDeferred;
  var saveDeferred;
  var getAllMasterItemsDeferred;
  var getAllMasterItemsResponseJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _deliveryNoteFactory_,
                              _servedLmpDeliveryNote_, $location, _servedCateringStations_,
                              _servedMasterItemList_,
                              _servedCompanyReasonCodes_, _servedItemsByCatererStationId_) {

    companyId = 403;

    scope = $rootScope.$new();
    location = $location;
    deliveryNoteFactory = _deliveryNoteFactory_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;
    cateringStationsReponseJSON = _servedCateringStations_;
    getCatererStationMasterItemsResponseJSON = _servedItemsByCatererStationId_;
    getCompanyReasonCodesResponseJSON = _servedCompanyReasonCodes_;
    getAllMasterItemsResponseJSON = _servedMasterItemList_;

    getDeliveryNoteDeferred = $q.defer();
    getDeliveryNoteDeferred.resolve(lmpDeliveryNoteResponseJSON);
    spyOn(deliveryNoteFactory, 'getDeliveryNote').and.returnValue(getDeliveryNoteDeferred.promise);

    getCatererStationMasterItemsDeferred = $q.defer();
    getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
    spyOn(deliveryNoteFactory, 'getItemsByCateringStationId').and.returnValue(getCatererStationMasterItemsDeferred.promise);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(getCompanyReasonCodesResponseJSON);
    spyOn(deliveryNoteFactory, 'getCompanyReasonCodes').and.returnValue(getCompanyReasonCodesDeferred.promise);

    saveDeferred = $q.defer();
    saveDeferred.resolve({id:3});
    spyOn(deliveryNoteFactory, 'createDeliveryNote').and.returnValue(saveDeferred.promise);
    spyOn(deliveryNoteFactory, 'saveDeliveryNote').and.returnValue(saveDeferred.promise);

    getAllMasterItemsDeferred = $q.defer();
    getAllMasterItemsDeferred.resolve(getAllMasterItemsResponseJSON);
    spyOn(deliveryNoteFactory, 'getAllMasterItems').and.returnValue(getAllMasterItemsDeferred.promise);

  }));

  describe('single caterer station on create', function(){
    beforeEach(inject(function($q, $controller){
      getCateringStationsDeferred = $q.defer();
      getCateringStationsDeferred.resolve({response:[{id:3}]});
      spyOn(deliveryNoteFactory, 'getCatererStationList').and.returnValue(getCateringStationsDeferred.promise);
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: {state: 'create'}
      });
    }));
    it('should set deliveryNote.catererStationId if only 1 results', function(){
      scope.$digest();
      expect(scope.deliveryNote.catererStationId).toBe(3);
    });
    it('should set prevState when toggleReview is called', function(){
      scope.deliveryNote.items = [{deliveredQuantity:4}];
      scope.toggleReview();
      scope.$digest();
      expect(scope.prevState).toBe('create');
      expect(scope.state).toBe('review');
      scope.toggleReview();
      scope.$digest();
      expect(scope.state).toBe('create');
    });
  });

  describe('multiple caterer stations', function(){
    beforeEach(inject(function($q){
      getCateringStationsDeferred = $q.defer();
      getCateringStationsDeferred.resolve(cateringStationsReponseJSON);
      spyOn(deliveryNoteFactory, 'getCatererStationList').and.returnValue(getCateringStationsDeferred.promise);

    }));
    describe('invalid state passed to route', function(){
      beforeEach(inject(function($controller){
        routeParams = {
          state: 'invalid'
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));
      it('should redirect to /', function(){
        expect(location.path()).toBe('/');
      });
    });

    describe('Read / view controller action', function(){
      beforeEach(inject(function($controller){
        routeParams = {
          state: 'view',
          id: 49
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));
      it('should have a state scope var set to view', function(){
        expect(scope.state).toBe('view');
      });
      // Apit call #1
      it('should call stock management get delivery note api with id', function(){
        expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
      });
      it('should set deliveryNote scope var', function(){
        expect(scope.deliveryNote).toBeDefined();
      });
      // API call #2
      it('should call stock management get delivery note api with id', function(){
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });
      it('should set cateringStationList scope var', function(){
        expect(scope.catererStationList).toBeDefined();
        expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
      });
      // API call #3
      it('should call getCompanyReasonCodes in factory', function(){
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });
      it('should set the ullageReasons scope var', function(){
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });
      // Scope globals
      describe('global scope functions and vars', function(){
        it('should have a cancel scope function', function(){
          expect(scope.cancel).toBeDefined();
          expect(Object.prototype.toString.call(scope.cancel)).toBe('[object Function]');
        });
        it('should have a toggleReview scope function', function(){
          expect(scope.toggleReview).toBeDefined();
          expect(Object.prototype.toString.call(scope.toggleReview)).toBe('[object Function]');
        });
        it('should have a clearFilter scope function', function(){
          expect(scope.clearFilter).toBeDefined();
          expect(Object.prototype.toString.call(scope.clearFilter)).toBe('[object Function]');
        });
        it('should have a save scope function', function(){
          expect(scope.save).toBeDefined();
          expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
          scope.deliveryNote = {isAccepted:true};
          expect(scope.save()).toBeUndefined();
        });
      });
    });

    describe('Create controller action', function(){
      beforeEach(inject(function($controller){
        routeParams = {
          state: 'create'
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));
      it('should have a state scope var set to create', function(){
        expect(scope.state).toBe('create');
      });
      // API call #1
      it('should call stock management get delivery note api with id', function(){
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });
      it('should set cateringStationList scope var', function(){
        expect(scope.catererStationList).toBeDefined();
      });
      // API call #2
      it('should call getCompanyReasonCodes in factory', function(){
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });
      it('should set the ullageReasons scope var', function(){
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });
      it('should redirect to / when cancel button is clicked', function(){
        scope.cancel();
        expect(location.path()).toBe('/');
      });
      describe('save scope function, only save', function() {
        beforeEach(function(){
          scope.deliveryNote = {
            catererStationId: 3,
            deliveryDate: '08/06/2015',
            deliveryNoteNumber: 'askdjhas78day',
            purchaseOrderNumber: 'ksahd9a8sda8d',
            items: [
              {
                deliveredQuantity: 2,
                expectedQuantity: 2,
                itemCode: 'Sk001',
                itemName: 'Skittles',
                masterItemId: 1,
                ullageQuantity: 1
              },
              {
                deliveredQuantity: 1,
                expectedQuantity: 1,
                itemCode: 'SD001',
                itemName: 'Coke',
                masterItemId: 2
              }
            ]
          };
          scope.save(false);
        });
        it('should call createDeliveryNote', function(){
          var mockedPayload = {
            catererStationId: 3,
            purchaseOrderNumber: 'ksahd9a8sda8d',
            deliveryNoteNumber: 'askdjhas78day',
            deliveryDate: '20150806',
            isAccepted: false,
            items: [
              {
                deliveredQuantity: 2,
                expectedQuantity: 2,
                masterItemId: 1,
                ullageQuantity: 1,
                ullageReason: null
              },
              {
                deliveredQuantity: 1,
                expectedQuantity: 1,
                masterItemId: 2,
                ullageQuantity: null,
                ullageReason: null
              }
            ]
          };
          expect(deliveryNoteFactory.createDeliveryNote).toHaveBeenCalledWith(mockedPayload);
        });
      });

    });

    describe('Edit controller action', function(){
      beforeEach(inject(function($controller){
        routeParams = {
          state: 'edit',
          id: 49
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));
      it('should have a state scope var set to create', function(){
        expect(scope.state).toBe('edit');
      });
      // API call #1
      it('should call stock management get delivery note api with id', function(){
        expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
      });
      it('should set deliveryNote scope var', function(){
        expect(scope.deliveryNote).toBeDefined();
      });
      // API call #2
      it('should call stock management get delivery note api with id', function(){
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });
      it('should set cateringStationList scope var', function(){
        expect(scope.catererStationList).toBeDefined();
        expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
      });
      // API call #3
      it('should call getCompanyReasonCodes in factory', function(){
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });
      it('should set the ullageReasons scope var', function(){
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });
      describe('changing LMP station', function(){
        it('should call retail item master API', function(){
          var csid = 3;
          scope.deliveryNote.catererStationId = csid;
          scope.$digest();
          expect(deliveryNoteFactory.getItemsByCateringStationId).toHaveBeenCalledWith(csid);
          expect(scope.deliveryNote.items.length).toEqual(getCatererStationMasterItemsResponseJSON.response.length);
        });
      });
      describe('removeItemByIndex scope function', function(){
        it('should have a removeItemByIndex scope function defined', function(){
          expect(scope.removeItemByIndex).toBeDefined();
          expect(Object.prototype.toString.call(scope.removeItemByIndex)).toBe('[object Function]');
        });
        it('should remove 1 item from the deliveryNote.items array', function(){
          var curCount = scope.deliveryNote.items.length;
          var mockItem = {
            canEdit: true
          };
          scope.removeItemByIndex(0, mockItem);
          scope.$digest();
          expect(scope.deliveryNote.items.length).toBe((curCount - 1));
        });
      });
      it('should switch the state to review when review button is clicked', function(){
        scope.deliveryNote.items = [{deliveredQuantity:5}];
        scope.toggleReview();
        expect(scope.state).toBe('review');
      });
      it('should switch the state back to edit when the cancel button is clicked', function(){
        scope.cancel();
        expect(scope.state).toBe('edit');
      });
      describe('clearFilter scope function', function(){
        it('should set all filters to empty string when called', function(){
          scope.filterInput = {};
          scope.filterInput.itemCode = 's';
          scope.filterInput.itemName = 's';
          scope.$digest();
          scope.clearFilter();
          expect(scope.filterInput.itemCode).toBeUndefined();
          expect(scope.filterInput.itemName).toBeUndefined();
        });
      });
      describe('save scope function submit delivery note', function(){
        beforeEach(function(){
          scope.save(true);
        });
        it('should call saveDeliveryNote', function(){
          expect(deliveryNoteFactory.saveDeliveryNote).toHaveBeenCalled();
        });
      });
      describe('addItems scope function', function(){
        it('should be defined as a scope', function(){
          expect(Object.prototype.toString.call(scope.addItems)).toBe('[object Function]');
        });
        it('should make a request to get all master items', function(){
          scope.addItems();
          expect(deliveryNoteFactory.getAllMasterItems).toHaveBeenCalled();
        });
        it('should return undefined because the API was already called', function(){
          expect(scope.addItems()).toBeUndefined();
        });
      });
      describe('addItem scope function', function(){
        it('should be defined as a scope', function(){
          expect(Object.prototype.toString.call(scope.addItem)).toBe('[object Function]');
        });
        it('should add an item to the delivery note items array', function(){
          scope.addItems();
          var selectedMasterItem = {};
          selectedMasterItem.id = '43242';
          selectedMasterItem.itemCode = 'Item code 43242';
          selectedMasterItem.itemName = 'Item name 43242';
          var $index = scope.deliveryNote.items.length;
          scope.$digest();
          scope.addItem(selectedMasterItem, $index);
          expect(scope.deliveryNote.items[$index].itemCode).toBe('Item code 43242');
        });
        it('should return undefined if no select master item is passed', function(){
          expect(scope.addItem(0)).toBeUndefined();
        });
        it('should return undefined if in the currecnt delivery note items array', function(){
          scope.deliveryNote = {
            items: [{masterItemId:123}]
          };
          expect(scope.addItem({id:123})).toBeUndefined();
        });
      });
      describe('canRemoveItem scope function', function(){
        it('should return false if item.canEdit is false', function(){
          expect(scope.canRemoveItem({canEdit:false})).toBe(false);
        });
        it('should return false if readOnly', function(){
          scope.readOnly = true;
          expect(scope.canRemoveItem({canEdit:true})).toBe(false);
        });
      });
      describe('formErrorClass scope function', function(){
        beforeEach(function(){
          scope.form = [];
          scope.form['Mock Field'] = {$dirty:true, $valid:false};
          scope.form['Mock Field 2'] = {$dirty:false, $valid:false};
          scope.form['Mock Field 3'] = {$dirty:true, $valid:true};
          scope.displayError = true;
          scope.$digest();
        });
        it('should return empty string if the form does not contain that field', function(){
          expect(scope.formErrorClass('foobars', true)).toBe('');
        });
        it('should return has-error field is dirty and not valid', function(){
          expect(scope.formErrorClass('Mock Field', true)).toBe('has-error');
        });
        it('should return has-error field is not dirty and not valid but show form errors', function(){
          expect(scope.formErrorClass('Mock Field 2', true)).toBe('has-error');
        });
        it('should return empty string field is dirty and valid', function(){
          expect(scope.formErrorClass('Mock Field 3', true)).toBe('');
        });
      });
      describe('calculateBooked scope function', function(){
        it('should return 7', function(){
          expect(scope.calculateBooked({deliveredQuantity:10,ullageQuantity:3})).toBe(7);
        });
      });
      describe('removeNewItemRow scope functions', function(){
        it('should return undefined if item.canEdit is false', function(){
          expect(scope.removeNewItemRow({canEdit:false},0)).toBeUndefined();
        });
        it('should remove 1 item from netItems array', function(){
          var ar = [1,2,3,4];
          scope.newItems = ar;
          scope.removeNewItemRow(0,{canEdit:true});
          expect(scope.newItems.length).toBe(3);
        });
      });
      describe('ullageQuantityChanged scope function', function(){
        it('should return undefined if there is a ullageQuantity set', function(){
          expect(scope.ullageQuantityChanged({ullageQuantity:2})).toBeUndefined();
        });
        it('should set ullageReason to null if no ullageQuantity', function(){
          var item = {ullageQuantity:null, ullageReason:3};
          scope.ullageQuantityChanged(item);
          expect(item.ullageReason).toBeNull();
        });
      });
      describe('showSaveButton scope function', function(){
        it('should return true if state is review', function(){
          scope.state = 'review';
          expect(scope.showSaveButton()).toBe(true);
        });
        it('should return false if state is not review', function(){
          scope.state = 'create';
          expect(scope.showSaveButton()).toBe(false);
        });
      });
      describe('hideCreatedByMeta scope function', function(){
        it('should return true if state is review', function(){
          scope.state = 'review';
          expect(scope.hideCreatedByMeta()).toBe(true);
        });
        it('should return true if state is create', function(){
          scope.state = 'create';
          expect(scope.hideCreatedByMeta()).toBe(true);
        });
        it('should return false if state is not review or create', function(){
          scope.state = 'edit';
          expect(scope.hideCreatedByMeta()).toBe(false);
        });
      });
      describe('canEditItem scope function', function(){
        it('should return true if canEdit and state is not review', function(){
          scope.state = 'create';
          expect(scope.canEditItem({canEdit:true})).toBe(true);
        });
        it('should return false if canEdit is false', function(){
          scope.state = 'create';
          expect(scope.canEditItem({canEdit:false})).toBe(false);
        });
        it('should return false if state is review', function(){
          scope.state = 'review';
          expect(scope.canEditItem({canEdit:true})).toBe(false);
        });
      });
      describe('showFilterByForm scope function', function() {
        it('should return false if state is review', function () {
          scope.state = 'review';
          expect(scope.showFilterByForm()).toBe(false);
        });
        it('should return false if deliveryNote is undefined', function(){
          scope.state = 'create';
          scope.deliveryNote = undefined;
          expect(scope.showFilterByForm()).toBe(false);
        });
        it('should return false if no deliveryNote items', function(){
          scope.state = 'create';
          scope.deliveryNote = {};
          expect(scope.showFilterByForm()).toBe(false);
        });
        it('should return false if no deliveryNote items array items', function(){
          scope.state = 'create';
          scope.deliveryNote = {items:[]};
          expect(scope.showFilterByForm()).toBe(false);
        });
        it('should return true if deliveryNote has items', function(){
          scope.state = 'create';
          scope.deliveryNote = {items:[{id:1}]};
          expect(scope.showFilterByForm()).toBe(true);
        });
      });
      describe('ullageReasonDisabled scope function', function(){
        it('should return true is readOnly', function(){
          scope.readOnly = true;
          expect(scope.ullageReasonDisabled({})).toBe(true);
        });
        it('should return true if no ullageQuantity', function(){
          scope.readOnly = false;
          expect(scope.ullageReasonDisabled({})).toBe(true);
        });
        it('should return false if not readyonly and ullageQuantity set', function(){
          scope.readOnly = false;
          expect(scope.ullageReasonDisabled({ullageQuantity:5})).toBe(false);
        });
      });
    });
  });
});
