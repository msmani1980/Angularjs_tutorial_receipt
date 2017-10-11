'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuAssignmentService
 * @description
 * # menuAssignmentService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuAssignmentService', function ($resource, ENV) {

    var menuAssignmentURL = ENV.apiUrl + '/rsvr/api/menu-assignments/:id';
    var requestParameters = {
      id: '@id'
    };

    var menuAssignmentActions = {
      getMenuAssignment: {
        method: 'GET',
        headers: {}
      },
      getMenuAssignmentById: {
        method: 'GET',
        headers: {}
      },
      createMenuAssignment: {
        method: 'POST',
        headers: {}
      },
      updateMenuAssignment: {
        method: 'PUT',
        headers: {}
      }
    };

    var menuAssignmentRequestResource = $resource(menuAssignmentURL, requestParameters, menuAssignmentActions);

    function getMenuAssignmentList(payload) {
      requestParameters.id = '';
      return menuAssignmentRequestResource.getMenuAssignment(payload).$promise;
    }

    function getMenuAssignment(companyId, menuAssignmentId) {
      var payload = {
        companyId: companyId,
        id: menuAssignmentId
      };

      return menuAssignmentRequestResource.getMenuAssignment(payload).$promise;
    }

    function updateMenuAssignment(id, payload) {
      return menuAssignmentRequestResource.updateMenuAssignment({ id: id }, payload).$promise;
    }

    return {
      getMenuAssignmentList: getMenuAssignmentList,
      getMenuAssignment: getMenuAssignment,
      updateMenuAssignment: updateMenuAssignment
    };

  });
