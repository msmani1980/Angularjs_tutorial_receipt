'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyDiscountService
 * @description
 * # companyDiscountService
 * Service in the ts5App.
 */
angular.module('ts5App').service('companyDiscountService', function ($resource, ENV, dateUtility, $http) {

  function transformResponse(data) {
    data = angular.fromJson(data);
    angular.forEach(data.companyDiscounts, function (discount) {
      if (discount && discount.startDate) {
        discount.startDate = dateUtility.formatDateForApp(discount.startDate);
      }

      if (discount && discount.endDate) {
        discount.endDate = dateUtility.formatDateForApp(discount.endDate);
      }
    });

    return data;
  }

  var appendTransform = function appendTransform(defaults, transform) {
    defaults = angular.isArray(defaults) ? defaults : [defaults];
    return defaults.concat(transform);
  };

  var requestURL = ENV.apiUrl + '/rsvr/api/company-discounts';
  var requestParameters = {};

  var actions = {
    getDiscountList: {
      method: 'GET',
      transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
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
