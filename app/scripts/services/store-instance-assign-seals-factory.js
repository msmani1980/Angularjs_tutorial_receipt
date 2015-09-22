'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceAssignSealsFactory
 * @description
 * # storeInstanceAssignSealsFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceAssignSealsFactory', function (sealColorsService, sealTypesService,
                                                        storeInstanceSealService) {
    function getStoreInstanceSeals(id){
      return storeInstanceSealService.getStoreInstanceSeals(id);
    }

    function getSealColors(){
      return sealColorsService.getSealColors();
    }

    function getSealTypes(){
      return sealTypesService.getSealTypes();
    }

    function updateStoreInstanceSeal(sealId, storeInstanceId, payload){
      return storeInstanceSealService.updateStoreInstanceSeal(sealId, storeInstanceId, payload);
    }

    function createStoreInstanceSeal(storeInstanceId, payload){
      return storeInstanceSealService.createStoreInstanceSeal(storeInstanceId, payload);
    }

    function deleteStoreInstanceSeal(sealId,storeInstanceId){
      return storeInstanceSealService.deleteStoreInstanceSeal(sealId,storeInstanceId);
    }

    return {
      getStoreInstanceSeals: getStoreInstanceSeals,
      getSealColors: getSealColors,
      getSealTypes: getSealTypes,
      updateStoreInstanceSeal: updateStoreInstanceSeal,
      createStoreInstanceSeal: createStoreInstanceSeal,
      deleteStoreInstanceSeal: deleteStoreInstanceSeal
    };

  });
