'use strict';

/**
 * @ngdoc service
 * @name ts5App.deliveryNoteservice
 * @description
 * # deliveryNoteservice
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('deliveryNotesService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/stock-management/delivery-notes/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getDeliveryNotesList: {
        method: 'GET'
      },
      getDeliveryNote: {
        method: 'GET'
      },
      createDeliveryNote: {
        method: 'POST'
      },
      saveDeliveryNote: {
        method: 'PUT'
      },
      deleteDeliveryNote: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getDeliveryNotesList(query) {
      return requestResource.getDeliveryNote(query).$promise;
    }

    function getDeliveryNote(deliveryNoteId) {
      return requestResource.getDeliveryNote({id:deliveryNoteId}).$promise;
    }

    function createDeliveryNote(payload) {
      return requestResource.createDeliveryNote(payload).$promise;
    }

    function saveDeliveryNote(payload) {
      return requestResource.saveDeliveryNote(payload).$promise;
    }

    function deleteDeliveryNote(deliveryNoteId) {
      return requestResource.deleteDeliveryNote({id:deliveryNoteId}).$promise;
    }


    return {
      getDeliveryNotesList: getDeliveryNotesList,
      getDeliveryNote: getDeliveryNote,
      createDeliveryNote: createDeliveryNote,
      saveDeliveryNote: saveDeliveryNote,
      deleteDeliveryNote: deleteDeliveryNote
    };

  });
