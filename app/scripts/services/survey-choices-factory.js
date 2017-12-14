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

    this.removeSurveyChoice = function (id) {
      return surveyChoicesService.removeSurveyChoice(id);
    };

    return {
      getSurveyChoices: this.getSurveyChoices,
      removeSurveyChoice: this.removeSurveyChoice
    };
  });
