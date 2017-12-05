'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuRulesService
 * @description
 * # menuRulesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuRulesService', function ($resource, ENV) {
    
    var applyMenuRulesURL = ENV.apiUrl + '/rsvr/api/menu-rules/apply';
    
    var menuRulesRequestURL = ENV.apiUrl + '/rsvr/api/menu-rules/:id';
    
    var applyMenuRulesRequestParameters = { };
    
    var menuRulesManagementActions = {
      getMenuRules: {
        method: 'GET',
        headers: {}
      },
      getMenuRule: {
        method: 'GET',
        headers: {}
      },
      createMenuRule: {
        method: 'POST',
        headers: {}
      },
      updateMenuRule: {
        method: 'PUT',
        headers: {}
      },
      deleteMenuRule: {
        method: 'DELETE',
        headers: {}
      }
    };

    var menuRulesActions = {
      applyMenuRules: {
        method: 'POST',
        headers: {}
      }
    };

    var applyMenuRulesRequestResource = $resource(applyMenuRulesURL, applyMenuRulesRequestParameters, menuRulesActions);

    function applyMenuRules(payload) {
      return applyMenuRulesRequestResource.applyMenuRules(payload).$promise;
    }
    
    var menuRulesRequestResource = $resource(menuRulesRequestURL, null, menuRulesManagementActions);

    var getMenuRules = function(payload) {
      return menuRulesRequestResource.getMenuRules(payload).$promise;
    };

    var getMenuRule = function(menuRuleId) {
      var payload = {
        id: menuRuleId
      };
      return menuRulesRequestResource.getMenuRule(payload).$promise;
    };
    
    var createMenuRule = function (payload) {
      return menuRulesRequestResource.createMenuRule(payload).$promise;
    };
    
    var updateMenuRule = function (payload) {
      var requestParameters = {
        id: payload.id
      };
      return menuRulesRequestResource.updateMenuRule(requestParameters, payload).$promise;
    };
    
    var deleteMenuRule = function (menuRuleId) {
      var payload = {
        id: menuRuleId
      };
      return menuRulesRequestResource.deleteMenuRule(payload).$promise;
    };

    return {
      applyMenuRules: applyMenuRules,
      getMenuRules: getMenuRules,
      getMenuRule: getMenuRule,
      createMenuRule: createMenuRule,
      updateMenuRule: updateMenuRule,
      deleteMenuRule: deleteMenuRule
    };
  });
