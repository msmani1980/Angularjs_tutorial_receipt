'use strict';

/**
 * @ngdoc service
 * @name ts5App.routeTaxRatesFactory
 * @description
 * # routeTaxRatesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('routeTaxRatesFactory', function (routeTaxRatesService, globalMenuService) {
    this.getRouteTaxRate = function (id) {
      return routeTaxRatesService.getRouteTaxRate(id);
    };

    this.getRouteTaxRates = function (payload) {
      return routeTaxRatesService.getRouteTaxRates(payload);
    };

    this.createRouteTaxRate = function (payload) {
      return routeTaxRatesService.createRouteTaxRate(payload);
    };

    this.updateRouteTaxRate = function (id, payload) {
      return routeTaxRatesService.updateRouteTaxRate(id, payload);
    };

    this.removeRouteTaxRate = function (id) {
      return routeTaxRatesService.removeRouteTaxRate(id);
    };

    this.getCompanyId = function () {
      return globalMenuService.company.get();
    };

    return {
      getRouteTaxRate: this.getRouteTaxRate,
      getRouteTaxRates: this.getRouteTaxRates,
      createRouteTaxRate: this.createRouteTaxRate,
      updateRouteTaxRate: this.updateRouteTaxRate,
      removeRouteTaxRate: this.removeRouteTaxRate,
      getCompanyId: this.getCompanyId
    };
  });
