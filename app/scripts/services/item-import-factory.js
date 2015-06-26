'use strict';

/**
 * @ngdoc service
 * @name ts5App.ItemImportFactory
 * @description
 * # ItemImportFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('ItemImportFactory', function (GlobalMenuService, companiesService, itemsService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };
    var getCompaniesList = function(payload) {
      return companiesService.getCompaniesList(payload);
    };
    var getItemsList = function(searchParameters, fetchFromMaster){
      return itemsService.getItemsList(searchParameters, fetchFromMaster);
    };
    var createItem = function(payload){
      return itemsService.createItem(payload);
    };
    return {
      getCompanyId: getCompanyId,
      getCompaniesList: getCompaniesList,
      getItemsList: getItemsList,
      createItem: createItem
    };
  });
