'use strict';

/**
 * @ngdoc service
 * @name ts5App.exciseDutyRelationshipService
 * @description
 * # exciseDutyService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('exciseDutyRelationshipService', function ($resource, ENV) {

    var itemExciseDutyRequestURL = ENV.apiUrl + '/rsvr/api/item-excise-duty/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getRelationship: {
        method: 'GET'
      },
      createRelationship: {
        method: 'POST'
      },
      updateRelationship: {
        method: 'PUT'
      },
      deleteRelationship: {
        method: 'DELETE'
      }
    };
    var itemExciseDutyRequestResources = $resource(itemExciseDutyRequestURL, requestParameters, actions);

    var getRelationshipList = function (payload) {
      requestParameters.id = '';
      var requestPayload = payload || {};
      return itemExciseDutyRequestResources.getRelationship(requestPayload).$promise;
    };

    var getRelationship = function (id) {
      requestParameters.id = id;
      return itemExciseDutyRequestResources.getRelationship().$promise;
    };

    var createRelationship = function (payload) {
      requestParameters.id = '';
      return itemExciseDutyRequestResources.createRelationship(payload).$promise;
    };

    var updateRelationship = function (id, payload) {
      requestParameters.id = id;
      return itemExciseDutyRequestResources.updateRelationship(payload).$promise;
    };

    var deleteRelationship = function (id) {
      requestParameters.id = id;
      return itemExciseDutyRequestResources.deleteRelationship(id).$promise;
    };

    return {
      getRelationshipList: getRelationshipList,
      getRelationship: getRelationship,
      createRelationship: createRelationship,
      updateRelationship: updateRelationship,
      deleteRelationship: deleteRelationship
    };

  });
