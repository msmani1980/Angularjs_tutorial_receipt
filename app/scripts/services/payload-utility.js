'use strict';

/**
 * @ngdoc service
 * @name ts5App.payloadUtility
 * @description
 * # payloadUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('payloadUtility', function (dateUtility) {

    this.serializeDates = function(payload) {
      var formattedPayload = angular.copy(payload);
      if (formattedPayload.startDate) {
        formattedPayload.startDate = dateUtility.formatDateForAPI(formattedPayload.startDate);
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = dateUtility.formatDateForAPI(formattedPayload.endDate);
      }
      return formattedPayload;
    };

    this.deserializeDates = function (responseFromAPI) {
      var formattedResponseFromAPI = angular.copy(responseFromAPI);
      angular.forEach(formattedResponseFromAPI, function (item) {
        item.startDate = dateUtility.formatDateForApp(item.startDate);
        item.endDate = dateUtility.formatDateForApp(item.endDate);
      });

      return formattedResponseFromAPI;
    };

  });
