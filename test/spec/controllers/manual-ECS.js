'use strict';

fdescribe('Controller: ManualECSCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/carrier-instance-list.json'));

  var ManualECSCtrl;
  var manualECSFactory;
  var cateringStationsResponseJSON;
  var cateringStationsDeferred;
  var companyStationsResponseJSON;
  var companyStationsDeferred;
  var storeInstancesResponseJSON;
  var storeInstancesDeferred;
  var carrierInstancesResponseJSON;
  var carrierInstancesDeferred;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {

    inject(function (_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedCarrierInstanceList_) {
      cateringStationsResponseJSON = _servedCateringStations_;
      companyStationsResponseJSON = _servedStations_;
      storeInstancesResponseJSON = _servedStoreInstanceList_;
      carrierInstancesResponseJSON = _servedCarrierInstanceList_;
    });

    manualECSFactory = $injector.get('manualECSFactory');
    scope = $rootScope.$new();

    cateringStationsDeferred = $q.defer();
    cateringStationsDeferred.resolve(cateringStationsResponseJSON);
    companyStationsDeferred = $q.defer();
    companyStationsDeferred.resolve(companyStationsResponseJSON);
    storeInstancesDeferred = $q.defer();
    storeInstancesDeferred.resolve(storeInstancesResponseJSON);
    carrierInstancesDeferred = $q.defer();
    carrierInstancesDeferred.resolve(carrierInstancesResponseJSON);

    spyOn(manualECSFactory, 'getCatererStationList').and.returnValue(cateringStationsDeferred.promise);
    spyOn(manualECSFactory, 'getCompanyStationList').and.returnValue(companyStationsDeferred.promise);
    spyOn(manualECSFactory, 'getStoreInstanceList').and.returnValue(storeInstancesDeferred.promise);
    spyOn(manualECSFactory, 'getCarrierInstanceList').and.returnValue(carrierInstancesDeferred.promise);
    spyOn(manualECSFactory, 'updateCarrierInstance').and.returnValue(carrierInstancesDeferred.promise);

    ManualECSCtrl = $controller('ManualECSCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should get caterer stations', function () {

    });

    it('should get company stations', function () {

    });

    it('should attach caterer stations to scope and format dates', function () {

    });

    it('should attach caterer stations to scope and format station description', function () {

    });

    it('should attach company stations to scope and format dates', function () {

    });

    it('should attach company stations to scope and format station description', function () {

    });

    it('should default view to create ECS view', function () {

    });
  });

  describe('search', function () {
    describe('portal instances search', function () {
      it('should format search payload to resolve station and format date', function () {

      });

      it('should get list of store instances from API', function () {

      });

      it('should format result dates and attach to scope', function () {

      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {

        });
      });
    });

    describe('epos carrier instances search', function () {
      it('should format search payload to resolve station and format date', function () {

      });

      it('should get list of store instances from API', function () {

      });

      it('should format result dates and attach to scope', function () {

      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {

        });
      });
    });

    describe('all instances search', function () {
      it('should format search payload to resolve station and format date', function () {

      });

      it('should get list of store instances from API', function () {

      });

      it('should format result dates and attach to scope', function () {

      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {

        });
      });
    });
  });

  describe('Create Relationship', function () {
    it('should call API with epos instance id and store instance id', function () {

    });

    it('should clear models after successful create', function () {

    });

    it('should not allow saving if a portal and epos record are not selected', function () {

    });

    describe('select record helpers', function () {
      it('should attach selected records to scope', function () {

      });

      it('isRecordSelected should return true for records matching selected record on scope', function () {

      });
    });
  });

  describe('View Helpers', function () {
    describe('toggle views', function () {

    });

    describe('get class for attribute', function () {

    });

    describe('reset all', function () {

    });
  });

  describe('No Records / Search prompts', function () {
    describe('should show no record alert', function () {

    });
  });


});
