'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuFactory
 * @description
 * # menuFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuFactory', function (menuService, itemsService, GlobalMenuService, dateUtility) {

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
      // TODO: move date formatting to service level
      if(payload.startDate && payload.endDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
        payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      }
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
