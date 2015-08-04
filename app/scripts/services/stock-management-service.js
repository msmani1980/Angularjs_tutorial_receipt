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

    var requestURL = ENV.apiUrl + '/api/stock-management/delivery-notes/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getDeliveryNote: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getDeliveryNote(deliveryNoteId) {
      return requestResource.getDeliveryNote({id:deliveryNoteId}).$promise;
    }

    return {
      getDeliveryNote: getDeliveryNote
    };

  });
