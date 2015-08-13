'use strict';

// testing controller
describe('Managed Goods Received', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json','served/delivery-notes-list.json'));

  var ManageGoodsReceivedCtrl,
    $scope,
    deliveryNoteFactory,
    catererStationService,
    deliveryNotesService,
    deliveryNotesJSON,
    getDeliveryNotesListDeferred,
    getCatererStationListDeferred,
    stationsListJSON,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _deliveryNoteFactory_,$injector) {
    inject(function (_servedDeliveryNotesList_, _servedCateringStations_) {
      deliveryNotesJSON = _servedDeliveryNotesList_;
      stationsListJSON = _servedCateringStations_;
    });

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();
    deliveryNoteFactory = $injector.get('deliveryNoteFactory');
    deliveryNotesService = $injector.get('deliveryNotesService');
    catererStationService = $injector.get('catererStationService');

    getDeliveryNotesListDeferred = $q.defer();
    getDeliveryNotesListDeferred.resolve(deliveryNotesJSON);
    deliveryNoteFactory = _deliveryNoteFactory_;
    spyOn(deliveryNotesService, 'getDeliveryNotesList').and.returnValue(
      getDeliveryNotesListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(stationsListJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    spyOn(deliveryNotesService, 'deleteDeliveryNote').and.returnValue({
      then: function (callBack) {
        return callBack();
      }
    });

    ManageGoodsReceivedCtrl = $controller('ManageGoodsReceivedCtrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('the controller methods', function() {

    it('should have a init method', function () {
      expect(ManageGoodsReceivedCtrl.init).toBeDefined();
    });

    it('should have a getCatererStationList method', function () {
      expect(ManageGoodsReceivedCtrl.getCatererStationList).toBeDefined();
    });

    it('should have a getDeliveryNotesList method', function () {
      expect(ManageGoodsReceivedCtrl.getDeliveryNotesList).toBeDefined();
    });

    it('should have a generateDeliveryNoteQuery method', function () {
      expect(ManageGoodsReceivedCtrl.generateDeliveryNoteQuery).toBeDefined();
    });

  });

  describe('when the controller loads', function() {

    it('should have a stationsList attached to the scope', function () {
      expect($scope.stationsList).toBeDefined();
    });

    it('should have an empty stations list before the scope is digested', function () {
      expect($scope.stationsList).toEqual([]);
    });

    describe('The stationsList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stations in the stationsList', function () {
        expect($scope.stationsList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.stationsList).toEqual(stationsListJSON.response);
      });

      describe('contains an station object which', function () {
        var station;
        beforeEach(function () {
          station = $scope.stationsList[0];
        });

        it('should be defined', function () {
          expect(station).toBeDefined();
        });

        it('should have an id property and is a string', function () {
          expect(station.id).toBeDefined();
          expect(station.id).toEqual(jasmine.any(Number));
        });

        it('should have an stationCode property and is a string', function () {
          expect(station.code).toBeDefined();
          expect(station.code).toEqual(jasmine.any(String));
        });

      });

    });

  });

  describe('when a user selects a station', function() {

    it('should have a deliveryNotesList attached to the scope', function () {
      expect($scope.deliveryNotesList).toBeDefined();
    });

    it('should have an empty deliveryt notes list before the scope is digested', function () {
      expect($scope.deliveryNotesList).toEqual([]);
    });

    describe('The deliveryNotesList array', function () {

      beforeEach(function() {
        spyOn(ManageGoodsReceivedCtrl,'formatDeliveryNotesDates').and.callThrough();
        $scope.catererStationId = 3;
        $scope.$digest();
      });

      it('should have (1) or more stations in the deliveryNotesList', function () {
        expect($scope.deliveryNotesList.length).toBeGreaterThan(0);
      });

      it('should be match the deliveryNotes list from the delivertNotes API Respone',function () {
        expect($scope.deliveryNotesList).toEqual(deliveryNotesJSON.response);
      });

      describe('contains an delivery note object which', function () {
        var deliveryNote;
        beforeEach(function () {
          deliveryNote = $scope.deliveryNotesList[0];
        });

        it('should be defined', function () {
          expect(deliveryNote).toBeDefined();
        });

        it('should have an id property and is a string', function () {
          expect(deliveryNote.id).toBeDefined();
          expect(deliveryNote.id).toEqual(jasmine.any(Number));
        });

        it('should have an deliveryNoteNumber property and is a string', function () {
          expect(deliveryNote.deliveryNoteNumber).toBeDefined();
          expect(deliveryNote.deliveryNoteNumber).toEqual(jasmine.any(String));
        });

        it('should have an purchaseOrderNumber property and is a string', function () {
          expect(deliveryNote.purchaseOrderNumber).toBeDefined();
          expect(deliveryNote.purchaseOrderNumber).toEqual(jasmine.any(String));
        });

        it('should have an deliveryDate property and is a string', function () {
          expect(deliveryNote.deliveryDate).toBeDefined();
          expect(deliveryNote.deliveryDate).toEqual(jasmine.any(String));
        });

        describe('formatting the dates of the delivery note', function() {

          it('should have been called when the delivery notes list is received', function () {
            expect(ManageGoodsReceivedCtrl.formatDeliveryNotesDates).toHaveBeenCalled();
          });

          it('should remove the decimal from the end of the updatedOn date', function () {
            var control = '2015-08-11 20:36:42.412513';
            var formattedControl = '2015-08-11 20:36:42';
            expect(deliveryNote.updatedOn).not.toEqual(control);
            expect(deliveryNote.updatedOn).toEqual(formattedControl);
          });

        });

      });

    });

  });

  describe('remove delivery note functionality', function () {

    beforeEach(function() {
      $scope.catererStationId = 3;
      $scope.$digest();
    });

    it('should have a removeRecord() method attached to the scope',
      function () {
        expect($scope.removeRecord).toBeDefined();
      });

    it('should remove the record from the deliveryNotesList', function () {
      var length = $scope.deliveryNotesList.length;
      $scope.removeRecord(50);
      expect($scope.deliveryNotesList.length).toEqual(length - 1);
    });

  });

  describe('clear filter functionality', function () {
    beforeEach(function () {
      $scope.$digest();
    });
    it(
      'should have a clearSearchFilters() method attached to the scope',
      function () {
        expect($scope.clearSearchFilters).toBeDefined();
      });

    it('should clear the search ng-model when called', function () {
      $scope.search = {
        deliveryNoteNumber: 'VB001'
      };
      $scope.clearSearchFilters();
      expect($scope.search).toEqual({});
    });

    it('should clear the dateRange ng-model when called', function () {
      $scope.dateRange.deliveryStartDate = '07-15-2015';
      $scope.dateRange.deliveryEndDate = '08-15-2015';
      $scope.clearSearchFilters();
      expect($scope.dateRange).toEqual({
        deliveryStartDate: '',
        deliveryEndDate: ''
      });
    });

  });

  describe('searchRecords', function () {

    beforeEach(function () {
      spyOn(ManageGoodsReceivedCtrl, 'displayLoadingModal');
      spyOn(ManageGoodsReceivedCtrl, 'getDeliveryNotesList');
      $scope.$digest();
    });

    it('should be defined', function () {
      expect($scope.searchRecords).toBeDefined();
    });

    it('should call getDeliveryNotesList', function () {
      $scope.searchRecords();
      expect(ManageGoodsReceivedCtrl.getDeliveryNotesList).toHaveBeenCalled();
    });

    it('should call displayLoadingModal', function () {
      $scope.searchRecords();
      expect(ManageGoodsReceivedCtrl.displayLoadingModal).toHaveBeenCalled();
    });

    describe('setting the date filters', function() {

      beforeEach(function() {
        $scope.dateRange = {
          deliveryStartDate: '08/12/2015',
          deliveryEndDate: '08/13/2015'
        };
        $scope.$digest();
      });

      it('should set the start and end dates in the query', function(){
        var query = ManageGoodsReceivedCtrl.generateDeliveryNoteQuery();
        expect(query.deliveryStartDate).toBeDefined();
        expect(query.deliveryEndDate).toBeDefined();
      });

      it('should format the start and end dates in the query', function(){
        var query = ManageGoodsReceivedCtrl.generateDeliveryNoteQuery();
        expect(query.deliveryStartDate).toEqual('20150812');
        expect(query.deliveryEndDate).toEqual('20150813');
      });

    });

  });

});
