'use strict';

/**
 * @ngdoc service
 * @name ts5App.templateOption
 * @description
 * # templateOption
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('templateOptionService', function ($http, globalMenuService, ENV) {
    return {
<<<<<<< HEAD
      getChoiceValues: function(choiceLookup, filter) {
        return $http.get(ENV.apiUrl + '/report-api/option/' + choiceLookup, { headers:{ companyId:globalMenuService.company.get() }, params: { filter: filter } });
=======
      getChoiceValues: function (choiceLookup, filter) {
        return $http.get(ENV.apiUrl + '/report-api/option/' + choiceLookup, { headers: { companyId: globalMenuService.company.get() }, params: { filter: filter } });
>>>>>>> remotes/origin/master
      }
    };
  });
