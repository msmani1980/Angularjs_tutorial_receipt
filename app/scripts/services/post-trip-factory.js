'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('postTripFactory', function (GlobalMenuService, stationsService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getPostTripDataList = function (id, optionalPayload) {
      return {response:'mock'};
      //if(arguments.length > 1) {
      //  return cashBagService.getCashBagList(id, optionalPayload);
      //} else {
      //  return cashBagService.getCashBagList(id);
      //}
    };

    var getStationList = function (id) {
      return stationsService.getStationList(id);
    };


    return {
      getPostTripDataList: getPostTripDataList,
      getCompanyId: getCompanyId,
      getStationList: getStationList
    };
  });
