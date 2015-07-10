'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemImportFactory
 * @description
 * # itemImportFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemImportFactory', function (GlobalMenuService, companyService, itemsService, itemImportService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };
    var getCompanyList = function(payload) {
      return companyService.getCompanyList(payload);
    };
    var getItemsList = function(searchParameters, fetchFromMaster){
      return itemsService.getItemsList(searchParameters, fetchFromMaster);
    };
    var importItems = function(payload){
      return itemImportService.importItems(payload);
    };
    return {
      getCompanyId: getCompanyId,
      getCompanyList: getCompanyList,
      getItemsList: getItemsList,
      importItems: importItems
    };
  });
