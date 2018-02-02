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

    var getProductVersions = function (payload) {
      return eposConfigService.getProductVersions(payload);
    };

    var getModules = function (payload) {
      return eposConfigService.getModules(payload);
    };

    var getModule = function (moduleId, productVersionId) {
      return eposConfigService.getModule(moduleId, productVersionId);
    };

    return {
      getCompanyId: getCompanyId,
      getProductVersions: getProductVersions,
      getModules: getModules,
      getModule: getModule
    };
  });
