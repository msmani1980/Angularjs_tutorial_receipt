'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposConfigFactory
 * @description
 * # eposConfigFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('eposConfigFactory', function (globalMenuService, eposConfigService) {
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getModules = function (payload) {
      return eposConfigService.getModules(payload);
    };

    return {
      getCompanyId: getCompanyId,
      getModules: getModules
    };
  });
