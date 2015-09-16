'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDashboardFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceDashboardFactory',
  function (catererStationService) {

    function getCatererStationList() {
      return catererStationService.getCatererStationList({limit: null});
    }


    return {
      getCatererStationList: getCatererStationList
    };

  });
