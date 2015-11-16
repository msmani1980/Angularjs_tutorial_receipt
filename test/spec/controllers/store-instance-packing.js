'use strict';

describe('Controller: StoreInstancePackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance-menu-items.json'));
  beforeEach(module('served/store-instance-details.json'));
  beforeEach(module('served/store-instance-item-list.json'));
  beforeEach(module('served/master-item-list.json'));
  beforeEach(module('served/store-status-response.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/characteristics.json'));
  beforeEach(module('served/company-reason-codes.json'));
  beforeEach(module('served/count-types.json'));
  beforeEach(module('served/features.json'));
  beforeEach(module('served/threshold-list.json'));


  var StoreInstancePackingCtrl;
  var scope;
  var storeInstanceFactory;
  var getUpdatedStoreStatusDeferred;
  var servedStoreStatusJSON;
  var getStoreDetailsDeferred;
  var servedStoreInstanceDetailsJSON;
  var getStoreInstanceMenuItemsDeferred;
  var servedStoreInstanceMenuItemsJSON;
  var getStoreInstanceItemsDeferred;
  var servedStoreInstanceItemsJSON;
  var getMasterItemsDeferred;
  var servedMasterItemsJSON;
  var getItemTypesDeferred;
  var servedItemTypesJSON;
  var getCharacteristicsDeferred;
  var servedCharacteristicsJSON;
  var getCountTypesDeferred;
  var servedCountTypesJSON;
  var getCompanyReasonCodesDeferred;
  var servedCompanyReasonCodesJSON;
  var getFeaturesDeferred;
  var getFeaturesJSON;
  var getThresholdDeferred;
  var getThresholdJSON;
  var dateUtility;
  var storeId;
  var controller;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStoreInstanceMenuItems_, _servedStoreInstanceItemList_, _servedMasterItemList_,
                     _servedStoreInstanceDetails_, _servedStoreStatusResponse_, _servedCharacteristics_,
                     _servedItemTypes_, _servedCompanyReasonCodes_, _servedCountTypes_, _servedFeatures_, _servedThresholdList_) {
      servedStoreInstanceMenuItemsJSON = _servedStoreInstanceMenuItems_;
      servedStoreInstanceItemsJSON = _servedStoreInstanceItemList_;
      servedMasterItemsJSON = _servedMasterItemList_;
      servedStoreInstanceDetailsJSON = _servedStoreInstanceDetails_;
      servedStoreStatusJSON = _servedStoreStatusResponse_;
      servedItemTypesJSON = _servedItemTypes_;
      servedCharacteristicsJSON = _servedCharacteristics_;
      servedCountTypesJSON = _servedCountTypes_;
      servedCompanyReasonCodesJSON = _servedCompanyReasonCodes_;
      getFeaturesJSON = _servedFeatures_;
      getThresholdJSON = _servedThresholdList_;
    });
    storeId = 5;
    scope = $rootScope.$new();
    controller = $controller;

    storeInstanceFactory = $injector.get('storeInstanceFactory');

    getUpdatedStoreStatusDeferred = $q.defer();
    getUpdatedStoreStatusDeferred.resolve(servedStoreStatusJSON);

    getStoreDetailsDeferred = $q.defer();

    getStoreInstanceMenuItemsDeferred = $q.defer();
    getStoreInstanceMenuItemsDeferred.resolve(servedStoreInstanceMenuItemsJSON);

    getStoreInstanceItemsDeferred = $q.defer();
    getStoreInstanceItemsDeferred.resolve(servedStoreInstanceItemsJSON);

    getMasterItemsDeferred = $q.defer();
    getMasterItemsDeferred.resolve(servedMasterItemsJSON);

    getItemTypesDeferred = $q.defer();
    getItemTypesDeferred.resolve(servedItemTypesJSON);

    getCharacteristicsDeferred = $q.defer();
    getCharacteristicsDeferred.resolve(servedCharacteristicsJSON);

    getCountTypesDeferred = $q.defer();
    getCountTypesDeferred.resolve(servedCountTypesJSON);

    getCompanyReasonCodesDeferred = $q.defer();
    getCompanyReasonCodesDeferred.resolve(servedCompanyReasonCodesJSON);

    getFeaturesDeferred = $q.defer();
    getFeaturesDeferred.resolve(getFeaturesJSON);

    getThresholdDeferred = $q.defer();
    getThresholdDeferred.resolve(getThresholdJSON);

    dateUtility = $injector.get('dateUtility');

    spyOn(storeInstanceFactory, 'getStoreDetails').and.returnValue(getStoreDetailsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceMenuItems').and.returnValue(getStoreInstanceMenuItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getStoreInstanceItemList').and.returnValue(getStoreInstanceItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemsMasterList').and.returnValue(getMasterItemsDeferred.promise);
    spyOn(storeInstanceFactory, 'updateStoreInstanceStatus').and.returnValue(getUpdatedStoreStatusDeferred.promise);
    spyOn(storeInstanceFactory, 'getItemTypes').and.returnValue(getItemTypesDeferred.promise);
    spyOn(storeInstanceFactory, 'getCharacteristics').and.returnValue(getCharacteristicsDeferred.promise);
    spyOn(storeInstanceFactory, 'getCountTypes').and.returnValue(getCountTypesDeferred.promise);
    spyOn(storeInstanceFactory, 'getReasonCodeList').and.returnValue(getCompanyReasonCodesDeferred.promise);
    spyOn(storeInstanceFactory, 'getFeaturesList').and.returnValue(getFeaturesDeferred.promise);
    spyOn(storeInstanceFactory, 'getThresholdList').and.returnValue(getThresholdDeferred.promise);

  }));

  function initController(action) {
    StoreInstancePackingCtrl = controller('StoreInstancePackingCtrl', {
      $scope: scope,
      $routeParams: {
        storeId: storeId,
        action: ( action ? action : 'dispatch')
      }
    });
  }

  describe('initialization API calls', function () {

    describe('API calls for all processes', function () {
      beforeEach(function () {
        initController();
        getStoreDetailsDeferred.resolve(servedStoreInstanceDetailsJSON);
        scope.$digest();
      });
    });

    describe('API calls for redispatch', function () {

    });

    describe('during the dispatch process', function () {



    });
  });

  describe('merging pick list items', function () {

  });

  describe('merging offload items', function () {

  });

  describe('merging all redispatch items', function () {

  });



});
