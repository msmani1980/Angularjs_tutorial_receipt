'use strict';

/**
 * @ngdoc service
 * @name ts5App.exciseDutyRelationshipFactory
 * @description
 * # exciseDutyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('exciseDutyRelationshipFactory', function (exciseDutyService, exciseDutyRelationshipService, recordsService, itemsService) {

    var getExciseDutyList = function (payload) {
      return exciseDutyService.getExciseDutyList(payload);
    };

    var getRelationshipList = function (payload) {
      return exciseDutyRelationshipService.getRelationshipList(payload);
    };

    var getRelationship = function (id) {
      return exciseDutyRelationshipService.getRelationship(id);
    };

    var createRelationship = function (payload) {
      return exciseDutyRelationshipService.createRelationship(payload);
    };

    var updateRelationship = function (id, payload) {
      return exciseDutyRelationshipService.updateRelationship(id, payload);
    };

    var deleteRelationship = function (id) {
      return exciseDutyRelationshipService.deleteRelationship(id);
    };

    var getItemTypes = function () {
      return recordsService.getItemTypes();
    };

    var getMasterItemList = function (payload) {
      return itemsService.getItemsList(payload, true);
    };

    return {
      getExciseDutyList: getExciseDutyList,
      getRelationshipList: getRelationshipList,
      getRelationship: getRelationship,
      createRelationship: createRelationship,
      updateRelationship: updateRelationship,
      deleteRelationship: deleteRelationship,
      getItemTypes: getItemTypes,
      getMasterItemList: getMasterItemList
    };
  });
