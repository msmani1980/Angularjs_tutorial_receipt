'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposConfigService
 * @description
 * # eposConfigService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eposConfigService', function ($resource, ENV) {

    // API URL Definitions

    // -- epos config
    var eposConfigRequestURL = ENV.apiUrl + '/rsvr/epos-config/cmo';
    var eposConfigManagementActions = {
      createOrUpdate: {
        method: 'POST',
        headers: {
          hisec: true
        }
      }
    };

    // -- epos config PRODUCT
    var eposConfigProductRequestURL = ENV.apiUrl + '/rsvr/epos-config/product';
    var eposConfigProductManagementActions = {
      getProductVersions: {
        method: 'GET',
        headers: {}
      }
    };

    // -- epos config MODULE
    var eposConfigModuleRequestURL = ENV.apiUrl + '/rsvr/epos-config/module/:id/:pid';
    var eposConfigModuleRequestParameters = {
      id: '',
      pid: ''
    };
    var eposConfigModuleManagementActions = {
      getAllModules: {
        method: 'GET',
        headers: {}
      },
      getAllModule: {
        method: 'GET',
        headers: {}
      }
    };

    var eposConfigRequestResource = $resource(eposConfigRequestURL, null, eposConfigManagementActions);
    var eposConfigProductRequestResource = $resource(eposConfigProductRequestURL, null, eposConfigProductManagementActions);
    var eposConfigModuleRequestResource = $resource(eposConfigModuleRequestURL, eposConfigModuleRequestParameters, eposConfigModuleManagementActions);

    var createOrUpdate = function(payload) {
      var requestPayload = payload || {};

      return eposConfigRequestResource.createOrUpdate(requestPayload).$promise;
    };

    var getProductVersions = function(payload) {
      var requestPayload = payload || {};
      return eposConfigProductRequestResource.getProductVersions(requestPayload).$promise;
    };

    var getModules = function(payload) {
      var requestPayload = payload || {};

      eposConfigModuleRequestParameters.id = null;
      eposConfigModuleRequestParameters.pid = null;

      return eposConfigModuleRequestResource.getAllModules(requestPayload).$promise;
    };

    var getModule = function(moduleId, productVersionId) {
      eposConfigModuleRequestParameters.id = moduleId;
      eposConfigModuleRequestParameters.pid = productVersionId;
      return eposConfigModuleRequestResource.getAllModule(null).$promise;
    };

    return {
      createOrUpdate: createOrUpdate,
      getProductVersions: getProductVersions,
      getModules: getModules,
      getModule: getModule
    };

  });
