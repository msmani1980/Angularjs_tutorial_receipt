'use strict';

/**
 * @ngdoc service
 * @name ts5App.deliveryNoteFactory
 * @description
 * # deliveryNoteFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('deliveryNoteFactory', function (stockManagementService, stationsService, GlobalMenuService) {

    function getCompanyId() {
      return GlobalMenuService.company.get();
    }

    function getDeliveryNote(deliveryNoteId) {
      return stockManagementService.getDeliveryNote(deliveryNoteId);
    }

    function getStationList(companyId){
      return stationsService.getStationList(companyId);
    }

    return {
      getDeliveryNote: getDeliveryNote,
      getStationList: getStationList,
      getCompanyId: getCompanyId
    };

  });
