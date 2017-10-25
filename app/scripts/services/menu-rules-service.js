'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuRulesService
 * @description
 * # menuRulesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuRulesService', function ($resource, ENV) {
    var applyMenuRulesURL = ENV.apiUrl + '/rsvr/api/menu-rules/apply';

    var applyMenuRulesRequestParameters = { };

    var menuRulesActions = {
      applyMenuRules: {
        method: 'POST',
        headers: {}
      }
    };

    var applyMenuRulesRequestResource = $resource(applyMenuRulesURL, applyMenuRulesRequestParameters, menuRulesActions);

    function applyMenuRules(payload) {
      return applyMenuRulesRequestResource.applyMenuRules(payload).$promise;
    }

    return {
      applyMenuRules: applyMenuRules
    };
  });
