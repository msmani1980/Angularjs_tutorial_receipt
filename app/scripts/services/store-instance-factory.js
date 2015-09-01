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
                                             GlobalMenuService, menuMasterService,
                                             storesService) {

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

    function getStoreInstancesList(query){
      return storeInstanceService.getStoreInstancesList(query);
    }

    function getStoreInstance(id){
      return storeInstanceService.getStoreInstance(id);
    }

    function createStoreInstance(payload){
      return storeInstanceService.createStoreInstance(payload);
    }

    function updateStoreInstance(id, payload){
      return storeInstanceService.updateStoreInstance(id, payload);
    }

    function deleteStoreInstance(id){
      return storeInstanceService.deleteStoreInstance(id);
    }

    function getMenuMasterList(){
      return menuMasterService.getMenuMasterList();
    }

    function getStoresList(){
      return storesService.getStoresList();
    }

    return {
      getCompanyId: getCompanyId,
      getCatererStationList: getCatererStationList,
      getSchedules: getSchedules,
      getCarrierNumbers: getCarrierNumbers,
      getStoreInstancesList: getStoreInstancesList,
      getStoreInstance: getStoreInstance,
      createStoreInstance: createStoreInstance,
      updateStoreInstance: updateStoreInstance,
      deleteStoreInstance: deleteStoreInstance,
      getMenuMasterList: getMenuMasterList,
      getStoresList: getStoresList
    };

  });
