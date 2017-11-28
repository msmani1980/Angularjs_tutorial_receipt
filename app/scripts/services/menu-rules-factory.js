'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuRulesFactory
 * @description
 * # menuRulesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuRulesFactory', function (globalMenuService, stationsService, menuRulesService, schedulesService) {
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getMenuRules = function (payload) {
      return menuRulesService.getMenuRules(payload);
    };

    var getMenuRule = function(menuRuleId) {
      return menuRulesService.getMenuRule(menuRuleId);
    };

    var createMenuRule = function (payload) {
      return menuRulesService.createMenuRule(payload);
    };

    var updateMenuRule = function (payload) {
      return menuRulesService.updateMenuRule(payload);
    };

    var deleteMenuRule = function (menuRuleId) {
      return menuRulesService.deleteMenuRule(menuRuleId);
    };

    var getCompanyGlobalStationList = function (payload) {
      return stationsService.getGlobalStationList(payload);
    };

    var getSchedules = function(payload) {
      return schedulesService.getSchedules(payload);
    };

    return {
      getMenuRules: getMenuRules,
      getMenuRule: getMenuRule,
      createMenuRule: createMenuRule,
      updateMenuRule: updateMenuRule,
      deleteMenuRule: deleteMenuRule,
      getCompanyId: getCompanyId,
      getCompanyGlobalStationList: getCompanyGlobalStationList,
      getSchedules: getSchedules
    };
  });
