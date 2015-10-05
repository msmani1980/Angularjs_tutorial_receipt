'use strict';

/**
 * @ngdoc service
 * @name ts5App.discountService
 * @description
 * # discountService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('discountService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/company-discounts/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getDiscountList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getDiscountList = function (payload) {
      return requestResource.getDiscountList(payload).$promise;
    };

    return {
      getDiscountList: getDiscountList
    };
  });
