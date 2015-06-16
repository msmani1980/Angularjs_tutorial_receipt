'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('cashBagFactory', function (cashBagService, GlobalMenuService, stationsService, schedulesService, companiesService, currenciesService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getCashBagList = function (id, optionalPayload) {
      if(arguments.length > 1) {
        return cashBagService.getCashBagList(id, optionalPayload);
      } else {
        return cashBagService.getCashBagList(id);
      }
    };

    var getStationList = function (id) {
      return stationsService.getStationList(id);
    };

    var getSchedulesList = function (id) {
      return schedulesService.getSchedules(id);
    };

    var getDailySchedulesList = function (id, scheduleNumber, scheduleDate) {
      return schedulesService.getDailySchedules(id, scheduleNumber, scheduleDate);
    };

    var getCompany = function (id) {
      return companiesService.getCompany(id);
    };

    var updateCashBag = function(id, payload) {
      return cashBagService.updateCashBag(id, payload);
    };

    var getCashBag = function(id) {
      return cashBagService.getCashBag(id);
    };

    var deleteCashBag = function(id) {
      return cashBagService.deleteCashBag(id);
    };

    var getCompanyCurrencies = function() {
      return currenciesService.getCompanyCurrencies();
    };

    return {
      getCompanyId: getCompanyId,
      getCashBagList: getCashBagList,
      getStationList: getStationList,
      getCompany: getCompany,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag,
      deleteCashBag: deleteCashBag,
      getCompanyCurrencies: getCompanyCurrencies,
      getSchedulesList: getSchedulesList,
      getDailySchedulesList: getDailySchedulesList
    };
  });
