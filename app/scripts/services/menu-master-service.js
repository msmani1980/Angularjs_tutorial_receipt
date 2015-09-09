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
    var requestURL = ENV.apiUrl + '/api/menus/menu-masters';

    var requestParameters = {};

    var actions = {
      getMenuMasterList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getMenuMasterList(query) {
      return requestResource.getMenuMasterList(query).$promise;
    }

    return {
      getMenuMasterList: getMenuMasterList
    };
  });
