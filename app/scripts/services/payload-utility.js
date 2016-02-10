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
    var $this = this;

    this.serializeDates = function(payload) {
      var formattedPayload = angular.copy(payload);

      formattedPayload.startDate = (formattedPayload.startDate) ? dateUtility.formatDateForAPI(formattedPayload.startDate) : null;
      formattedPayload.endDate = (formattedPayload.endDate) ?  dateUtility.formatDateForAPI(formattedPayload.endDate) : null;

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

    this.serializeDate = function (value) {
      return (value) ? dateUtility.formatDateForAPI(value) : null;
    };

    this.serializeInput = function (value) {
      return (value === '') ? null : value;
    };

    this.sanitize = function (payload) {
      for (var key in payload) {
        var value = payload[key];
        payload[key] = $this.serializeInput(value);
      }
    };
  });
