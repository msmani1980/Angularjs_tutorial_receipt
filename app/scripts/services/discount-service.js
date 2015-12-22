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
      },
      getDiscount: {
        method: 'GET'
      },
      createDiscount: {
        method: 'POST'
      },
      updateDiscount: {
        method: 'PUT'
      },
      deleteDiscount: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getDiscountList = function (payload) {
      return requestResource.getDiscountList(payload).$promise;
    };

    var getDiscount = function (discountId) {
      return requestResource.getDiscount({id: discountId}).$promise;
    };

    var createDiscount = function (payload) {
      return requestResource.createDiscount(payload).$promise;
    };

    var updateDiscount = function (discountId, payload) {
      return requestResource.updateDiscount({id: discountId}, payload).$promise;
    };

    var deleteDiscount = function (discountId) {
      return requestResource.deleteDiscount({id: discountId}).$promise;
    };

    return {
      getDiscountList: getDiscountList,
      deleteDiscount: deleteDiscount,
      getDiscount: getDiscount,
      createDiscount: createDiscount,
      updateDiscount: updateDiscount
    };
  });
