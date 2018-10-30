'use strict';

/**
 * @ngdoc service
 * @name ts5App.packingplanFactory
 * @description
 * # packingplanFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('packingplanFactory', function (globalMenuService, packingplanService, menuMasterService, unitsService, menuService) {
  // Service logic
  var getCompanyId = function () {
    return globalMenuService.company.get();
  };

  var getPackingPlansList = function (payload) {
    return packingplanService.getPackingPlansList(payload);
  };

  var getPackingPlanById = function(planId) {
    return packingplanService.getPackingPlanById(planId);
  };

  var createPackingPlan = function (payload) {
    return packingplanService.createPackingPlan(payload);
  };

  var updatePackingPlan = function (payload) {
    return packingplanService.updatePackingPlan(payload.id, payload);
  };
    
  var deletePackingPlan = function (planId) {
    return packingplanService.deletePackingPlan(planId);
  };

  var getMenuMasterList = function (payload) {
    return menuMasterService.getMenuMasterList(payload);
  };

  var getDimensionList = function (payload) {
    return unitsService.getDimensionList(payload);
  };

  var getMenuById = function (menuId) {
    return menuService.getMenu(menuId);
  };

  return {
    getCompanyId: getCompanyId,
    getPackingPlansList: getPackingPlansList,
    getPackingPlanById: getPackingPlanById,
    createPackingPlan: createPackingPlan,
    updatePackingPlan: updatePackingPlan,
    deletePackingPlan: deletePackingPlan,
    getMenuMasterList: getMenuMasterList,
    getDimensionList: getDimensionList,
    getMenuById: getMenuById
  };

});
