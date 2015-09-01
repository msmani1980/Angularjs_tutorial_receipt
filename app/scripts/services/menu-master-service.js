'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuMasterService
 * @description
 * # menuMasterService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuMasterService', function ($resource, ENV) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var requestURL = ENV.apiUrl + '/api/menus/menu-masters';

    var requestParameters = {};

    var actions = {
      getMenuMasterList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getMenuMasterList() {
      return requestResource.getMenuMasterList().$promise;
    }

    return {
      getMenuMasterList: getMenuMasterList
    };
  });
