'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockManagementService
 * @description
 * # stockManagementService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockManagementService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/stock-management';

    var requestParameters = {
      id: '@id'
    };

    var actionsDeliveryNote = {
      getDeliveryNote: {
        method: 'GET'
      }
    };

    var requestResourceDeliveryNote = $resource(requestURL+'/delivery-notes/:id', requestParameters, actionsDeliveryNote);

    function getDeliveryNote(deliveryNoteId) {
      return requestResourceDeliveryNote.getDeliveryNote({id:deliveryNoteId}).$promise;
    }

    return {
      getDeliveryNote: getDeliveryNote
    };

  });
