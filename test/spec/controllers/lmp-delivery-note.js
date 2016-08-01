'use strict';

describe('Controller: LmpDeliveryNoteCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/lmp-delivery-note.json'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/company-reason-codes.json'));
  beforeEach(module('served/items-by-caterer-station-id.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/characteristics.json'));
  beforeEach(module('served/menus.json'));
  beforeEach(module('served/menu-catering-stations.json'));

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
  var getItemTypesDeferred;
  var getItemTypesResponseJSON;
  var getItemCharacteristicsDeferred;
  var getItemCharacteristicsResponseJSON;
  var getMenuListDeferred;
  var getMenuListJSON;
  var getMenuCatererStationListDeferred;
  var getMenuCatererStationListJSON;
  var httpBackend;
  var dateUtility;
  var lodash;

  beforeEach(inject(function($injector, $controller, $httpBackend, $rootScope, $q, _deliveryNoteFactory_,
    _servedLmpDeliveryNote_, $location, _servedCateringStations_, _servedMasterItemList_,
    _servedCompanyReasonCodes_, _servedItemsByCatererStationId_, _servedItemTypes_, _servedCharacteristics_, _servedMenus_, _servedMenuCateringStations_) {

    companyId = 403;
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    location = $location;
    deliveryNoteFactory = _deliveryNoteFactory_;
    lmpDeliveryNoteResponseJSON = _servedLmpDeliveryNote_;
    cateringStationsReponseJSON = _servedCateringStations_;
    getCatererStationMasterItemsResponseJSON = _servedItemsByCatererStationId_;
    getCompanyReasonCodesResponseJSON = _servedCompanyReasonCodes_;
    getAllMasterItemsResponseJSON = _servedMasterItemList_;
    getItemTypesResponseJSON = _servedItemTypes_;
    getItemCharacteristicsResponseJSON = _servedCharacteristics_;
    getMenuListJSON = _servedMenus_;
    getMenuCatererStationListJSON = _servedMenuCateringStations_;

    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');

    getDeliveryNoteDeferred = $q.defer();
    getDeliveryNoteDeferred.resolve(lmpDeliveryNoteResponseJSON);
    spyOn(deliveryNoteFactory, 'getDeliveryNote').and.returnValue(getDeliveryNoteDeferred.promise);

    getCatererStationMasterItemsDeferred = $q.defer();
    spyOn(deliveryNoteFactory, 'getItemsByCateringStationId').and.returnValue(
      getCatererStationMasterItemsDeferred.promise);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(getCompanyReasonCodesResponseJSON);
    spyOn(deliveryNoteFactory, 'getCompanyReasonCodes').and.returnValue(getCompanyReasonCodesDeferred.promise);

    saveDeferred = $q.defer();
    saveDeferred.resolve({
      id: 3
    });
    spyOn(deliveryNoteFactory, 'createDeliveryNote').and.returnValue(saveDeferred.promise);
    spyOn(deliveryNoteFactory, 'saveDeliveryNote').and.returnValue(saveDeferred.promise);

    getAllMasterItemsDeferred = $q.defer();
    getAllMasterItemsDeferred.resolve(getAllMasterItemsResponseJSON);
    spyOn(deliveryNoteFactory, 'getMasterItems').and.returnValue(getAllMasterItemsDeferred.promise);

    getItemTypesDeferred = $q.defer();
    getItemTypesDeferred.resolve(getItemTypesResponseJSON);
    spyOn(deliveryNoteFactory, 'getItemTypes').and.returnValue(getItemTypesDeferred.promise);

    getItemCharacteristicsDeferred = $q.defer();
    getItemCharacteristicsDeferred.resolve(getItemCharacteristicsResponseJSON);
    spyOn(deliveryNoteFactory, 'getCharacteristics').and.returnValue(getItemCharacteristicsDeferred.promise);

    getMenuListDeferred = $q.defer();
    getMenuListDeferred.resolve(getMenuListJSON);
    spyOn(deliveryNoteFactory, 'getMenuList').and.returnValue(getMenuListDeferred.promise);

    getMenuCatererStationListDeferred = $q.defer();
    spyOn(deliveryNoteFactory, 'getMenuCatererStationList').and.returnValue(getMenuCatererStationListDeferred.promise);

  }));

  describe('single caterer station on create', function() {
    beforeEach(inject(function($q, $controller) {
      getCateringStationsDeferred = $q.defer();
      getCateringStationsDeferred.resolve({
        response: [{
          id: 3
        }]
      });
      spyOn(deliveryNoteFactory, 'getCatererStationList').and.returnValue(getCateringStationsDeferred.promise);
      LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
        $scope: scope,
        $routeParams: {
          state: 'create'
        }
      });
    }));

    it('should set deliveryNote.catererStationId if only 1 results', function() {
      scope.$digest();
      expect(scope.deliveryNote.catererStationId).toBe(3);
    });

    it('should set prevState when toggleReview is called', function() {
      scope.deliveryNote.items = [{
        deliveredQuantity: 4
      }];
      scope.toggleReview();
      scope.$digest();
      expect(scope.prevState).toBe('create');
      expect(scope.state).toBe('review');
      scope.toggleReview();
      scope.$digest();
      expect(scope.state).toBe('create');
    });
  });

  describe('multiple caterer stations', function() {
    beforeEach(inject(function($q) {
      getCateringStationsDeferred = $q.defer();
      getCateringStationsDeferred.resolve(cateringStationsReponseJSON);
      spyOn(deliveryNoteFactory, 'getCatererStationList').and.returnValue(getCateringStationsDeferred.promise);
    }));

    describe('stationId passed in route', function () {
      beforeEach(inject(function($controller) {
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: {
            state: 'create',
            id: '3'
          }
        });

        getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
        getMenuCatererStationListDeferred.resolve(getMenuCatererStationListJSON);
        scope.$digest();
      }));
      it('should automatically set delivery note station', function () {
        expect(scope.deliveryNote.catererStationId).toEqual(3);
      });

      it('should auto populate the items', function () {
        expect(scope.masterItems).toBeDefined();
        expect(scope.deliveryNote.items.length > 0).toEqual(true);
      });
    });

    describe('invalid state passed to route', function() {
      beforeEach(inject(function($controller) {
        routeParams = {
          state: 'invalid'
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));

      it('should redirect to /', function() {
        expect(location.path()).toBe('/');
      });
    });

    describe('Read / view controller action', function() {
      beforeEach(inject(function($controller) {
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

      it('should have a state scope var set to view', function() {
        expect(scope.state).toBe('view');
      });

      // Apit call #1
      it('should call stock management get delivery note api with id', function() {
        expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
      });

      it('should set deliveryNote scope var', function() {
        expect(scope.deliveryNote).toBeDefined();
      });

      // API call #2
      it('should call stock management get delivery note api with id', function() {
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });

      it('should set cateringStationList scope var', function() {
        expect(scope.catererStationList).toBeDefined();
        expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
      });

      // API call #3
      it('should call getCompanyReasonCodes in factory', function() {
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });

      it('should set the ullageReasons scope var', function() {
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });

      it('should call getItemTypes in factory', function() {
        expect(deliveryNoteFactory.getItemTypes).toHaveBeenCalled();
      });

      it('should call getMasterItems with regular item type and start date filter', function() {
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 1,
          startDate: today
        }; // regular item type id
        expect(deliveryNoteFactory.getMasterItems).toHaveBeenCalledWith(expectedPayload);
      });

      // Scope globals
      describe('global scope functions and vars', function() {
        it('should have a cancel scope function', function() {
          expect(scope.cancel).toBeDefined();
          expect(Object.prototype.toString.call(scope.cancel)).toBe('[object Function]');
        });

        it('should have a toggleReview scope function', function() {
          expect(scope.toggleReview).toBeDefined();
          expect(Object.prototype.toString.call(scope.toggleReview)).toBe('[object Function]');
        });

        it('should have a clearFilter scope function', function() {
          expect(scope.clearFilter).toBeDefined();
          expect(Object.prototype.toString.call(scope.clearFilter)).toBe('[object Function]');
        });

        it('should have a save scope function', function() {
          expect(scope.save).toBeDefined();
          expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
          scope.deliveryNote = {
            isAccepted: true
          };
          expect(scope.save()).toBeUndefined();
        });
      });
    });

    describe('Create controller action', function() {
      beforeEach(inject(function($controller) {
        routeParams = {
          state: 'create'
        };
        LmpDeliveryNoteCtrl = $controller('LmpDeliveryNoteCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));

      it('should have a state scope var set to create', function() {
        expect(scope.state).toBe('create');
      });

      // API call #1
      it('should call stock management get delivery note api with id', function() {
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });

      it('should set cateringStationList scope var', function() {
        expect(scope.catererStationList).toBeDefined();
      });

      // API call #2
      it('should call getCompanyReasonCodes in factory', function() {
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });

      it('should set the ullageReasons scope var', function() {
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });

      it('should redirect to / when cancel button is clicked', function() {
        scope.cancel();
        expect(location.path()).toBe('/');
      });

      it('should call getItemTypes in factory', function() {
        expect(deliveryNoteFactory.getItemTypes).toHaveBeenCalled();
      });

      it('should call getCharacteristics in factory', function() {
        expect(deliveryNoteFactory.getCharacteristics).toHaveBeenCalled();
      });

      it('should call getMasterItems with regular item type filter', function() {
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 1,
          startDate: today
        }; // regular item type id
        expect(deliveryNoteFactory.getMasterItems).toHaveBeenCalledWith(expectedPayload);
      });

      it('should get active and future menus', function () {
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var expectedPayload = { startDate: today };
        expect(deliveryNoteFactory.getMenuList).toHaveBeenCalledWith(expectedPayload);
      });

      describe('save scope function, only save', function() {
        beforeEach(function() {
          scope.deliveryNote = {
            catererStationId: 3,
            deliveryDate: '08/06/2015',
            deliveryNoteNumber: 'askdjhas78day',
            purchaseOrderNumber: 'ksahd9a8sda8d',
            items: [{
              deliveredQuantity: 2,
              expectedQuantity: 2,
              itemCode: 'Sk001',
              itemName: 'Skittles',
              itemMasterId: 1,
              ullageQuantity: 1
            }, {
              deliveredQuantity: 1,
              expectedQuantity: 1,
              itemCode: 'SD001',
              itemName: 'Coke',
              itemMasterId: 2
            }]
          };
          scope.save(false);
        });

        it('should call createDeliveryNote', function() {
          var mockedPayload = jasmine.objectContaining({
            catererStationId: 3,
            purchaseOrderNumber: 'ksahd9a8sda8d',
            deliveryNoteNumber: 'askdjhas78day',
            deliveryDate: '20150806',
            isAccepted: false,
            items: [{
              masterItemId: 1,
              expectedQuantity: 2,
              deliveredQuantity: 2,
              ullageQuantity: 1,
              ullageReason: null
            }, {
              masterItemId: 2,
              expectedQuantity: 1,
              deliveredQuantity: 1,
              ullageQuantity: 0,
              ullageReason: null
            }]
          });
          expect(deliveryNoteFactory.createDeliveryNote).toHaveBeenCalledWith(mockedPayload);
        });
      });

    });

    describe('Edit controller action', function() {
      beforeEach(inject(function($controller) {
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

      it('should have a state scope var set to create', function() {
        expect(scope.state).toBe('edit');
      });

      // API call #1
      it('should call stock management get delivery note api with id', function() {
        expect(deliveryNoteFactory.getDeliveryNote).toHaveBeenCalledWith(routeParams.id);
      });

      it('should set deliveryNote scope var', function() {
        expect(scope.deliveryNote).toBeDefined();
      });

      // API call #2
      it('should call stock management get delivery note api with id', function() {
        expect(deliveryNoteFactory.getCatererStationList).toHaveBeenCalled();
      });

      it('should set cateringStationList scope var', function() {
        expect(scope.catererStationList).toBeDefined();
        expect(Object.prototype.toString.call(scope.catererStationList)).toBe('[object Array]');
      });

      // API call #3
      it('should call getCompanyReasonCodes in factory', function() {
        expect(deliveryNoteFactory.getCompanyReasonCodes).toHaveBeenCalled();
      });

      it('should set the ullageReasons scope var', function() {
        expect(scope.ullageReasons).toBeDefined();
        expect(Object.prototype.toString.call(scope.ullageReasons)).toBe('[object Array]');
      });

      it('should call getItemTypes in factory', function() {
        expect(deliveryNoteFactory.getItemTypes).toHaveBeenCalled();
      });

      it('should call getMasterItems with regular item type filter', function() {
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var expectedPayload = {
          itemTypeId: 1,
          characteristicId: 1,
          startDate: today
        }; // regular item type id
        expect(deliveryNoteFactory.getMasterItems).toHaveBeenCalledWith(expectedPayload);
      });

      it('should get active and future menus', function () {
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var expectedPayload = { startDate: today };
        expect(deliveryNoteFactory.getMenuList).toHaveBeenCalledWith(expectedPayload);
      });

      describe('changing LMP station', function() {

        var emptyItemResponse = {response: []};
        var emptyMenuResponse = {companyMenuCatererStations: []};
        beforeEach(function() {
          httpBackend.expectGET(/./).respond(200);
          var cateringStationId = 5;
          scope.deliveryNote.catererStationId = cateringStationId;
        });

        it('should get catering station items API', function() {
          getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
          getMenuCatererStationListDeferred.resolve(emptyMenuResponse);
          scope.$digest();
          expect(deliveryNoteFactory.getItemsByCateringStationId).toHaveBeenCalledWith(scope.deliveryNote.catererStationId);
        });

        it('should get catering station menus', function () {
          getCatererStationMasterItemsDeferred.resolve(emptyItemResponse);
          getMenuCatererStationListDeferred.resolve(getMenuCatererStationListJSON);
          var expectedPayload = {
            catererStationId: scope.deliveryNote.catererStationId,
            startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
          };
          scope.$digest();
          expect(deliveryNoteFactory.getMenuCatererStationList).toHaveBeenCalledWith(expectedPayload);
        });

        it('should add catering station items to delivery note list', function () {
          getCatererStationMasterItemsDeferred.resolve(emptyItemResponse);
          getMenuCatererStationListDeferred.resolve(getMenuCatererStationListJSON);
          scope.$digest();

          expect(scope.deliveryNote.items.length > 0).toEqual(true);

          // check that a menu in catererStationList has an items that was added to final list
          var sampleCatererStationMenu = getMenuCatererStationListJSON.companyMenuCatererStations[0];
          var menuMasterMatch = lodash.findWhere(scope.menuList, {menuId: sampleCatererStationMenu.menuId});
          var sampleMenuItem = menuMasterMatch.menuItems[0];
          var deliveryNoteItemMatch = lodash.findWhere(scope.deliveryNote.items, {itemMasterId: sampleMenuItem.itemMasterId});
          expect(deliveryNoteItemMatch).toBeDefined();
        });

        it('should add catering station menu items to delivery note list', function () {
          getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
          getMenuCatererStationListDeferred.resolve(emptyMenuResponse);
          scope.$digest();

          expect(scope.deliveryNote.items.length > 0).toEqual(true);

          var sampleStationItem = getCatererStationMasterItemsResponseJSON.response[0];
          var deliveryNoteItemMatch = lodash.findWhere(scope.deliveryNote.items, {itemMasterId: sampleStationItem.itemMasterId});
          expect(deliveryNoteItemMatch).toBeDefined();
        });

        it('should merge station and menu items and remove duplicates', function () {
          getCatererStationMasterItemsDeferred.resolve(getCatererStationMasterItemsResponseJSON);
          getMenuCatererStationListDeferred.resolve(getMenuCatererStationListJSON);
          scope.$digest();

          expect(scope.deliveryNote.items.length >= getCatererStationMasterItemsResponseJSON.response.length).toEqual(true);

          var testItem = {itemMasterId: 1, itemName: 'Skittles'};   // test item known to be in both catererStationMasterItems and catererStationMenuItems
          var deliveryNoteItemMatchArray = lodash.filter(scope.deliveryNote.items, {itemName: testItem.itemName});
          expect(deliveryNoteItemMatchArray.length).toEqual(1);
        });

        it('should display an error if there are no items', function() {
          getCatererStationMasterItemsDeferred.resolve(emptyItemResponse);
          getMenuCatererStationListDeferred.resolve(emptyMenuResponse);
          var alternateCatererStationId = 10;
          scope.deliveryNote.catererStationId = alternateCatererStationId;
          scope.$digest();

          expect(scope.displayError).toBeTruthy();
          expect(scope.errorCustom).toEqual([{
            field: 'Items cannot be prepopulated',
            value: 'for this LMP Station because none exist. You must add them manually with the Add Items button below.'
          }]);
        });

        it('should display an error if items return null', function () {
          var nullItemResponse = {response: []};
          var nullMenuResponse = {companyMenuCatererStations: []};

          getCatererStationMasterItemsDeferred.resolve(nullItemResponse);
          getMenuCatererStationListDeferred.resolve(nullMenuResponse);

          var alternateCatererStationId = 10;
          scope.deliveryNote.catererStationId = alternateCatererStationId;
          scope.$digest();

          expect(scope.displayError).toBeTruthy();
        });

      });

      describe('removeItemByIndex scope function', function() {
        it('should have a removeItemByIndex scope function defined', function() {
          expect(scope.removeItemByIndex).toBeDefined();
          expect(Object.prototype.toString.call(scope.removeItemByIndex)).toBe('[object Function]');
        });

        it('should remove 1 item from the deliveryNote.items array', function() {
          var curCount = scope.deliveryNote.items.length;
          var mockItem = {
            canEdit: true
          };
          scope.removeItemByIndex(0, mockItem);
          scope.$digest();
          expect(scope.deliveryNote.items.length).toBe((curCount - 1));
        });
      });

      it('should switch the state to review when review button is clicked', function() {
        scope.deliveryNote.items = [{
          deliveredQuantity: 5
        }];
        scope.toggleReview();
        expect(scope.state).toBe('review');
      });

      it('should switch the state back to edit when the cancel button is clicked', function() {
        scope.cancel();
        expect(scope.state).toBe('edit');
      });

      describe('clearFilter scope function', function() {
        it('should set all filters to empty string when called', function() {
          scope.filterInput = {};
          scope.filterInput.itemCode = 's';
          scope.filterInput.itemName = 's';
          scope.$digest();
          scope.clearFilter();
          expect(scope.filterInput.itemCode).toBeUndefined();
          expect(scope.filterInput.itemName).toBeUndefined();
        });
      });

      describe('save scope function submit delivery note', function() {
        beforeEach(function() {
          scope.save(true);
        });

        it('should call saveDeliveryNote', function() {
          expect(deliveryNoteFactory.saveDeliveryNote).toHaveBeenCalled();
        });
      });

      describe('addItems scope function', function() {
        it('should be defined as a scope', function() {
          expect(Object.prototype.toString.call(scope.addItems)).toBe('[object Function]');
        });

        it('should return undefined because the API was already called', function() {
          scope.addItems();
          expect(scope.addItems()).toBeUndefined();
        });
      });

      describe('addItem scope function', function() {
        it('should be defined as a scope', function() {
          expect(Object.prototype.toString.call(scope.addItem)).toBe('[object Function]');
        });

        it('should add an item to the delivery note items array', function() {
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

        it('should return undefined if no select master item is passed', function() {
          expect(scope.addItem(0)).toBeUndefined();
        });

        it('should return undefined if in the current delivery note items array', function() {
          scope.deliveryNote = {
            items: [{
              itemMasterId: 123
            }]
          };
          expect(scope.addItem({
            id: 123
          })).toBeUndefined();
        });
      });

      describe('canRemoveItem scope function', function() {
        it('should return false if item.canEdit is false', function() {
          expect(scope.canRemoveItem({
            canEdit: false
          })).toBe(false);
        });

        it('should return false if readOnly', function() {
          scope.readOnly = true;
          expect(scope.canRemoveItem({
            canEdit: true
          })).toBe(false);
        });
      });

      describe('formErrorClass scope function', function() {
        beforeEach(function() {
          scope.form = [];
          scope.form['Mock Field'] = {
            $dirty: true,
            $valid: false
          };
          scope.form['Mock Field 2'] = {
            $dirty: false,
            $valid: false
          };
          scope.form['Mock Field 3'] = {
            $dirty: true,
            $valid: true
          };
          scope.displayError = true;
          scope.$digest();
        });

        it('should return empty string if the form does not contain that field', function() {
          expect(scope.formErrorClass('foobars', true)).toBe('');
        });

        it('should return has-error field is dirty and not valid', function() {
          expect(scope.formErrorClass('Mock Field', true)).toBe('has-error');
        });

        it('should return has-error field is not dirty and not valid but show form errors', function() {
          expect(scope.formErrorClass('Mock Field 2', true)).toBe('has-error');
        });

        it('should return empty string field is dirty and valid', function() {
          expect(scope.formErrorClass('Mock Field 3', true)).toBe('');
        });
      });

      describe('calculateBooked scope function', function() {
        it('should return 7', function() {
          expect(scope.calculateBooked({
            deliveredQuantity: 10,
            ullageQuantity: 3
          })).toBe(7);
        });
      });

      describe('removeNewItemRow scope functions', function() {
        it('should remove 1 item from netItems array', function() {
          var ar = [1, 2, 3, 4];
          scope.newItems = ar;
          scope.removeNewItemRow(0);
          expect(scope.newItems.length).toBe(3);
        });
      });

      describe('ullageQuantityChanged scope function', function() {
        it('should return undefined if there is a ullageQuantity set', function() {
          expect(scope.ullageQuantityChanged({
            ullageQuantity: 2
          })).toBeUndefined();
        });

        it('should set ullageReason to null if no ullageQuantity', function() {
          var item = {
            ullageQuantity: null,
            ullageReason: 3
          };
          scope.ullageQuantityChanged(item);
          expect(item.ullageReason).toBeNull();
        });
      });

      describe('showSaveButton scope function', function() {
        it('should return true if state is review', function() {
          scope.state = 'review';
          expect(scope.showSaveButton()).toBe(true);
        });

        it('should return false if state is not review', function() {
          scope.state = 'create';
          expect(scope.showSaveButton()).toBe(false);
        });
      });

      describe('hideCreatedByMeta scope function', function() {
        it('should return true if state is review', function() {
          scope.state = 'review';
          expect(scope.hideCreatedByMeta()).toBe(true);
        });

        it('should return true if state is create', function() {
          scope.state = 'create';
          expect(scope.hideCreatedByMeta()).toBe(true);
        });

        it('should return false if state is not review or create', function() {
          scope.state = 'edit';
          expect(scope.hideCreatedByMeta()).toBe(false);
        });
      });

      describe('canEditItem scope function', function() {
        it('should return true if canEdit and state is not review', function() {
          scope.state = 'create';
          expect(scope.canEditItem({
            canEdit: true
          })).toBe(true);
        });

        it('should return false if canEdit is false', function() {
          scope.state = 'create';
          expect(scope.canEditItem({
            canEdit: false
          })).toBe(false);
        });

        it('should return false if state is review', function() {
          scope.state = 'review';
          expect(scope.canEditItem({
            canEdit: true
          })).toBe(false);
        });
      });

      describe('showFilterByForm scope function', function() {
        it('should return false if state is review', function() {
          scope.state = 'review';
          expect(scope.showFilterByForm()).toBe(false);
        });

        it('should return false if deliveryNote is undefined', function() {
          scope.state = 'create';
          scope.deliveryNote = undefined;
          expect(scope.showFilterByForm()).toBe(false);
        });

        it('should return false if no deliveryNote items', function() {
          scope.state = 'create';
          scope.deliveryNote = {};
          expect(scope.showFilterByForm()).toBe(false);
        });

        it('should return false if no deliveryNote items array items', function() {
          scope.state = 'create';
          scope.deliveryNote = {
            items: []
          };
          expect(scope.showFilterByForm()).toBe(false);
        });

        it('should return true if deliveryNote has items', function() {
          scope.state = 'create';
          scope.deliveryNote = {
            items: [{
              id: 1
            }]
          };
          expect(scope.showFilterByForm()).toBe(true);
        });
      });

      describe('ullageReasonDisabled scope function', function() {
        it('should return true is readOnly', function() {
          scope.readOnly = true;
          expect(scope.ullageReasonDisabled({})).toBe(true);
        });

        it('should return true if no ullageQuantity', function() {
          scope.readOnly = false;
          expect(scope.ullageReasonDisabled({})).toBe(true);
        });

        it('should return false if not readyonly and ullageQuantity set', function() {
          scope.readOnly = false;
          expect(scope.ullageReasonDisabled({
            ullageQuantity: 5
          })).toBe(false);
        });
      });

      describe('cancel scope function if has prevState', function() {
        it('should return', function() {
          scope.prevState = 'edit';
          expect(scope.cancel()).toBeUndefined();
        });
      });

      describe('canReview scope function extras', function() {
        it('should return if !canReview and prevState', function() {
          scope.state = 'review';
          expect(scope.toggleReview()).toBeUndefined();
        });

        it('should return if form is not valid', function() {
          scope.state = 'edit';
          scope.displayError = false;
          scope.form = {
            $valid: false
          };
          scope.deliveryNote = {
            items: [{
              deliveredQuantity: 1
            }]
          };
          expect(scope.toggleReview()).toBeUndefined();
        });

        it('should return if deliveryNote is undefined', function() {
          scope.state = 'edit';
          scope.displayError = false;
          scope.form = {
            $valid: true
          };
          scope.deliveryNote = undefined;
          expect(scope.toggleReview()).toBeUndefined();
        });

        it('should return if deliveryNote is already accepted', function() {
          scope.state = 'edit';
          scope.displayError = false;
          scope.form = {
            $valid: true
          };
          scope.deliveryNote = {
            isAccepted: true
          };
          expect(scope.toggleReview()).toBeUndefined();
        });

        it('should return if deliveryNote has not items', function() {
          scope.state = 'edit';
          scope.displayError = false;
          scope.form = {
            $valid: true
          };
          scope.deliveryNote = {};
          expect(scope.toggleReview()).toBeUndefined();
        });
      });
    });
  });
});
