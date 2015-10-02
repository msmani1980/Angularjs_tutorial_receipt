'use strict';

/**
 * @ngdoc service
 * @name ts5App.discountTypesService
 * @description
 * # discountTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('discountTypesService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/discounts/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getDiscountTypesList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getDiscountTypesList = function (payload) {
      return requestResource.getDiscountTypesList(payload).$promise;
    };

    return {
      getDiscountTypesList: getDiscountTypesList
    };
  });
