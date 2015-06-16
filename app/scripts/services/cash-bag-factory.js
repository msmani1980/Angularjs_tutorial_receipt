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

    // TODO - write test
    var getCompany = function (id) {
      return companiesService.getCompany(id);
    };

    // TODO - write test
    var updateCashBag = function(id, payload) {
      return cashBagService.updateCashBag(id, payload);
    };

    // TODO - write test
    var getCashBag = function(id) {
      return cashBagService.getCashBag(id);
    };

    // TODO - write test
    var deleteCashBag = function(id) {
      return cashBagService.deleteCashBag(id);
    };

    // TODO - write test
    var getCompanyCurrencies = function() {
      return currenciesService.getCompanyCurrencies();
    };

    return {
      getCompanyId: getCompanyId,
      getCashBagList: getCashBagList,
      getStationList: getStationList,
      getSchedulesList: getSchedulesList,
      getCompany: getCompany,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag,
      deleteCashBag: deleteCashBag,
      getCompanyCurrencies: getCompanyCurrencies

    };
  });
