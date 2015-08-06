'use strict';

/**
 * @ngdoc service
 * @name ts5App.deliveryNoteFactory
 * @description
 * # deliveryNoteFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('deliveryNoteFactory', function (deliveryNotesService, catererStationService, GlobalMenuService, menuCatererStationsService, itemsService) {

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

    function getMasterRetailItems(_catererStationId){
      return itemsService.getItemsList({catererStationId:_catererStationId}, true);
    }

    return {
      getDeliveryNote: getDeliveryNote,
      getCatererStationList: getCatererStationList,
      getCompanyId: getCompanyId,
      getCompanyMenuCatererStations: getCompanyMenuCatererStations,
      getMasterRetailItems: getMasterRetailItems
    };

  });
