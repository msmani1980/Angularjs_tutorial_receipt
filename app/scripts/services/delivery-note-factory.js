'use strict';

/**
 * @ngdoc service
 * @name ts5App.deliveryNoteFactory
 * @description
 * # deliveryNoteFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('deliveryNoteFactory', function(deliveryNotesService, catererStationService,
    companyReasonCodesService, itemsService, stockManagementStationItemsService, recordsService) {

    function getDeliveryNote(deliveryNoteId) {
      return deliveryNotesService.getDeliveryNote(deliveryNoteId);
    }

    function getCatererStationList() {
      return catererStationService.getCatererStationList({
        limit: null
      });
    }

    function getItemsByCateringStationId(_catererStationId) {
      return stockManagementStationItemsService.getStockManagementStationItems(_catererStationId);
    }

    function getCompanyReasonCodes() {
      return companyReasonCodesService.getAll();
    }

    function getMasterItems(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function createDeliveryNote(payload) {
      return deliveryNotesService.createDeliveryNote(payload);
    }

    function saveDeliveryNote(payload) {
      return deliveryNotesService.saveDeliveryNote(payload);
    }

    function deleteDeliveryNote(deliveryNoteId) {
      return deliveryNotesService.deleteDeliveryNote(deliveryNoteId);
    }

    function getDeliveryNotesList(query) {
      return deliveryNotesService.getDeliveryNotesList(query);
    }

    function getItemTypes() {
      return recordsService.getItemTypes();
    }

    function getCharacteristics() {
      return recordsService.getCharacteristics();
    }

    return {
      getDeliveryNotesList: getDeliveryNotesList,
      getDeliveryNote: getDeliveryNote,
      getCatererStationList: getCatererStationList,
      getItemsByCateringStationId: getItemsByCateringStationId,
      getCompanyReasonCodes: getCompanyReasonCodes,
      getMasterItems: getMasterItems,
      createDeliveryNote: createDeliveryNote,
      saveDeliveryNote: saveDeliveryNote,
      deleteDeliveryNote: deleteDeliveryNote,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics
    };

  });
