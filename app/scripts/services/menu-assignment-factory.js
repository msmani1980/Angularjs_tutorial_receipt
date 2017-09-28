'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuAssignmentFactory
 * @description
 * # menuAssignmentFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuAssignmentFactory', function (menuAssignmentService) {

    function getMenuAssignmentList(payload) {
      console.log('Factory - getMenuAssignmentList');
      return menuAssignmentService.getMenuAssignmentList(payload);
    }

    return {
      getMenuAssignmentList: getMenuAssignmentList
    };

  });
