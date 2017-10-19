'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemTypesService
 * @description
 * # itemTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('voucherDurationsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/records/voucher-durations/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getVoucherDurationsList: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getVoucherDurationsList = function (payload) {
      return requestResource.getVoucherDurationsList(payload).$promise;
    };

    return {
      getVoucherDurationsList: getVoucherDurationsList
    };

  });
