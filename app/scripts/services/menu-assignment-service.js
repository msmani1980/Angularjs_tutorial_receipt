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
      console.log('Service - getMenuAssignmentList');
      requestParameters.id = '';
      return menuAssignmentRequestResource.getMenuAssignment(payload).$promise;
    }
    
    return {
      getMenuAssignmentList: getMenuAssignmentList
    };

  });
