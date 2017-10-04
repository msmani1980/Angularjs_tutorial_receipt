'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuAssignmentFactory
 * @description
 * # menuAssignmentFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuAssignmentFactory', function (menuAssignmentService, globalMenuService) {
    function getCompanyId() {
      return globalMenuService.company.get();
    }

    function getMenuAssignmentList(payload) {
      return menuAssignmentService.getMenuAssignmentList(payload);
    }

    function getMenuAssignment(menuAssignmentId) {
      return menuAssignmentService.getMenuAssignment(getCompanyId(), menuAssignmentId);
    }

    return {
      getCompanyId: getCompanyId,
      getMenuAssignmentList: getMenuAssignmentList,
      getMenuAssignment: getMenuAssignment
    };

  });
