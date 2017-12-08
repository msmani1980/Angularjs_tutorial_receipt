'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyFactory
 * @description
 * # surveyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyFactory', function (globalMenuService, surveyService) {
    // Service logic
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };
    
    var getSurveys = function (payload) {
      return surveyService.getSurveys(payload);
    };

    var getSurveyTypes = function () {
      return surveyService.getSurveyTypes();
    };
    
    var getSurvey = function(employeeId) {
      return surveyService.getSurveyById(getCompanyId(), employeeId);
    };
    
    var createSurvey = function (payload) {
      return surveyService.createSurvey(getCompanyId(), payload);
    };
    
    var updateSurvey = function (payload) {
      return surveyService.updateSurvey(getCompanyId(), payload.id, payload);
    };
    
    var deleteSurvey = function (employeeId) {
      return surveyService.deleteSurvey(getCompanyId(), employeeId);
    };
    
    return {
      getSurveys: getSurveys,
      getSurveyTypes: getSurveyTypes,
      getSurvey: getSurvey,
      createSurvey: createSurvey,
      updateSurvey: updateSurvey,
      deleteSurvey: deleteSurvey,
      getCompanyId: getCompanyId
    };
	
  });
