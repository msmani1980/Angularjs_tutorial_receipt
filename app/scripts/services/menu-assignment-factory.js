'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuAssignmentFactory
 * @description
 * # menuAssignmentFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuAssignmentFactory', function (menuAssignmentService, globalMenuService, menuRulesService) {
    function getCompanyId() {
      return globalMenuService.company.get();
    }

    function getMenuAssignmentList(payload) {
      return menuAssignmentService.getMenuAssignmentList(payload);
    }

    function getMenuAssignment(menuAssignmentId) {
      return menuAssignmentService.getMenuAssignment(getCompanyId(), menuAssignmentId);
    }

    function updateMenuAssignment(id, payload) {
      return menuAssignmentService.updateMenuAssignment(id, payload);
    }

    function applyMenuRules(payload) {
      return menuRulesService.applyMenuRules(payload);
    }
    
    return {
      getCompanyId: getCompanyId,
      getMenuAssignmentList: getMenuAssignmentList,
      getMenuAssignment: getMenuAssignment,
      updateMenuAssignment: updateMenuAssignment,
      applyMenuRules: applyMenuRules
    };

  });
