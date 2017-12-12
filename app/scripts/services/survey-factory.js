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
  
    var getSurveyQuestions = function (payload) {
      return surveyService.getSurveyQuestions(payload);
    };
    
    var getSurvey = function(surveyId) {
      return surveyService.getSurveyById(surveyId);
    };
    
    var createSurvey = function (payload) {
      return surveyService.createSurvey(payload);
    };
    
    var updateSurvey = function (payload) {
      return surveyService.updateSurvey(payload.id, payload);
    };
    
    var deleteSurvey = function (surveyId) {
      return surveyService.deleteSurvey(surveyId);
    };
    
    return {
      getSurveys: getSurveys,
      getSurveyTypes: getSurveyTypes,
      getSurveyQuestions: getSurveyQuestions,
      getSurvey: getSurvey,
      createSurvey: createSurvey,
      updateSurvey: updateSurvey,
      deleteSurvey: deleteSurvey,
      getCompanyId: getCompanyId
    };
	
  });
