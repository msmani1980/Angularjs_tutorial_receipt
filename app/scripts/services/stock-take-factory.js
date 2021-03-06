'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockTakeFactory
 * @description
 * # stockTakeFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockTakeFactory', function(catererStationService, stockDashboardService, stockTakeService, itemsService,
    recordsService, globalMenuService) {

    function getCompanyId() {
      return globalMenuService.company.get();
    }

    function getCatererStationList() {
      return catererStationService.getCatererStationList({
        limit: null
      });
    }

    function getItemsByCateringStationId(_catererStationId) {
      return stockDashboardService.getStockDashboardItems(_catererStationId);
    }

    function getItemsMasterList(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function getMasterItem(id) {
      return itemsService.getMasterItem(id);
    }

    function getStockTake(_id) {
      return stockTakeService.getStockTake(_id);
    }

    function createStockTake(payload) {
      return stockTakeService.createStockTake(payload);
    }

    function updateStockTake(id, payload) {
      return stockTakeService.updateStockTake(id, payload);
    }

    function deleteStockTake(id) {
      return stockTakeService.deleteStockTake(id);
    }

    function getStockTakeList(query) {
      return stockTakeService.getStockTakeList(query);
    }

    function importFromExcel(companyId, file, catererStationId) {
      return stockTakeService.importFromExcel(companyId, file, catererStationId);
    }

    function getStockDashboardItems(catererStationId) {
      return stockDashboardService.getStockDashboardItems(catererStationId);
    }

    function getItemTypes() {
      return recordsService.getItemTypes();
    }

    function getCharacteristics() {
      return recordsService.getCharacteristics();
    }

    return {
      getCatererStationList: getCatererStationList,
      getItemsByCateringStationId: getItemsByCateringStationId,
      getStockTake: getStockTake,
      createStockTake: createStockTake,
      updateStockTake: updateStockTake,
      deleteStockTake: deleteStockTake,
      getStockTakeList: getStockTakeList,
      importFromExcel: importFromExcel,
      getStockDashboardItems: getStockDashboardItems,
      getCompanyId: getCompanyId,
      getItemsMasterList: getItemsMasterList,
      getMasterItem: getMasterItem,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics
    };

  });
