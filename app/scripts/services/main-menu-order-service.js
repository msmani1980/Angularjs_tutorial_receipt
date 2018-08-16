'use strict';

/**
 * @ngdoc service
 * @name ts5App.mainMenuOrderService
 * @description
 * # mainMenuOrderService
 * Service in the ts5App.
 */
angular.module('ts5App').service('mainMenuOrderService', function ($resource, ENV) {

  var requestURL = ENV.apiUrl + '/rsvr/api/records/menuOrder';
  var requestParameters = {};

  var actions = {
    getMenuOrderList: {
      method: 'GET',
      isArray: true
    }
  };

  var requestResource = $resource(requestURL, requestParameters, actions);

  var getMenuOrderList = function () {
    return requestResource.getMenuOrderList().$promise;
  };

  return {
    getMenuOrderList: getMenuOrderList
  };

});
