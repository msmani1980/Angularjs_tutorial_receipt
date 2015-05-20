'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuService
 * @description
 * # menuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuService', function ($http, $resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/menus/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getMenuList: {
        method: 'GET'
      },
      getMenu: {
        method: 'GET'
      },
      createMenu: {
        method: 'POST'
      },
      updateMenu: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getMenuList = function (payload) {
      return requestResource.getMenuList(payload).$promise;
    };

    var getMenu = function (menuId) {
      return requestResource.getMenu({id: menuId}).$promise;
    };

    var updateMenu = function (payload) {
      return requestResource.updateMenu(payload).$promise;
    };

    return {
      getMenuList: getMenuList,
      getMenu: getMenu,
      updateMenu: updateMenu
    };
  });
