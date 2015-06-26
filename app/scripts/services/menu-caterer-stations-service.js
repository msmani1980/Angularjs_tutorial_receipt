  'use strict';

  /**
   * @ngdoc service
   * @name ts5App.menuRelationshipsService
   * @description
   * # menuRelationshipsService
   * Service in the ts5App.
   */
  angular.module('ts5App')
    .service('menuCatererStationsService', function ($resource, ENV) {
      var requestURL = ENV.apiUrl + '/api/menus/caterer-stations/:id';
      var requestParameters = {
        id: '@id',
        limit: 50
      };

      var actions = {
        getRelationshipList: {
          method: 'GET'
        },
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

      var requestResource = $resource(requestURL, requestParameters, actions);

      var getRelationshipList = function (payload) {
        return requestResource.getRelationshipList(payload).$promise;
      };

      var getRelationship = function (relationshipId) {
        return requestResource.getRelationship({
          id: relationshipId
        }).$promise;
      };

      var deleteRelationship = function (relationshipId) {
        return requestResource.deleteRelationship({
          id: relationshipId
        }).$promise;
      };

      var updateRelationship = function (payload) {
        return requestResource.updateRelationship(payload).$promise;
      };

      var createRelationship = function (payload) {
        return requestResource.createRelationship(payload).$promise;
      };

      return {
        getRelationshipList: getRelationshipList,
        deleteRelationship: deleteRelationship,
        getRelationship: getRelationship,
        updateRelationship: updateRelationship,
        createRelationship: createRelationship
      };
    });
