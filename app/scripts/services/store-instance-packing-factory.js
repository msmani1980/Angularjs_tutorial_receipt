'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstancePackingFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstancePackingFactory',
  function(storeInstanceService, catererStationService, schedulesService, carrierService, GlobalMenuService, menuMasterService,
           storesService, stationsService, itemsService, companyReasonCodesService, recordsService,
           featureThresholdsService, $q, lodash, dateUtility) {

    return {
      getMenuMasterList: getMenuMasterList,
      getStoresList: getStoresList,
      getStore: getStore,
      getStoreDetails: getStoreDetails,
      getStoreStatusList: getStoreStatusList,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics,
      getReasonCodeList: getReasonCodeList,
      getCountTypes: getCountTypes,
      getThresholdList: getThresholdList,
      getFeaturesList: getFeaturesList
    };

  });
