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
    var cashCompanyId = 0;
	var retailCompanyId = 0;
	var loadCompanySelection = function(){
		cashCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().id : 0;
		retailCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().chCompany.companyId : globalMenuService.company.get();
	}
		
    return {
      getChoiceValues: function (choiceLookup, filter) {
        return $http.get(ENV.apiUrl + '/report-api/option/' + choiceLookup, { headers: {  companyId: retailCompanyId, chCompanyId: cashCompanyId }, params: { filter: filter } });
      }
    };
  });
