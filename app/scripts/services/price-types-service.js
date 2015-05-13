'use strict';

/**
 * @ngdoc service
 * @name ts5App.priceTypesService
 * @description
 * # priceTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('priceTypesService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/records/price-types/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPriceTypesList: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getPriceTypesList = function (payload) {
      return requestResource.getPriceTypesList(payload).$promise;
    };

    return {
      getPriceTypesList: getPriceTypesList
    };

});
