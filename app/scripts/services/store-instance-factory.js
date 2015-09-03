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

    function getCarrierNumbers(companyId,carrierTypeId){
      return carrierService.getCarrierNumbers(companyId,carrierTypeId);
    }

    function getAllCarrierNumbers(companyId){
      return getCarrierNumbers(companyId,0);
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

    function getStoreInstanceMenuItems(id){
      return storeInstanceService.getStoreInstanceMenuItems(id);
    }

    function getStoreInstanceItemList(id){
      return storeInstanceService.getStoreInstanceItemList(id);
    }

    function getStoreInstanceItem(id, itemId){
      return storeInstanceService.getStoreInstanceItem(id, itemId);
    }

    function createStoreInstanceItem(id, payload){
      return storeInstanceService.createStoreInstanceItem(id, payload);
    }

    function updateStoreInstanceItem(id, itemId,payload){
      return storeInstanceService.updateStoreInstanceItem(id, itemId, payload);
    }

    function deleteStoreInstanceItem(id, itemId){
      return storeInstanceService.deleteStoreInstanceItem(id, itemId);
    }

    function getMenuMasterList(){
      return menuMasterService.getMenuMasterList();
    }

    function getStoresList(query){
      return storesService.getStoresList(query);
    }

    return {
      getCompanyId: getCompanyId,
      getCatererStationList: getCatererStationList,
      getSchedules: getSchedules,
      getCarrierNumbers: getCarrierNumbers,
      getAllCarrierNumbers: getAllCarrierNumbers,
      getStoreInstancesList: getStoreInstancesList,
      getStoreInstance: getStoreInstance,
      createStoreInstance: createStoreInstance,
      updateStoreInstance: updateStoreInstance,
      deleteStoreInstance: deleteStoreInstance,
      getStoreInstanceMenuItems: getStoreInstanceMenuItems,
      getStoreInstanceItemList: getStoreInstanceItemList,
      getStoreInstanceItem: getStoreInstanceItem,
      createStoreInstanceItem: createStoreInstanceItem,
      updateStoreInstanceItem: updateStoreInstanceItem,
      deleteStoreInstanceItem: deleteStoreInstanceItem,
      getMenuMasterList: getMenuMasterList,
      getStoresList: getStoresList
    };

  });
