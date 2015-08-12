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

    function getMasterItemsByCatererStationId(_catererStationId){
      return itemsService.getItemsList({catererStationId:_catererStationId}, true);
    }

    function getCompanyReasonCodes(){
      return companyReasonCodesService.getAll();
    }

    function getAllMasterItems(){
      return itemsService.getItemsList({}, true);
    }

    function createDeliveryNote(payload){
      payload.isAccepted = false;
      return deliveryNotesService.createDeliveryNote(payload);
    }

    function saveDeliveryNote(payload){
      return deliveryNotesService.saveDeliveryNote(payload);
    }

    function deleteDeliveryNote(deliveryNoteId) {
      return deliveryNotesService.deleteDeliveryNote(deliveryNoteId);
    }

    function getDeliveryNotesList(query) {
      return deliveryNotesService.getDeliveryNotesList(query);
    }

    return {
      getDeliveryNotesList: getDeliveryNotesList,
      getDeliveryNote: getDeliveryNote,
      getCatererStationList: getCatererStationList,
      getCompanyId: getCompanyId,
      getCompanyMenuCatererStations: getCompanyMenuCatererStations,
      getMasterItemsByCatererStationId: getMasterItemsByCatererStationId,
      getCompanyReasonCodes: getCompanyReasonCodes,
      getAllMasterItems: getAllMasterItems,
      createDeliveryNote: createDeliveryNote,
      saveDeliveryNote: saveDeliveryNote,
      deleteDeliveryNote: deleteDeliveryNote
    };

  });
