'use strict';

/**
 * @ngdoc service
 * @name ts5App.deliveryNoteFactory
 * @description
 * # deliveryNoteFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('deliveryNoteFactory', function (deliveryNotesService, catererStationService,
                                            GlobalMenuService, menuCatererStationsService, itemsService,
                                            companyReasonCodesService) {

    function getCompanyId() {
      return GlobalMenuService.company.get();
    }

    function getDeliveryNote(deliveryNoteId) {
      return deliveryNotesService.getDeliveryNote(deliveryNoteId);
    }

    function getCatererStationList(){
      return catererStationService.getCatererStationList({limit:null});
    }

    function getCompanyMenuCatererStations() {
      return menuCatererStationsService.getRelationshipList({limit:null});
    }

    function getItemsByCateringStationId(_catererStationId){
      return itemsService.getItemsByCateringStationId(_catererStationId);
    }

    function getCompanyReasonCodes(){
      return companyReasonCodesService.getAll();
    }

    function getAllMasterItems(){
      return itemsService.getItemsList({}, true);
    }

    function createDeliveryNote(payload){
      return deliveryNotesService.createDeliveryNote(payload);
    }

    function saveDeliveryNote(payload){
      return deliveryNotesService.saveDeliveryNote(payload);
    }

    return {
      getDeliveryNote: getDeliveryNote,
      getCatererStationList: getCatererStationList,
      getCompanyId: getCompanyId,
      getCompanyMenuCatererStations: getCompanyMenuCatererStations,
      getItemsByCateringStationId: getItemsByCateringStationId,
      getCompanyReasonCodes: getCompanyReasonCodes,
      getAllMasterItems: getAllMasterItems,
      createDeliveryNote: createDeliveryNote,
      saveDeliveryNote: saveDeliveryNote
    };

  });
