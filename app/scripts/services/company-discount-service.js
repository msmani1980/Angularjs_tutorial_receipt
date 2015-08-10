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
    if (data && data.startDate) {
      data.startDate = dateUtility.formatDate(data.startDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
    }
    if (data && data.endDate) {
      data.endDate = dateUtility.formatDate(data.endDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
    }
    return data;
  }

  var appendTransform = function appendTransform(defaults, transform) {
    defaults = angular.isArray(defaults) ? defaults : [defaults];
    return defaults.concat(transform);
  };

  var requestURL = ENV.apiUrl + '/api/company-discounts';
  var requestParameters = {};

  var actions = {
    getDiscountList: {
      method: 'GET',
      transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
    }
  };

  var requestResource = $resource(requestURL, requestParameters, actions);

  var getDiscountList = function (payload) {
    return requestResource.getMenuList(payload).$promise;
  };

  return {
    getDiscountList: getDiscountList
  };
});
