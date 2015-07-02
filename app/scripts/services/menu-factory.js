'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuFactory
 * @description
 * # menuFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuFactory', function (menuService, itemsService) {

    var getMenu = function (menuId) {
      return menuService.getMenu(menuId);
    };

    var updateMenu = function (payload) {
      return menuService.updateMenu(payload);
    };

    var getItemsList = function (payload, fetchFromMaster) {
      return itemsService.getItemsList(payload, fetchFromMaster);
    };

    return {
      getMenu: getMenu,
      updateMenu: updateMenu,
      getItemsList: getItemsList
    };
  });
