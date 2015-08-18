'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockTakeFactory
 * @description
 * # stockTakeFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockTakeFactory', function (catererStationService, stockDashboardService, stockTakeService) {

    function getCatererStationList(){
      return catererStationService.getCatererStationList({limit:null});
    }

    function getItemsByCateringStationId(_catererStationId){
      return stockDashboardService.getStockDashboardItems(_catererStationId);
    }

    function getStockTake(_id){
      return stockTakeService.getStockTake(_id);
    }

    function createStockTake(payload){
      return stockTakeService.createStockTake(payload);
    }

    function updateStockTake(id, payload){
      return stockTakeService.updateStockTake(id, payload);
    }

    function deleteStockTake(id) {
      return stockTakeService.deleteStockTake(id);
    }

    function getStockTakeList(query) {
      return stockTakeService.getStockTakeList(query);
    }

    return {
      getCatererStationList: getCatererStationList,
      getItemsByCateringStationId: getItemsByCateringStationId,
      getStockTake: getStockTake,
      createStockTake: createStockTake,
      updateStockTake: updateStockTake,
      deleteStockTake: deleteStockTake,
      getStockTakeList: getStockTakeList
    };

  });
