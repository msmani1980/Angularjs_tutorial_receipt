'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockTakeService
 * @description
 * # stockTakeService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockTakeService', function ($resource, ENV, Upload) {

    var requestURL = ENV.apiUrl + '/rsvr/api/stock-management/stock-takes/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getStockTakeList: {
        method: 'GET'
      },
      getStockTake: {
        method: 'GET'
      },
      createStockTake: {
        method: 'POST'
      },
      updateStockTake: {
        method: 'PUT'
      },
      deleteStockTake: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getStockTakeList = function (query) {
      return requestResource.getStockTakeList(query).$promise;
    };

    var getStockTake = function (id) {
      return requestResource.getStockTake({ id: id }).$promise;
    };

    var createStockTake = function (payload) {
      return requestResource.createStockTake(payload).$promise;
    };

    var updateStockTake = function (id, payload) {
      return requestResource.updateStockTake({ id: id }, payload).$promise;
    };

    var deleteStockTake = function (id) {
      return requestResource.deleteStockTake({ id: id }).$promise;
    };

    function importFromExcel(companyId, file, cateringStationId) {
      var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/stocktake?cateringStationId=' + cateringStationId;
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    }

    return {
      getStockTakeList: getStockTakeList,
      getStockTake: getStockTake,
      createStockTake: createStockTake,
      updateStockTake: updateStockTake,
      deleteStockTake: deleteStockTake,
      importFromExcel: importFromExcel
    };

  });
