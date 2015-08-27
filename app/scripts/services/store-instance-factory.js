'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceFactory', function (storeInstanceService, catererStationService,
                                             schedulesService, carrierService) {

    function getCatererStationList(){
      return catererStationService.getCatererStationList({limit:null});
    }

    return {
      getCatererStationList: getCatererStationList
    };

  });
