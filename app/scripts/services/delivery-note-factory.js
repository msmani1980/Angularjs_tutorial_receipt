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
                                            companyReasonCodesService, itemsService, stockManagementStationItemsService) {

    function getDeliveryNote(deliveryNoteId) {
      return deliveryNotesService.getDeliveryNote(deliveryNoteId);
    }

    function getCatererStationList(){
      return catererStationService.getCatererStationList({limit:null});
    }

    function getItemsByCateringStationId(_catererStationId){
      return stockManagementStationItemsService.getStockManagementStationItems(_catererStationId);
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
      getItemsByCateringStationId: getItemsByCateringStationId,
      getCompanyReasonCodes: getCompanyReasonCodes,
      getAllMasterItems: getAllMasterItems,
      createDeliveryNote: createDeliveryNote,
      saveDeliveryNote: saveDeliveryNote,
      deleteDeliveryNote: deleteDeliveryNote
    };

  });
