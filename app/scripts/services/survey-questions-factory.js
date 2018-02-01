'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyQuestionsFactory
 * @description
 * # surveyQuestionsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyQuestionsFactory', function (surveyQuestionsService, globalMenuService) {
    this.getSurveyQuestion = function (id) {
      return surveyQuestionsService.getSurveyQuestion(id);
    };

    this.getSurveyQuestions = function (payload) {
      return surveyQuestionsService.getSurveyQuestions(payload);
    };

    this.createSurveyQuestion = function (payload) {
      return surveyQuestionsService.createSurveyQuestion(payload);
    };

    this.updateSurveyQuestion = function (id, payload) {
      return surveyQuestionsService.updateSurveyQuestion(id, payload);
    };

    this.removeSurveyQuestion = function (id) {
      return surveyQuestionsService.removeSurveyQuestion(id);
    };

    this.getCompanyId = function () {
      return globalMenuService.company.get();
    };

    return {
      getSurveyQuestion: this.getSurveyQuestion,
      getSurveyQuestions: this.getSurveyQuestions,
      createSurveyQuestion: this.createSurveyQuestion,
      updateSurveyQuestion: this.updateSurveyQuestion,
      removeSurveyQuestion: this.removeSurveyQuestion,
      getCompanyId: this.getCompanyId
    };
  });
