'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceReviewFactory
 * @description
 * # storeInstanceReviewFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceReviewFactory', function (storeInstanceSealService, sealColorsService,
                                                   sealTypesService) {
    function getStoreInstanceSeals(id){
      return storeInstanceSealService.getStoreInstanceSeals(id);
    }

    function getSealColors(){
      return sealColorsService.getSealColors();
    }

    function getSealTypes(){
      return sealTypesService.getSealTypes();
    }

    return {
      getStoreInstanceSeals: getStoreInstanceSeals,
      getSealColors: getSealColors,
      getSealTypes: getSealTypes
    };
  });
