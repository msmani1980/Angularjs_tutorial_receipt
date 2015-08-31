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
                                             schedulesService, carrierService,
                                             GlobalMenuService) {

    function getCompanyId(){
      return GlobalMenuService.company.get();
    }

    function getCatererStationList(){
      return catererStationService.getCatererStationList({limit:null});
    }

    function getSchedules(companyId){
      return schedulesService.getSchedules(companyId);
    }

    function getCarrierNumbers(companyId){
      return carrierService.getCarrierNumbers(companyId);
    }

    return {
      getCompanyId: getCompanyId,
      getCatererStationList: getCatererStationList,
      getSchedules: getSchedules,
      getCarrierNumbers: getCarrierNumbers
    };

  });
