'use strict';

/**
 * @ngdoc service
 * @name ts5App.exciseDutyFactory
 * @description
 * # exciseDutyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('exciseDutyFactory', function (exciseDutyService, countriesService, unitsService) {

    var getExciseDutyList = function (payload) {
      return exciseDutyService.getExciseDutyList(payload);
    };

    var getExciseDuty = function (id) {
      return exciseDutyService.getExciseDuty(id);
    };

    var createExciseDuty = function (payload) {
      return exciseDutyService.createExciseDuty(payload);
    };

    var updateExciseDuty = function (id, payload) {
      return exciseDutyService.updateExciseDuty(id, payload);
    };

    var deleteExciseDuty = function (id) {
      return exciseDutyService.deleteExciseDuty(id);
    };

    var getCountriesList = function () {
      return countriesService.getCountriesList();
    };

    var getVolumeUnits = function () {
      return unitsService.getVolumeList();
    };

    return {
      getExciseDutyList: getExciseDutyList,
      getExciseDuty: getExciseDuty,
      createExciseDuty: createExciseDuty,
      updateExciseDuty: updateExciseDuty,
      deleteExciseDuty: deleteExciseDuty,
      getCountriesList: getCountriesList,
      getVolumeUnits: getVolumeUnits
    };
  });
