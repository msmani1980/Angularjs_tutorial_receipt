'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyChoicesFactory
 * @description
 * # surveyChoicesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyChoicesFactory', function (surveyChoicesService) {
    this.getSurveyChoices = function (payload) {
      return surveyChoicesService.getSurveyChoices(payload);
    };

    this.removeSurveyQuestion = function (id) {
      return surveyQuestionsService.removeSurveyQuestion(id);
    };

    return {
      getSurveyChoices: this.getSurveyChoices,
      getSurveyChoiceTypes: this.getSurveyChoiceTypes,
      removeSurveyQuestion: this.removeSurveyQuestion
    };
  });
