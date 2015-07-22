'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuFactory
 * @description
 * # menuFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuFactory', function (menuService, itemsService, GlobalMenuService) {

    var getMenu = function (menuId) {
      return menuService.getMenu(menuId);
    };

    var updateMenu = function (payload) {
      return menuService.updateMenu(payload);
    };

    var createMenu = function (payload) {
      return menuService.createMenu(payload);
    };

    var getItemsList = function (payload, fetchFromMaster) {
      return itemsService.getItemsList(payload, fetchFromMaster);
    };

    var importFromExcel = function (companyId, file) {
      return itemsService.importFromExcel(companyId, file);
    };

    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    return {
      getMenu: getMenu,
      updateMenu: updateMenu,
      createMenu: createMenu,
      getItemsList: getItemsList,
      importFromExcel: importFromExcel,
      getCompanyId: getCompanyId
    };
  });
