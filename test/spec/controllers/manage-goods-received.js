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

    it('should have a parseDate method', function () {
      expect(ManageGoodsReceivedCtrl.parseDate).toBeDefined();
    });

    it('should have a generateDeliveryNoteQuery method', function () {
      expect(ManageGoodsReceivedCtrl.generateDeliveryNoteQuery).toBeDefined();
    });

    it('should have a isDeliveryNoteActive method', function () {
      expect($scope.isDeliveryNoteActive).toBeDefined();
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

});
